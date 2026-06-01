import { Request, Response } from "express";

import fs from "fs";

const pdfParse = require("pdf-parse");

export const analyzeResume = async (
  req: Request,
  res: Response
) => {

  try {

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Read uploaded PDF
    const dataBuffer = fs.readFileSync(
      file.path
    );

    // Parse PDF
    const pdfData = await pdfParse(
      dataBuffer
    );

    // Extracted Text
    const text = pdfData.text;

    // Skills Detection
    const skills: string[] = [];

    const skillKeywords = [
      "React",
      "Node",
      "MongoDB",
      "Java",
      "Python",
      "TypeScript",
      "JavaScript",
      "SQL",
      "AWS",
      "Express",
      "HTML",
      "CSS",
      "C++",
    ];

    for (const skill of skillKeywords) {

      if (
        text.toLowerCase().includes(
          skill.toLowerCase()
        )
      ) {

        skills.push(skill);

      }

    }

    // ATS Score Logic
    const atsScore = Math.min(
      skills.length * 10,
      95
    );

    // Suggestions
    const suggestions = [];

    if (!skills.includes("React")) {
      suggestions.push(
        "Add React projects"
      );
    }

    if (!skills.includes("MongoDB")) {
      suggestions.push(
        "Mention database skills"
      );
    }

    if (skills.length < 5) {
      suggestions.push(
        "Add more technical skills"
      );
    }

    // Final Response
    res.json({
      atsScore,
      skills,
      suggestions,
      extractedText: text,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Resume Analysis Failed",
      error,
    });

  }

};