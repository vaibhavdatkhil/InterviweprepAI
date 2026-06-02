import mongoose from "mongoose";

const submissionSchema =
new mongoose.Schema({

  code: String,

  language: String,

  question: String,

  result: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model(
  "Submission",
  submissionSchema
);