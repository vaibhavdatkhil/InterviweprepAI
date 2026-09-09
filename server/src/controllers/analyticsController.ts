import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Submission from "../models/Submission";
import MockInterview from "../models/MockInterview";
import Progress from "../models/Progress";
import Activity from "../models/Activity";

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Authentication required." });

    // 1. User Progress
    const progress = await Progress.findOne({ userId });
    const questionsSolved = progress ? progress.questionsSolved : 0;
    const streak = progress ? progress.currentStreak : 0;

    // 2. Submissions Breakdown
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ userId, status: "Accepted" });
    const accuracyRate =
      totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : null;

    // 3. Mock Interviews Breakdown
    const interviews = await MockInterview.find({ userId, status: "completed" });
    const totalInterviews = interviews.length;
    const avgInterviewScore =
      totalInterviews > 0
        ? Math.round(interviews.reduce((acc, i) => acc + (i.finalScore || 0), 0) / totalInterviews)
        : null;

    // 4. Past 7 Days Weekly Progress Line Chart
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    const weeklyProgress: Array<{ day: string; solved: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      // Day of week format
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      const dayName = days[dayIdx];

      const count = await Activity.countDocuments({
        userId,
        type: "problem_solved",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      weeklyProgress.push({
        day: dayName,
        solved: count,
      });
    }

    // 5. Difficulty Distribution
    // Calculate from actual accepted submissions
    const acceptedList = await Submission.find({ userId, status: "Accepted" });
    const problemMap = new Map<string, string>();
    acceptedList.forEach((sub) => {
      // Map problemId or title
      problemMap.set(sub.problemId, sub.problemTitle);
    });

    // Real difficulty breakdown
    // q1 is Easy, q2 is Medium, q3 is Hard, q4 is Easy, q5 is Medium
    let easyCount = 0;
    let medCount = 0;
    let hardCount = 0;

    problemMap.forEach((_, id) => {
      if (id === "q1" || id === "q4") easyCount++;
      else if (id === "q2" || id === "q5") medCount++;
      else if (id === "q3") hardCount++;
      else easyCount++;
    });

    const totalProblemsSolved = easyCount + medCount + hardCount;
    let difficultyData: Array<{ name: string; value: number }> = [];

    if (totalProblemsSolved > 0) {
      difficultyData = [
        { name: "Easy", value: Math.round((easyCount / totalProblemsSolved) * 100) },
        { name: "Medium", value: Math.round((medCount / totalProblemsSolved) * 100) },
        { name: "Hard", value: Math.round((hardCount / totalProblemsSolved) * 100) },
      ];
    }

    res.json({
      totalSolved: questionsSolved,
      totalSubmissions,
      acceptedSubmissions,
      accuracyRate,
      totalInterviews,
      avgInterviewScore,
      streak,
      weeklyProgress,
      difficultyData,
    });
  } catch (error: any) {
    console.error("getAnalytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics.", error: error.message });
  }
};