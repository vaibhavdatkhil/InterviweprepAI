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
export const reviewCodeAI = async (code: string) => {
  const response = await api.post("/ai/review", {
    code,
  });
  return response.data;
};