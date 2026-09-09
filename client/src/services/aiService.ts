import api from "./api";

// Generate Questions
export const getQuestions = async (resumeText: string) => {
  const response = await api.post("/interview/questions", {
    resumeText,
  });
  return response.data;
};

// Evaluate Answer
export const evaluateAnswer = async (question: string, answer: string) => {
  const response = await api.post("/interview/evaluate", {
    question,
    answer,
  });
  return response.data;
};

// AI Code Review
export const reviewCodeAI = async (code: string, language?: string, problemContext?: string) => {
  const response = await api.post("/ai/review", {
    code,
    language: language || "javascript",
    problemContext,
  });
  return response.data;
};

// Get Latest Code Review for authenticated user
export const getLatestReview = async () => {
  const response = await api.get("/ai/latest-review");
  return response.data;
};