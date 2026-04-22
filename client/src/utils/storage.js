function safeReadJSON(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function uniqueStrings(values) {
    return [...new Set((values || []).map((item) => String(item).trim()).filter(Boolean))];
}

function extractDisplayText(value) {
    if (typeof value === "string" || typeof value === "number") {
        return String(value).trim();
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => extractDisplayText(item))
            .filter(Boolean)
            .join(", ")
            .trim();
    }

    if (value && typeof value === "object") {
        const preferredKeys = [
            "skill",
            "name",
            "title",
            "career",
            "role",
            "label",
            "text",
            "description",
        ];

        for (const key of preferredKeys) {
            if (value[key]) {
                const extracted = extractDisplayText(value[key]);
                if (extracted) {
                    return extracted;
                }
            }
        }

        const fallback = Object.values(value)
            .map((item) => extractDisplayText(item))
            .filter(Boolean)
            .join(" - ")
            .trim();

        return fallback;
    }

    return "";
}

function extractMissingSkillValues(value) {
    if (typeof value === "string" || typeof value === "number") {
        return [String(value).trim()].filter(Boolean);
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => extractMissingSkillValues(item)).filter(Boolean);
    }

    if (value && typeof value === "object") {
        const prioritizedSkillKeys = [
            "missingSkills",
            "skills",
            "skill",
            "skillName",
            "name",
            "title",
            "label",
        ];

        for (const key of prioritizedSkillKeys) {
            if (value[key]) {
                const extracted = extractMissingSkillValues(value[key]);
                if (extracted.length) {
                    return extracted;
                }
            }
        }
    }

    return [];
}

function toArray(value) {
    if (Array.isArray(value)) {
        return uniqueStrings(value.map((item) => extractDisplayText(item)));
    }

    if (typeof value === "string") {
        return uniqueStrings(value.split(/[\n,]/));
    }

    return [];
}

function splitRoadmapDescription(description = "", desiredPhaseCount = 3) {
    const cleaned = String(description || "")
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) {
        return [];
    }

    const sentenceParts = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.replace(/^\d+[\).\s-]*/, "").trim())
        .filter(Boolean);

    const chunkableParts =
        sentenceParts.length > 1
            ? sentenceParts
            : cleaned
                  .split(/(?:,|;|\band\b|\bthen\b)/i)
                  .map((item) => item.replace(/^\d+[\).\s-]*/, "").trim())
                  .filter(Boolean);

    if (!chunkableParts.length) {
        return [];
    }

    const targetCount = Math.min(
        Math.max(desiredPhaseCount, 1),
        Math.max(chunkableParts.length, 1)
    );
    const result = [];

    for (let index = 0; index < targetCount; index += 1) {
        const start = Math.floor((index * chunkableParts.length) / targetCount);
        const end = Math.floor(((index + 1) * chunkableParts.length) / targetCount);
        const chunk = chunkableParts.slice(start, end).join(". ").trim();

        if (chunk) {
            result.push(chunk.endsWith(".") ? chunk : `${chunk}.`);
        }
    }

    return result;
}

function inferRoadmapPhaseCount(text = "") {
    const normalized = String(text || "").toLowerCase();

    if (!normalized) {
        return 0;
    }

    if (/\b(90[\s-]?day|three[\s-]?month|3[\s-]?month)\b/.test(normalized)) {
        return 3;
    }

    const monthMatch = normalized.match(/\b(\d+)\s*months?\b/);
    if (monthMatch) {
        const months = Number(monthMatch[1]);
        if (months >= 2 && months <= 12) {
            return months;
        }
    }

    return 0;
}

