import express from "express";
import { getDashboardData } from "../controllers/dashboardController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/dashboard (authenticated real user dashboard)
router.get("/", verifyToken, getDashboardData);

export default router;
