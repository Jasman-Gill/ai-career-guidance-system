import Resume from "../models/Resume.js";
import { analyzeResumeWithAI } from "../utils/aiService.js";

export const analyzeResume = async (req, res) => {
    try {
        const { userId, manualSkills, interests, dreamRole, dreamCompany } = req.body;

        const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const aiResult = await analyzeResumeWithAI({
            resumeText: resume.extractedText,
            manualSkills,
            interests,
            dreamRole,
            dreamCompany,
        });

        resume.analysisResult = aiResult;
        resume.dreamRole = typeof dreamRole === "string" ? dreamRole.trim() : "";
        resume.dreamCompany =
            typeof dreamCompany === "string" ? dreamCompany.trim() : "";
        resume.manualSkills = Array.isArray(manualSkills)
            ? manualSkills.filter((item) => typeof item === "string" && item.trim())
            : [];
        resume.interests = Array.isArray(interests)
            ? interests.filter((item) => typeof item === "string" && item.trim())
            : [];

        await resume.save();

        res.json({
            message: "AI Analysis Complete",
            result: aiResult,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLatestAnalysis = async (req, res) => {
    try {
        const { userId } = req.params;

        const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

        if (!resume || !resume.analysisResult) {
            return res.status(404).json({ message: "No saved analysis found" });
        }

        return res.json({
            result: resume.analysisResult,
            context: {
                dreamRole: resume.dreamRole || "",
                dreamCompany: resume.dreamCompany || "",
                manualSkills: Array.isArray(resume.manualSkills) ? resume.manualSkills : [],
                interests: Array.isArray(resume.interests) ? resume.interests : [],
                resumeFileName: resume.originalFileName || "",
                generatedAt: resume.updatedAt,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
