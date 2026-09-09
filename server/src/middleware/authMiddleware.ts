import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Authentication token required.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "demo-offline-jwt-token" || token === "null" || token === "undefined") {
      return res.status(401).json({
        message: "Invalid session. Please log in with a valid account.",
      });
    }

    const secret = process.env.JWT_SECRET || "supersecretkey";
    const decoded = jwt.verify(token, secret) as { id: string };

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Malformed authentication token.",
      });
    }

    // Verify user exists in database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User account not found. Please log in again.",
      });
    }

    req.userId = user._id.toString();
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Session expired or invalid. Please sign in again.",
    });
  }
};

export default verifyToken;
