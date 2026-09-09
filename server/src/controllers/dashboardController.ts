import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Progress from "../models/Progress";
import Submission from "../models/Submission";
import MockInterview from "../models/MockInterview";
import ResumeAnalysis from "../models/ResumeAnalysis";
import Activity from "../models/Activity";

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Authentication required." });

    // 1. Fetch User Progress
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
      });
    }

    // 2. Fetch User Latest Resume
    const latestResume = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });

    // 3. Fetch Completed Mock Interviews
    const interviews = await MockInterview.find({ userId, status: "completed" });
    const avgInterviewScore =
      interviews.length > 0
        ? Math.round(interviews.reduce((sum, i) => sum + (i.finalScore || 0), 0) / interviews.length)
        : null;

    // 4. Fetch Submissions stats
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ userId, status: "Accepted" });

    // 5. Calculate Real Readiness Score (Transparent Formula)
    // Only calculate if user has actual activity; otherwise return null ("Not enough data")
    const totalActivityCount = progress.questionsSolved + interviews.length + (latestResume ? 1 : 0);
    let readinessScore: number | null = null;
    let readinessLabel = "Not enough data";

    if (totalActivityCount >= 2) {
      // Problem Solving component (max 35)
      const dsaPoints = Math.min(35, Math.round((progress.questionsSolved / 15) * 35));

      // Mock Interview component (max 35)
      const interviewPoints = avgInterviewScore !== null ? Math.round((avgInterviewScore / 100) * 35) : 0;

      // Resume component (max 20)
      const resumePoints = latestResume ? Math.round((latestResume.atsScore / 100) * 20) : 0;

      // Streak / habit component (max 10)
      const streakPoints = Math.min(10, progress.currentStreak * 2);

      readinessScore = Math.min(99, dsaPoints + interviewPoints + resumePoints + streakPoints);

      if (readinessScore >= 80) readinessLabel = "Interview Ready";
      else if (readinessScore >= 60) readinessLabel = "Proficient";
      else readinessLabel = "Developing";
    }

    // 6. Recent User Activity
    const recentActivity = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: {
        questionsSolved: progress.questionsSolved,
        interviewsCompleted: progress.interviewsCompleted,
        xp: progress.xp,
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        readinessScore,
        readinessLabel,
        latestAtsScore: latestResume ? latestResume.atsScore : null,
        totalSubmissions,
        acceptedSubmissions,
      },
      recentActivity,
    });
  } catch (error: any) {
    console.error("getDashboardData error:", error);
    res.status(500).json({ message: "Failed to load dashboard data.", error: error.message });
  }
};
