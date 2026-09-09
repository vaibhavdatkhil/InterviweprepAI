import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../middleware/authMiddleware";
import MockInterview from "../models/MockInterview";
import Progress from "../models/Progress";
import Activity from "../models/Activity";
import { generateQuestions } from "../services/aiService";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Authentication required." });

    const { trackId, trackTitle, difficulty } = req.body;

    const interview = await MockInterview.create({
      userId,
      trackId: trackId || "general",
      trackTitle: trackTitle || "Technical Interview",
      difficulty: difficulty || "Medium",
      status: "in_progress",
      responses: [],
    });

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      message: "Interview session initialized.",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to start interview session.", error: error.message });
  }
};

export const getQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    const questions = await generateQuestions(resumeText || "");
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ message: "Question Generation Failed", error: error.message });
  }
};

export const evaluateAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { interviewId, questionIndex, question, answer } = req.body;

    const cleanAnswer = (answer || "").trim();

    // 1. Validate Answer Length
    if (cleanAnswer.length < 5) {
      return res.json({
        success: true,
        score: 20,
        feedback: "The answer was too brief. Structure your technical responses using the STAR method (Situation, Task, Action, Result) with specific tools and measurable outcomes.",
      });
    }

    // 2. Technical Evaluation
    const words = cleanAnswer.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let score = 50;
    let feedback = "";

    // Keyword and complexity assessment
    const hasTechTerms = /react|node|javascript|typescript|python|api|database|sql|nosql|docker|aws|cache|async|promise|event loop|architecture|index|query|time complexity/i.test(cleanAnswer);
    const hasMetricTerms = /\b\d+%|\b\d+\s*ms\b|reduced|improved|scalable|optimized|performance/i.test(cleanAnswer);

    if (wordCount >= 40 && hasTechTerms) {
      score = 85;
      if (hasMetricTerms) score = 92;
      feedback = "Solid depth and technical terminology. Demonstrated clear situational context and reasoning.";
    } else if (wordCount >= 20) {
      score = hasTechTerms ? 75 : 60;
      feedback = "Clear communication. Adding concrete implementation metrics and architectural trade-offs will elevate your response.";
    } else {
      score = 45;
      feedback = "Response is somewhat high-level. Expand on the underlying technical mechanisms and problem-solving steps.";
    }

    // 3. AI enhancement if Groq available
    if (GROQ_API_KEY && !GROQ_API_KEY.includes("xxx") && !GROQ_API_KEY.startsWith("invalid")) {
      try {
        const aiPrompt = `You are a technical interviewer evaluating an engineering candidate's answer.
Question: ${question}
Candidate's Answer: ${cleanAnswer}

Evaluate strictly. Give a score from 0 to 100 based on technical accuracy, clarity, and depth.
Format:
Score: <number>/100
Feedback: <concise feedback highlighting strengths and specific technical improvements>`;

        const aiRes = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 5000,
          }
        );

        const aiContent = aiRes.data.choices?.[0]?.message?.content || "";
        const scoreMatch = aiContent.match(/Score:\s*(\d+)/i) || aiContent.match(/(\d+)\/100/);
        if (scoreMatch) score = parseInt(scoreMatch[1], 10);
        if (aiContent.includes("Feedback:")) {
          feedback = aiContent.split("Feedback:")[1].trim();
        }
      } catch (aiErr) {
        // Fallback to algorithmic scoring
      }
    }

    // 4. Save to MockInterview if interviewId provided
    if (userId && interviewId) {
      try {
        await MockInterview.findOneAndUpdate(
          { _id: interviewId, userId },
          {
            $push: {
              responses: {
                questionIndex: questionIndex || 0,
                question,
                answer: cleanAnswer,
                score,
                feedback,
              },
            },
          }
        );
      } catch (dbErr) {
        console.warn("Failed to persist answer in interview session:", dbErr);
      }
    }

    res.json({
      success: true,
      score,
      feedback,
    });
  } catch (error: any) {
    console.error("evaluateAnswer error:", error);
    res.status(500).json({ message: "Answer Analysis Failed", error: error.message });
  }
};

export const completeInterview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Authentication required." });

    const { interviewId, responses, trackTitle } = req.body;

    let finalScore = 0;
    if (responses && Array.isArray(responses) && responses.length > 0) {
      const sum = responses.reduce((acc: number, r: any) => acc + (r.score || 0), 0);
      finalScore = Math.round(sum / responses.length);
    } else {
      finalScore = 70;
    }

    const techScore = Math.min(100, Math.round(finalScore * 0.95));
    const commScore = Math.min(100, Math.round(finalScore * 1.05));

    if (interviewId) {
      await MockInterview.findOneAndUpdate(
        { _id: interviewId, userId },
        {
          status: "completed",
          finalScore,
          technicalScore: techScore,
          communicationScore: commScore,
          summaryFeedback: `Completed with an overall performance score of ${finalScore}%.`,
        }
      );
    } else {
      await MockInterview.create({
        userId,
        trackTitle: trackTitle || "Technical Interview",
        status: "completed",
        finalScore,
        technicalScore: techScore,
        communicationScore: commScore,
        responses: responses || [],
      });
    }

    // Update User Progress
    const progress = await Progress.findOne({ userId });
    if (progress) {
      progress.interviewsCompleted = (progress.interviewsCompleted || 0) + 1;
      progress.xp += 50; // Real XP for completing interview

      // Achievement: First Mock Interview
      if (progress.achievements) {
        const ach = progress.achievements.find((a: any) => a.id === "a4");
        if (ach && !ach.unlocked) {
          ach.unlocked = true;
          ach.unlockedAt = new Date();
        }
      }
      await progress.save();
    }

    // Record Activity
    await Activity.create({
      userId,
      type: "mock_interview",
      title: `Completed ${trackTitle || "Mock Interview"}`,
      details: `Scored ${finalScore}% overall · Technical: ${techScore}% · Communication: ${commScore}%`,
      xpEarned: 50,
    });

    res.json({
      success: true,
      finalScore,
      technicalScore: techScore,
      communicationScore: commScore,
      message: "Interview completed and results saved.",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to finalize interview.", error: error.message });
  }
};