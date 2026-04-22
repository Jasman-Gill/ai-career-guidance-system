import Resume from "../models/Resume.js";
import parsePDF from "../utils/pdfParser.js";

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required. Please upload a PDF resume.",
            });
        }

        const filePath = req.file.path;

        // Extract text from PDF
        const extractedText = await parsePDF(filePath);

        if (!String(extractedText || "").trim()) {
            return res.status(400).json({
                message: "We could not read text from this PDF. Try another PDF export of your resume.",
            });
        }

        const resume = await Resume.create({
            userId: req.body.userId,
            filePath,
            originalFileName: req.file.originalname,
            extractedText,
        });

        res.status(201).json({
            message: "Resume uploaded and parsed successfully",
            extractedText,
        });
    } catch (error) {
        const statusCode =
            error.message?.includes("Only PDF resumes are supported") ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};
