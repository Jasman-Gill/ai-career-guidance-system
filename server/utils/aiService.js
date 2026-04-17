import axios from "axios";

const normalizeModelName = (modelName = "") =>
    String(modelName).replace(/^models\//, "").trim();

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

        const prompt = `
    Analyze the following resume and user input:

    Resume Text:
    ${resumeText}

    User Skills:
    ${manualSkills}

    Interests:
    ${interests}

    Tasks:
    1. Extract all technical and soft skills
    2. Suggest top 3 suitable career paths
    3. Identify missing skills for each career
    4. Provide a step-by-step learning roadmap (3 months)

    Return response in JSON format like:
    {
      "skills": [],
      "careers": [],
      "missingSkills": [],
      "roadmap": ""
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

        return content;
    } catch (error) {
        const apiErrorMessage =
            error?.response?.data?.error?.message || error.message || "Unknown error";
        console.error("Gemini analysis error:", apiErrorMessage);
        throw new Error(`AI Analysis Failed: ${apiErrorMessage}`);
    }
};