import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { runRawCode, executeProblemSubmission } from "../services/codeExecutionService";
import Submission from "../models/Submission";
import Progress from "../models/Progress";
import Activity from "../models/Activity";

/**
 * Run arbitrary user code in the isolated sandbox.
 */
export const runCode = async (req: AuthRequest, res: Response) => {
  try {
    const { language, code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Code content is required." });
    }

    const { stdout, stderr, runtimeMs, timedOut } = await runRawCode(
      language || "javascript",
      code,
      3000
    );

    res.json({
      run: {
        stdout,
        stderr,
        output: timedOut ? "Execution timed out (3000ms limit)." : stdout || stderr,
        code: timedOut ? 124 : stderr ? 1 : 0,
      },
      runtimeMs,
      timedOut,
    });
  } catch (error: any) {
    console.error("runCode error:", error);
    res.status(500).json({
      error: "Execution unavailable",
      details: error.message,
    });
  }
};

/**
 * Submit solution for verification against hidden test cases.
 */
export const submitSolution = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { problemId, problemTitle, language, code } = req.body;

    if (!code || !problemId) {
      return res.status(400).json({ message: "problemId and code are required." });
    }

    // Real test execution
    const execution = await executeProblemSubmission(problemId, language || "javascript", code);

    // Save submission to database
    const submission = await Submission.create({
      userId,
      problemId,
      problemTitle: problemTitle || problemId,
      language: language || "javascript",
      code,
      status: execution.status,
      runtimeMs: execution.runtimeMs,
      passedTests: execution.passedTests,
      totalTests: execution.totalTests,
      testOutputs: execution.testResults,
      error: execution.error || "",
    });

    let updatedProgress: any = null;

    // Only update progress and XP if the submission was accepted
    if (execution.status === "Accepted") {
      let progress = await Progress.findOne({ userId });
      if (!progress) {
        progress = await Progress.create({
          userId,
          questionsSolved: 0,
          solvedProblemIds: [],
          interviewsCompleted: 0,
          xp: 0,
          currentStreak: 1,
          longestStreak: 1,
        });
      }

      const isFirstSolve = !progress.solvedProblemIds.includes(problemId);
      if (isFirstSolve) {
        progress.solvedProblemIds.push(problemId);
        progress.questionsSolved = progress.solvedProblemIds.length;
        progress.xp += 25; // Real XP for solving a problem
      }

      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (progress.lastActiveDate) {
        const lastDate = new Date(progress.lastActiveDate);
        lastDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          progress.currentStreak += 1;
          if (progress.currentStreak > progress.longestStreak) {
            progress.longestStreak = progress.currentStreak;
          }
        } else if (diffDays > 1) {
          progress.currentStreak = 1;
        }
      } else {
        progress.currentStreak = 1;
        progress.longestStreak = 1;
      }
      progress.lastActiveDate = new Date();

      // Check achievements
      if (progress.achievements && progress.achievements.length > 0) {
        for (const ach of progress.achievements) {
          if (ach.id === "a1" && progress.questionsSolved >= 1 && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = new Date();
          }
          if (ach.id === "a2" && progress.currentStreak >= 7 && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = new Date();
          }
          if (ach.id === "a3" && progress.questionsSolved >= 10 && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = new Date();
          }
        }
      }

      await progress.save();
      updatedProgress = progress;

      // Record Activity
      await Activity.create({
        userId,
        type: "problem_solved",
        title: `Solved ${problemTitle || problemId}`,
        details: `Passed all ${execution.totalTests} test cases in ${execution.runtimeMs}ms (${language})`,
        xpEarned: isFirstSolve ? 25 : 0,
      });
    }

    res.json({
      success: execution.status === "Accepted",
      submissionId: submission._id,
      status: execution.status,
      output: execution.output,
      error: execution.error,
      runtimeMs: execution.runtimeMs,
      passedTests: execution.passedTests,
      totalTests: execution.totalTests,
      testResults: execution.testResults,
      updatedProgress,
    });
  } catch (error: any) {
    console.error("submitSolution error:", error);
    res.status(500).json({
      message: "Submission failed.",
      error: error.message,
    });
  }
};