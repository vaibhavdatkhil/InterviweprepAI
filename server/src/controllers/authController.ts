import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// ── helpers ───────────────────────────────────────────

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

// Only return safe fields — never the password hash
const safeUser = (user: any) => ({
  _id:   user._id,
  name:  user.name,
  email: user.email,
});

// ── register ──────────────────────────────────────────

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      token: signToken(user._id.toString()),
      user:  safeUser(user),
    });

  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ── login ─────────────────────────────────────────────

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      token: signToken(user._id.toString()),
      user:  safeUser(user),
    });

  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
