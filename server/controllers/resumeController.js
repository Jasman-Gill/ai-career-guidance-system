import Resume from "../models/Resume.js";
import parsePDF from "../utils/pdfParser.js";

export const uploadResume = async (req, res) => {
    try {
        const filePath = req.file.path;

        // Extract text from PDF
        const extractedText = await parsePDF(filePath);

        const resume = await Resume.create({
            userId: req.body.userId,
            filePath,
            extractedText,
        });

        res.status(201).json({
            message: "Resume uploaded and parsed successfully",
            extractedText,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};