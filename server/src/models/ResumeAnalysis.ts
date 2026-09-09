import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: "resume.pdf",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedText: {
      type: String,
      default: "",
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    isValidResume: {
      type: Boolean,
      default: true,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    categoryScores: {
      skillsMatch: { type: Number, default: 0 },
      experienceRelevance: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
    },
    skills: [String],
    sectionsFound: [String],
    suggestions: [String],
    targetRole: {
      type: String,
      default: "Software Engineer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
