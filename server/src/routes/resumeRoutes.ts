import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// POST /api/resume/analyze  — requires login
router.post(
  "/analyze",
  verifyToken,
  upload.single("resume"),
  analyzeResume
);

export default router;
