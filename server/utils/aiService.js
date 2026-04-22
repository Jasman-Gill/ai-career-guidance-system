import axios from "axios";
import { extractResumeEntitiesWithBert } from "./huggingFaceService.js";

const normalizeModelName = (modelName = "") =>
    String(modelName).replace(/^models\//, "").trim();

const extractTextList = (value, preferredKeys = []) => {
    if (typeof value === "string" || typeof value === "number") {
        const text = String(value).trim();
        return text ? [text] : [];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => extractTextList(item, preferredKeys));
    }

    if (value && typeof value === "object") {
        for (const key of preferredKeys) {
            if (value[key] !== undefined) {
                const extracted = extractTextList(value[key], preferredKeys);
                if (extracted.length) {
                    return extracted;
                }
            }
        }

        const fallback = Object.values(value).flatMap((item) =>
            extractTextList(item, preferredKeys)
        );
        return fallback;
    }

    return [];
};

const uniqueStrings = (values) =>
    [...new Set((values || []).map((item) => String(item).trim()).filter(Boolean))];

const normalizeSkillToken = (value = "") =>
    String(value)
        .toLowerCase()
        .replace(/\(.*?\)/g, " ")
        .replace(/[^a-z0-9+#/.]/g, " ")
        .replace(/\bframeworks?\b/g, " ")
        .replace(/\blibraries?\b/g, " ")
        .replace(/\btools?\b/g, " ")
        .replace(/\bservices?\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const getSkillAliases = (value = "") => {
    const base = normalizeSkillToken(value);
    const aliases = new Set([base]);

    const aliasGroups = [
        ["js", "javascript"],
        ["ts", "typescript"],
        ["react", "react js", "react.js"],
        ["node", "node js", "node.js", "nodejs"],
        ["express", "express js", "express.js"],
        ["next", "next js", "next.js", "nextjs"],
        ["mongo", "mongodb", "mongo db"],
        ["sql", "sql server", "mysql", "postgresql", "postgres"],
        ["aws", "amazon web services"],
        ["gcp", "google cloud", "google cloud platform"],
        ["ci cd", "cicd", "ci/cd"],
        ["rest api", "rest", "apis"],
        ["oop", "object oriented programming"],
        ["dsa", "data structures and algorithms"],
    ];

    for (const group of aliasGroups) {
        if (group.includes(base)) {
            group.forEach((item) => aliases.add(item));
        }
    }

    return [...aliases].filter(Boolean);
};

const isSkillAlreadyPresent = (targetSkill, currentSkills) => {
    const targetAliases = getSkillAliases(targetSkill);

    return currentSkills.some((skill) => {
        const currentAliases = getSkillAliases(skill);

        return (
            targetAliases.some((alias) => currentAliases.includes(alias)) ||
            currentAliases.some((alias) => targetAliases.includes(alias))
        );
    });
};

const normalizeAiResult = (result) => {
    const skills = uniqueStrings(
        extractTextList(result?.skills, ["skill", "name", "title", "label", "text"])
    );
    const careers = uniqueStrings(
        extractTextList(result?.careers, ["career", "role", "title", "name", "label", "text"])
    );
    const missingSkills = uniqueStrings(
        extractTextList(result?.missingSkills, [
            "missingSkills",
            "skills",
            "skill",
            "skillName",
            "name",
            "title",
            "label",
            "text",
        ])
    )
        .filter((item) => !careers.includes(item))
        .filter((item) => !isSkillAlreadyPresent(item, skills));

    return {
        ...result,
        skills,
        careers,
        missingSkills,
        summary: typeof result?.summary === "string" ? result.summary.trim() : "",
    };
};

const getSupportedGeminiModels = async (geminiApiKey) => {
    const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`,
        { timeout: 20000 }
    );

    const models = response?.data?.models || [];
    return models
        .filter(
            (m) =>
                Array.isArray(m.supportedGenerationMethods) &&
                m.supportedGenerationMethods.includes("generateContent") &&
                String(m.name || "").includes("gemini")
        )
        .map((m) => normalizeModelName(m.name));
};

export const analyzeResumeWithAI = async (data) => {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!geminiApiKey) {
            throw new Error("GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured in server/.env");
        }

        const maxResumeChars = 12000;
        const resumeText = String(data?.resumeText || "").slice(0, maxResumeChars);
        const manualSkills = Array.isArray(data?.manualSkills)
            ? data.manualSkills.join(", ")
            : String(data?.manualSkills || "");
        const interests = Array.isArray(data?.interests)
            ? data.interests.join(", ")
            : String(data?.interests || "");
        const dreamRole = String(data?.dreamRole || "").trim();
        const dreamCompany = String(data?.dreamCompany || "").trim();
        const bertExtraction = await extractResumeEntitiesWithBert(resumeText);
        const bertSummary = `
    Hugging Face BERT NER Extraction:
    Persons: ${bertExtraction.persons.join(", ") || "None"}
    Organizations: ${bertExtraction.organizations.join(", ") || "None"}
    Locations: ${bertExtraction.locations.join(", ") || "None"}
    Miscellaneous: ${bertExtraction.miscellaneous.join(", ") || "None"}
    `;

        const prompt = `
    Analyze the following resume and user input:

    Resume Text:
    ${resumeText}

    User Skills:
    ${manualSkills}

    Interests:
    ${interests}

    Target Job Role:
    ${dreamRole || "Not specified"}

    Target Company:
    ${dreamCompany || "Not specified"}

    Resume Entities Extracted by BERT NER:
    ${bertSummary}

    Tasks:
    1. Extract all technical and soft skills that are already present in the resume and user input
    2. Suggest top 3 suitable career paths
    3. Infer the current industry-standard skills expected for the selected role and company
    4. Identify the missing skills as one flat list of skill names only, and do not include any skill that already appears in the candidate profile
    5. Prioritize only the most relevant missing skills for the selected role and company
    6. Provide a step-by-step learning roadmap for 3 months split into 3 separate phases only:
       - Phase 1: Month 1 foundation
       - Phase 2: Month 2 practice and projects
       - Phase 3: Month 3 proof, interview prep, and applications
       Keep each phase short, practical, and clearly different from the others. Do not combine the full 3 months into one single phase or paragraph.
    7. Provide a short summary of the candidate's current profile and strengths

    Return response in JSON format like:
    {
      "skills": [],
      "careers": [],
      "marketRequiredSkills": [],
      "missingSkills": [],
      "roadmap": [
        "",
        "",
        ""
      ],
      "summary": ""
    }
    `;

        const preferredModels = process.env.GEMINI_MODEL
            ? [normalizeModelName(process.env.GEMINI_MODEL)]
            : ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

        let models = preferredModels;
        try {
            const supportedModels = await getSupportedGeminiModels(geminiApiKey);

            const preferredSupported = preferredModels.filter((m) => supportedModels.includes(m));
            const remainingSupported = supportedModels.filter(
                (m) => !preferredSupported.includes(m)
            );

            models = [...preferredSupported, ...remainingSupported];
        } catch (listModelsError) {
            console.warn(
                "Could not fetch Gemini model list, using local fallback models:",
                listModelsError?.response?.data?.error?.message || listModelsError.message
            );
        }

        let response;
        let lastError;

        for (const model of models) {
            try {
                response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
                    {
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                        generationConfig: {
                            responseMimeType: "application/json",
                        },
                    },
                    {
                        timeout: 30000,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                break;
            } catch (modelError) {
                lastError = modelError;
            }
        }

        if (!response) {
            throw lastError || new Error("No response from AI model");
        }

        const content = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            throw new Error("Gemini returned an empty response");
        }

        let parsedContent;

        try {
            parsedContent = JSON.parse(content);
        } catch {
            throw new Error("Gemini returned invalid JSON");
        }

        return {
            ...normalizeAiResult(parsedContent),
            bertExtraction,
        };
    } catch (error) {
        const apiErrorMessage =
            error?.response?.data?.error?.message || error.message || "Unknown error";
        console.error("Gemini analysis error:", apiErrorMessage);
        throw new Error(`AI Analysis Failed: ${apiErrorMessage}`);
    }
};
