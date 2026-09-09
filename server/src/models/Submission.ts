import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    problemTitle: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compile Error",
        "Runtime Error",
        "Time Limit Exceeded",
      ],
      required: true,
    },
    runtimeMs: {
      type: Number,
      default: 0,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    testOutputs: [
      {
        testIndex: Number,
        input: String,
        expected: String,
        actual: String,
        passed: Boolean,
      },
    ],
    error: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);