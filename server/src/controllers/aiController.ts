import dotenv from "dotenv";

dotenv.config();

import {
  Request,
  Response,
} from "express";

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || ""
  );

export const reviewCode =
async (
  req: Request,
  res: Response
) => {

  console.log(
    "AI ROUTE HIT"
  );

  try {

    const { code } =
      req.body;

    console.log(
      "CODE RECEIVED:",
      code
    );

    if (!code) {

      return res.status(400).json({
        success: false,
        message:
          "Code is required",
      });

    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

    const prompt = `
You are a senior software engineer.

Analyze this code strictly.

Provide:
1. Code Quality Score (/100)
2. Bugs
3. Performance Issues
4. Security Problems
5. Best Practice Improvements
6. Final Feedback

Code:
${code}
`;

    console.log(
      "Sending Gemini request..."
    );

    const result =
      await model.generateContent(
        prompt
      );

    const aiResponse =
      result.response.text();

    console.log(
      "GEMINI RESPONSE:"
    );

    console.log(aiResponse);

    res.status(200).json({
      success: true,
      review: aiResponse,
    });

  } catch (error: any) {

    console.log(
      "FULL GEMINI ERROR:"
    );

    console.log(error);

    console.log(
      "ERROR MESSAGE:"
    );

    console.log(error.message);

    res.status(500).json({
      success: false,
      message:
        "AI Review Failed",
      error:
        error.message,
    });

  }

};