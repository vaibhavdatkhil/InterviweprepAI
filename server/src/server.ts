import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB    from "./config/db";
import authRoutes  from "./routes/authRoutes";
import aiRoutes    from "./routes/aiRoutes";
import resumeRoutes    from "./routes/resumeRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import progressRoutes from "./routes/progressRoutes";
import codeRoutes
from "./routes/codeRoutes";

dotenv.config();
connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────
// Only allow requests from your frontend origins.
// Add your production URL to ALLOWED_ORIGINS in .env
// e.g.  ALLOWED_ORIGINS=https://prepai.com,https://www.prepai.com

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin), listed origins, and any local host port
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' is not allowed.`));
      }
    },
    credentials: true,
  })
);

app.use(
  "/api/code",
  codeRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

// ── Body parsing ──────────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/ai",        aiRoutes);
app.use("/api/resume",    resumeRoutes);
app.use("/api/interview", interviewRoutes);

app.get("/", (_req, res) => {
  res.send("API Running...");
});

// ── Global error handler ──────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
