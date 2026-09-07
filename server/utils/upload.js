import multer from "multer";

const upload = multer({
    // Serverless filesystems are ephemeral; parse the PDF directly from memory.
    storage: multer.memoryStorage(),
    limits: {
        // Vercel Functions accept request bodies up to 4.5 MB.
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const isPdf =
            file.mimetype === "application/pdf" ||
            String(file.originalname || "").toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            cb(new Error("Only PDF resumes are supported right now. Please upload a .pdf file."));
            return;
        }

        cb(null, true);
    },
});

export default upload;
