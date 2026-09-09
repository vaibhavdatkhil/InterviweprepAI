import express from "express";
import * as authController from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validationMiddleware";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateRegister, authController.registerUser);

// POST /api/auth/login
router.post("/login", validateLogin, authController.loginUser);

// GET /api/auth/me (session revalidation)
router.get("/me", verifyToken, authController.getMe);

export default router;
