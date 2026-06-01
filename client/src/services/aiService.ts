import axios from "axios";

const API =
  "http://localhost:5000/api";


// Generate Questions
export const getQuestions =
async (
  resumeText: string
) => {

  const response =
    await axios.post(
      `${API}/interview/questions`,
      {
        resumeText,
      }
    );

  return response.data;

};


// Evaluate Answer
export const evaluateAnswer =
async (
  question: string,
  answer: string
) => {

  const response =
    await axios.post(
      `${API}/interview/evaluate`,
      {
        question,
        answer,
      }
    );

  return response.data;

};


// AI Code Review
export const reviewCodeAI =
async (
  code: string
) => {

  const response =
    await axios.post(
      `${API}/ai/review`,
      {
        code,
      }
    );

  return response.data;

};