function parseRoadmap(rawRoadmap) {
    if (Array.isArray(rawRoadmap)) {
        const normalizedSteps = rawRoadmap
            .map((step) => extractDisplayText(step))
            .filter(Boolean);

        if (normalizedSteps.length === 1) {
            const inferredCount = inferRoadmapPhaseCount(normalizedSteps[0]) || 3;
            const splitSteps = splitRoadmapDescription(normalizedSteps[0], inferredCount);

            if (splitSteps.length > 1) {
                return splitSteps.map((step, index) => ({
                    title: `Phase ${index + 1}`,
                    description: step,
                }));
            }
        }

        return normalizedSteps.map((step, index) => ({
            title: `Phase ${index + 1}`,
            description: step,
        }));
    }

    if (typeof rawRoadmap === "string") {
        const steps = rawRoadmap
            .split(/\n+/)
            .map((step) => step.replace(/^\d+[\).\s-]*/, "").trim())
            .filter(Boolean);

        if (steps.length === 1) {
            const inferredCount = inferRoadmapPhaseCount(steps[0]) || 3;
            const splitSteps = splitRoadmapDescription(steps[0], inferredCount);

            if (splitSteps.length > 1) {
                return splitSteps.map((step, index) => ({
                    title: `Phase ${index + 1}`,
                    description: step,
                }));
            }
        }

        return steps.map((step, index) => ({
            title: `Phase ${index + 1}`,
            description: step,
        }));
    }

    return [];
}

function calculateAlignment(skills, missingSkills) {
    const total = skills.length + missingSkills.length;

    if (!total) {
        return 68;
    }

    const ratio = skills.length / total;
    return Math.max(45, Math.min(96, Math.round(ratio * 100)));
}

export function normalizeAnalysisResult(rawResult, context = {}) {
    let parsed = rawResult;

    if (typeof rawResult === "string") {
        try {
            parsed = JSON.parse(rawResult);
        } catch {
            parsed = {};
        }
    }

    const skills = uniqueStrings(
        [...(parsed?.skills || []), ...(context.manualSkills || [])].map((item) =>
            extractDisplayText(item)
        )
    );
    const missingSkills = uniqueStrings(extractMissingSkillValues(parsed?.missingSkills));
    const careers = toArray(parsed?.careers);
    const roadmapSteps = parseRoadmap(parsed?.roadmap);
    const alignmentScore = calculateAlignment(skills, missingSkills);

    return {
        skills,
        missingSkills,
        careers,
        roadmap: typeof parsed?.roadmap === "string" ? parsed.roadmap : roadmapSteps.map((step) => step.description).join("\n"),
        roadmapSteps,
        alignmentScore,
        bertExtraction: parsed?.bertExtraction || null,
        dreamRole: context.dreamRole || parsed?.dreamRole || "",
        dreamCompany: context.dreamCompany || parsed?.dreamCompany || "",
        interests: uniqueStrings(context.interests || parsed?.interests || []),
        resumeFileName: context.resumeFileName || parsed?.resumeFileName || "",
        summary:
            parsed?.summary ||
            `Your profile is ${alignmentScore}% aligned with the current market direction for ${context.dreamRole || "your target role"}.`,
        generatedAt: new Date().toISOString(),
    };
}

export function readStoredUser() {
    return safeReadJSON("user");
}

export function writeStoredUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userUpdated"));
}

export function readStoredAnalysis() {
    const stored = safeReadJSON("analysis");

    if (!stored) {
        return null;
    }

    const normalized = normalizeAnalysisResult(stored, {
        dreamRole: stored?.dreamRole || "",
        dreamCompany: stored?.dreamCompany || "",
        interests: stored?.interests || [],
        resumeFileName: stored?.resumeFileName || "",
        manualSkills: [],
    });

    if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
        writeStoredAnalysis(normalized);
    }

    return normalized;
}

export function writeStoredAnalysis(analysis) {
    localStorage.setItem("analysis", JSON.stringify(analysis));
}

export async function restoreStoredAnalysisForUser(api, user) {
    if (!user?._id) {
        return null;
    }

    try {
        const { data } = await api.get(`/analysis/latest/${user._id}`);
        const normalized = normalizeAnalysisResult(data?.result, data?.context || {});
        writeStoredAnalysis(normalized);
        return normalized;
    } catch {
        localStorage.removeItem("analysis");
        return null;
    }
}

export function readPreferences() {
    return safeReadJSON("preferences", {
        notifications: true,
        weeklySummary: true,
        jobAlerts: true,
    });
}

export function writePreferences(preferences) {
    localStorage.setItem("preferences", JSON.stringify(preferences));
}

export function clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("analysis");
}
