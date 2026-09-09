import express from "express";
import { getProgress } from "../controllers/progressController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/progress (authenticated real user progress)
router.get("/", verifyToken, getProgress);

export default router;