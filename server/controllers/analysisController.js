import Resume from "../models/Resume.js";
import { analyzeResumeWithAI } from "../utils/aiService.js";

export const analyzeResume = async (req, res) => {
    try {
        const { userId, manualSkills, interests } = req.body;

        const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const aiResult = await analyzeResumeWithAI({
            resumeText: resume.extractedText,
            manualSkills,
            interests,
        });

        res.json({
            message: "AI Analysis Complete",
            result: aiResult,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
