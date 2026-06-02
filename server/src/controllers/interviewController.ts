import {
  generateQuestions,
  analyzeAnswer,
} from "../services/aiService";

import {
  Request,
  Response,
} from "express";

import Analytics
from "../models/Analytics";

import Progress
from "../models/Progress";


// ==============================
// GENERATE QUESTIONS
// ==============================

export const getQuestions =
async (
  req: Request,
  res: Response
) => {

  try {

    const { resumeText } =
      req.body;

    const questions =
      await generateQuestions(
        resumeText
      );

    res.json({
      questions,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Question Generation Failed",

      error,

    });

  }

};


// ==============================
// ANALYZE ANSWER
// ==============================

export const evaluateAnswer =
async (
  req: Request,
  res: Response
) => {

  try {

    const {
      question,
      answer,
    } = req.body;

    // ==========================
    // AI FEEDBACK
    // ==========================

    const feedback =
      await analyzeAnswer(
        question,
        answer
      );

    // ==========================
    // EXTRACT SCORE
    // ==========================

    const scoreMatch =

      feedback.match(
        /(\d+)\s*\/\s*100/
      ) ||

      feedback.match(
        /Score:\s*(\d+)/i
      ) ||

      feedback.match(
        /(\d+)\s*out\s*of\s*100/i
      );

    const finalScore =

      scoreMatch
        ? parseInt(
            scoreMatch[1]
          )
        : 50;

    // ==========================
    // SAVE ANALYTICS
    // ==========================

    await Analytics.create({

      userId:
        "demo-user",

      type:
        "interview",

      score:
        finalScore,

    });

    // ==========================
    // UPDATE PROGRESS
    // ==========================

    await Progress.findOneAndUpdate(

      {
        userId:
          "demo-user",
      },

      {
        $inc: {

          interviews: 1,

          xp: 50,

          questionsSolved: 1,

        },

      },

      {
        upsert: true,
      }

    );

    // ==========================
    // SEND RESPONSE
    // ==========================

    res.json({

      success: true,

      feedback,

      score:
        finalScore,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Answer Analysis Failed",

      error,

    });

  }

};