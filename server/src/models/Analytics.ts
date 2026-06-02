import mongoose from "mongoose";

const analyticsSchema =
  new mongoose.Schema({

    userId: {
      type: String,
    },

    type: {
      type: String,
    },

    score: {
      type: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

});

export default mongoose.model(
  "Analytics",
  analyticsSchema
);