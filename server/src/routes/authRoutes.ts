import express from "express";
import * as authController from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validationMiddleware";

const router = express.Router();

// POST /api/auth/register
// validateRegister runs first — bad input is rejected before hitting the DB
router.post("/register", validateRegister, authController.registerUser);

// POST /api/auth/login
router.post("/login", validateLogin, authController.loginUser);

export default router;
