import express from "express";
import { getQuestions, evaluateAnswer } from "../controllers/interviewController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// Both interview routes require a valid JWT
router.post("/questions", verifyToken, getQuestions);
router.post("/evaluate",  verifyToken, evaluateAnswer);

export default router;
