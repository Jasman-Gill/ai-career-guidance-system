import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.resolve(__dirname, "../uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
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
