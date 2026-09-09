import express from "express";
import { runCode, submitSolution } from "../controllers/codeController";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/code/run (run raw code snippet)
router.post("/run", runCode);

// POST /api/code/submit (submit solution against actual test cases and save to DB)
router.post("/submit", verifyToken, submitSolution);

export default router;