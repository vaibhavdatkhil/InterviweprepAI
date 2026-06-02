import dotenv from "dotenv";

dotenv.config();

import axios from "axios";

const API_KEY =
  process.env.GROQ_API_KEY;


// ==============================
// GENERATE QUESTIONS
// ==============================

export const generateQuestions =
async (
  resumeText: string
) => {

  const prompt = `
Generate 5 professional technical interview questions
based on this resume.

Resume:
${resumeText}

Return ONLY questions.
`;

  const response =
    await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:
          "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization:
            `Bearer ${API_KEY}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return response.data
    .choices[0]
    .message.content;

};


// ==============================
// ANALYZE ANSWER
// ==============================

export const analyzeAnswer =
async (
  question: string,
  answer: string
) => {

  const prompt = `
You are a professional technical interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate VERY STRICTLY.

Provide:

1. Score (/100)
2. Strengths
3. Weaknesses
4. Communication
5. Technical Knowledge
6. Confidence
7. Final Feedback

If answer is unrelated,
give very low score.
`;

  const response =
    await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model:
          "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization:
            `Bearer ${API_KEY}`,

          "Content-Type":
            "application/json",
        },
      }
    );

  return response.data
    .choices[0]
    .message.content;

};