import express from "express";
import {
	registerUser,
	loginUser,
	googleLogin,
	updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.put("/profile", updateProfile);

export default router;