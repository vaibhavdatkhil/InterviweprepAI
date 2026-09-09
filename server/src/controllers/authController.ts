import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Progress from "../models/Progress";
import { AuthRequest } from "../middleware/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const signToken = (id: string): string =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

const safeUser = (user: any) => ({
  id: user._id.toString(),
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const INITIAL_ACHIEVEMENTS = [
  { id: "a1", label: "First Problem Solved", icon: "⚡", unlocked: false },
  { id: "a2", label: "7 Day Streak", icon: "🔥", unlocked: false },
  { id: "a3", label: "10 Problems Solved", icon: "💯", unlocked: false },
  { id: "a4", label: "First Mock Interview", icon: "🧠", unlocked: false },
  { id: "a5", label: "ATS Resume Verified", icon: "📄", unlocked: false },
  { id: "a6", label: "Algorithm Master", icon: "🏆", unlocked: false },
];

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Initialize baseline progress document in database for new user
    await Progress.create({
      userId: user._id,
      questionsSolved: 0,
      solvedProblemIds: [],
      interviewsCompleted: 0,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: INITIAL_ACHIEVEMENTS,
    });

    const token = signToken(user._id.toString());

    res.status(201).json({
      token,
      user: safeUser(user),
      message: "Account registered successfully.",
    });
  } catch (error: any) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: error.message || "Registration failed." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
      token,
      user: safeUser(user),
      message: "Login successful.",
    });
  } catch (error: any) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: error.message || "Login failed." });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user: safeUser(user) });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch user session." });
  }
};
