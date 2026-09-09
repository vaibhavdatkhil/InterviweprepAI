import express from "express";
import { getAnalytics } from "../controllers/analyticsController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/analytics (authenticated real user analytics)
router.get("/", verifyToken, getAnalytics);

export default router;