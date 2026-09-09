import express from "express";
import multer from "multer";
import { analyzeResume, getLatestResume } from "../controllers/resumeController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// POST /api/resume/analyze — requires login
router.post(
  "/analyze",
  verifyToken,
  upload.single("resume"),
  analyzeResume
);

// GET /api/resume/latest — fetch user's latest analysis
router.get("/latest", verifyToken, getLatestResume);

export default router;
