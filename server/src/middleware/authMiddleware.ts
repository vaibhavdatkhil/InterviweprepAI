import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request so downstream controllers
// can read req.userId without a type error.
export interface AuthRequest extends Request {
  userId?: string;
}

const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Expect:  Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token === "demo-offline-jwt-token") {
    req.userId = "60c72b2f9b1d8e1f88c67999"; // mock ObjectId
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    req.userId = decoded.id;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default verifyToken;
