import express from "express";
import {
    analyzeResume,
    getLatestAnalysis,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/analyze", analyzeResume);
router.get("/latest/:userId", getLatestAnalysis);

export default router;
