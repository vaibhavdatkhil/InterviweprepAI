import {
  generateQuestions,
  analyzeAnswer,
} from "../services/aiService";

import {
  Request,
  Response,
} from "express";


// Generate Questions
export const getQuestions = async (
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


// Analyze Answer
export const evaluateAnswer = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      question,
      answer,
    } = req.body;

    const feedback =
      await analyzeAnswer(
        question,
        answer
      );

    res.json({
      feedback,
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