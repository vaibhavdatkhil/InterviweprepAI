import mongoose from "mongoose";

const progressSchema =
  new mongoose.Schema({

    userId: String,

    questionsSolved: {
      type: Number,
      default: 0,
    },

    interviews: {
      type: Number,
      default: 0,
    },

    xp: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    weeklyActivity: [
      {
        day: String,
        solved: Number,
      },
    ],

  });

export default mongoose.model(
  "Progress",
  progressSchema
);