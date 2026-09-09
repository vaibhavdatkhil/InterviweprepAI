import express from "express";
import {
  getQuestions,
  evaluateAnswer,
  startInterview,
  completeInterview,
} from "../controllers/interviewController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/interview/start — start stateful interview session
router.post("/start", verifyToken, startInterview);

// POST /api/interview/questions — generate or retrieve tailored questions
router.post("/questions", verifyToken, getQuestions);

// POST /api/interview/evaluate — evaluate single answer
router.post("/evaluate", verifyToken, evaluateAnswer);

// POST /api/interview/complete — finalize session and persist scores
router.post("/complete", verifyToken, completeInterview);

export default router;
