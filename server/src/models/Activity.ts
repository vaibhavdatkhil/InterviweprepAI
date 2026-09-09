import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["problem_solved", "mock_interview", "code_review", "resume_analyzed"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
