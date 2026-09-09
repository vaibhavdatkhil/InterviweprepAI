import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trackId: {
      type: String,
      default: "general",
    },
    trackTitle: {
      type: String,
      default: "Technical Interview",
    },
    difficulty: {
      type: String,
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    responses: [
      {
        questionIndex: Number,
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],
    finalScore: {
      type: Number,
      default: 0,
    },
    technicalScore: {
      type: Number,
      default: 0,
    },
    communicationScore: {
      type: Number,
      default: 0,
    },
    summaryFeedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MockInterview", mockInterviewSchema);
