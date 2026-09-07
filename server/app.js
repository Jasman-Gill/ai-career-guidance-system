import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins.length ? allowedOrigins : true,
    })
);
app.use(express.json());

// Reuse MongoDB connections across warm serverless invocations.
app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
    res.send("AI Career Guidance API is running");
});

app.use((error, _req, res, _next) => {
    console.error("API error:", error.message);
    res.status(error.statusCode || 500).json({
        message: error.message || "Something went wrong while processing your request.",
    });
});

export default app;
