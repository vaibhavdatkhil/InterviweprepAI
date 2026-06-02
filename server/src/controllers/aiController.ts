import dotenv from "dotenv";

dotenv.config();

import axios from "axios";

import Analytics
from "../models/Analytics";

import Progress
from "../models/Progress";

import {
  Request,
  Response,
} from "express";

const API_KEY =
  process.env.GROQ_API_KEY;


// ==============================
// AI CODE REVIEW
// ==============================

export const reviewCode =
async (
  req: Request,
  res: Response
) => {

  try {

    const { code } =
      req.body;

    // ==========================
    // GROQ API CALL
    // ==========================

    const response =
      await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {

          model:
            "llama-3.1-8b-instant",

          messages: [
            {

              role: "user",

              content: `
Analyze this code strictly.

Provide:

1. Score (/100)
2. Bugs
3. Improvements
4. Final Feedback

Code:
${code}
`,

            },
          ],

        },

        {
          headers: {

            Authorization:
              `Bearer ${API_KEY}`,

            "Content-Type":
              "application/json",

          },
        }
      );

    // ==========================
    // AI RESPONSE
    // ==========================

    const review =
      response.data
        .choices[0]
        .message.content;

    // ==========================
    // EXTRACT SCORE
    // ==========================

    const scoreMatch =

      review.match(
        /(\d+)\s*\/\s*100/
      ) ||

      review.match(
        /Score:\s*(\d+)/i
      ) ||

      review.match(
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
        "code-review",

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

          questionsSolved: 1,

          xp: 20,

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

      review,

      score:
        finalScore,

    });

  } catch (error: any) {

    console.log(error);

    res.status(500).json({

      success: false,

      error:
        error.message,

    });

  }

};