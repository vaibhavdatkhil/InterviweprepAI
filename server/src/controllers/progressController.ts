import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Progress from "../models/Progress";
import Activity from "../models/Activity";

const DEFAULT_ACHIEVEMENTS = [
  { id: "a1", label: "First Problem Solved", icon: "⚡", unlocked: false },
  { id: "a2", label: "7 Day Streak", icon: "🔥", unlocked: false },
  { id: "a3", label: "10 Problems Solved", icon: "💯", unlocked: false },
  { id: "a4", label: "First Mock Interview", icon: "🧠", unlocked: false },
  { id: "a5", label: "ATS Resume Verified", icon: "📄", unlocked: false },
  { id: "a6", label: "Algorithm Master", icon: "🏆", unlocked: false },
];

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Authentication required." });

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        questionsSolved: 0,
        solvedProblemIds: [],
        interviewsCompleted: 0,
        xp: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: DEFAULT_ACHIEVEMENTS,
      });
    }

    // Ensure achievements exist
    if (!progress.achievements || progress.achievements.length === 0) {
      progress.achievements = DEFAULT_ACHIEVEMENTS as any;
      await progress.save();
    }

    // Calculate real 7-day activity from Activity collection
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const past7Days: Array<{ day: string; dateStr: string; solved: number; active: boolean }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const dayName = days[d.getDay()];
      const solvedCount = await Activity.countDocuments({
        userId,
        type: "problem_solved",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      past7Days.push({
        day: dayName,
        dateStr: d.toISOString().split("T")[0],
        solved: solvedCount,
        active: solvedCount > 0,
      });
    }

    res.json({
      streak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      xp: progress.xp,
      questionsSolved: progress.questionsSolved,
      interviews: progress.interviewsCompleted,
      weeklyActivity: past7Days,
      achievements: progress.achievements,
    });
  } catch (error: any) {
    console.error("getProgress error:", error);
    res.status(500).json({ message: "Failed to fetch progress.", error: error.message });
  }
};