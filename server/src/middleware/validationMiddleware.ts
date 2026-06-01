import { Request, Response, NextFunction } from "express";

// ── Helpers ───────────────────────────────────────────

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sendErrors = (
  res: Response,
  errors: string[]
) => {
  res.status(400).json({ errors });
};

// ── Register validator ────────────────────────────────
// Rules:
//   name     – required, 2–50 chars
//   email    – required, valid format
//   password – required, min 6 chars

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }
  if (name && name.trim().length > 50) {
    errors.push("Name must be 50 characters or fewer.");
  }

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    errors.push("A valid email address is required.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return sendErrors(res, errors);
  }

  // Sanitise before passing to controller
  req.body.name  = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

// ── Login validator ───────────────────────────────────
// Rules:
//   email    – required, valid format
//   password – required

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    errors.push("A valid email address is required.");
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push("Password is required.");
  }

  if (errors.length > 0) {
    return sendErrors(res, errors);
  }

  req.body.email = email.trim().toLowerCase();

  next();
};
