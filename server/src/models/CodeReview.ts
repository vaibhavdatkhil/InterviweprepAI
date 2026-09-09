import mongoose from "mongoose";

const codeReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    problemContext: {
      type: String,
      default: "",
    },
    syntaxValid: {
      type: Boolean,
      default: true,
    },
    syntaxErrors: [String],
    bugs: [String],
    improvements: [String],
    timeComplexity: {
      type: String,
      default: "Unknown",
    },
    spaceComplexity: {
      type: String,
      default: "Unknown",
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CodeReview", codeReviewSchema);
