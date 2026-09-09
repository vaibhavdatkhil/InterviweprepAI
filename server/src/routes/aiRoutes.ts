import express from "express";
import { reviewCode, getLatestReview } from "../controllers/aiController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/ai/review (authenticated real code review)
router.post("/review", verifyToken, reviewCode);

// GET /api/ai/latest-review (fetch latest review from database)
router.get("/latest-review", verifyToken, getLatestReview);

export default router;