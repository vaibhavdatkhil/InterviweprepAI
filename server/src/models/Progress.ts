import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    questionsSolved: {
      type: Number,
      default: 0,
    },
    solvedProblemIds: {
      type: [String],
      default: [],
    },
    interviewsCompleted: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    achievements: [
      {
        id: String,
        label: String,
        icon: String,
        unlocked: { type: Boolean, default: false },
        unlockedAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);