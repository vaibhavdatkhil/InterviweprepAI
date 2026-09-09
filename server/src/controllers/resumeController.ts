import { Response } from "express";
import fs from "fs";
import { AuthRequest } from "../middleware/authMiddleware";
import { analyzeResumeContent } from "../services/resumeAnalysisService";
import ResumeAnalysis from "../models/ResumeAnalysis";
import Activity from "../models/Activity";
import Progress from "../models/Progress";

// pdf-parse import
const pdfParse = require("pdf-parse");

export const analyzeResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No PDF file uploaded." });
    }

    // Read and parse PDF
    let extractedText = "";
    try {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text || "";
    } catch (parseError: any) {
      console.error("PDF parse failed:", parseError);
      // Clean up temp file
      try { fs.unlinkSync(file.path); } catch {}
      return res.status(400).json({
        message: "Unable to analyze this PDF. No readable text could be extracted.",
        atsScore: 0,
        skills: [],
        suggestions: [
          "Unable to extract text from the uploaded PDF document.",
          "Ensure the document is a text-selectable PDF and not an encrypted file or image scan.",
        ],
      });
    }

    // Clean up temp file
    try { fs.unlinkSync(file.path); } catch {}

    // Perform Authentic ATS Scoring
    const analysis = analyzeResumeContent(extractedText, req.body.targetRole || "Software Engineer");

    // Save Analysis to Database
    const savedRecord = await ResumeAnalysis.create({
      userId,
      fileName: file.originalname || "resume.pdf",
      fileSize: file.size,
      extractedText: analysis.extractedText,
      wordCount: analysis.wordCount,
      isValidResume: analysis.isValidResume,
      atsScore: analysis.atsScore,
      categoryScores: analysis.categoryScores,
      skills: analysis.skills,
      sectionsFound: analysis.sectionsFound,
      suggestions: analysis.suggestions,
      targetRole: req.body.targetRole || "Software Engineer",
    });

    // Update Achievement: ATS Resume Verified
    if (analysis.isValidResume) {
      const progress = await Progress.findOne({ userId });
      if (progress && progress.achievements) {
        const ach = progress.achievements.find((a: any) => a.id === "a5");
        if (ach && !ach.unlocked) {
          ach.unlocked = true;
          ach.unlockedAt = new Date();
          await progress.save();
        }
      }

      await Activity.create({
        userId,
        type: "resume_analyzed",
        title: `Resume Analyzed: ${analysis.atsScore}% ATS Score`,
        details: `Identified ${analysis.skills.length} skills · ${analysis.sectionsFound.join(", ")}`,
        xpEarned: 15,
      });
    }

    res.json({
      success: true,
      analysisId: savedRecord._id,
      atsScore: analysis.atsScore,
      isValidResume: analysis.isValidResume,
      wordCount: analysis.wordCount,
      skills: analysis.skills,
      sectionsFound: analysis.sectionsFound,
      categoryScores: analysis.categoryScores,
      suggestions: analysis.suggestions,
      extractedText: analysis.extractedText,
    });
  } catch (error: any) {
    console.error("analyzeResume error:", error);
    res.status(500).json({
      message: "Resume analysis failed.",
      error: error.message,
    });
  }
};

export const getLatestResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const latest = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!latest) {
      return res.json({ analysis: null });
    }

    res.json({
      analysis: {
        analysisId: latest._id,
        atsScore: latest.atsScore,
        isValidResume: latest.isValidResume,
        wordCount: latest.wordCount,
        skills: latest.skills,
        sectionsFound: latest.sectionsFound,
        categoryScores: latest.categoryScores,
        suggestions: latest.suggestions,
        extractedText: latest.extractedText,
        fileName: latest.fileName,
        createdAt: latest.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch latest resume analysis." });
  }
};