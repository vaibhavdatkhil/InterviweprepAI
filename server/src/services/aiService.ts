import dotenv from "dotenv";

dotenv.config();

import axios from "axios";

const API_KEY =
  process.env.OPENROUTER_API_KEY;


// Generate Questions
export const generateQuestions =
async (
  resumeText: string
) => {

  const prompt = `
Generate 5 professional interview questions
based on this resume:

${resumeText}

Give only questions.
`;

  const response =
    await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          "openrouter/auto",

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

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "InterviewPrepAI",
        },
      }
    );

  return response.data
    .choices[0]
    .message.content;
};


// Analyze Answer
export const analyzeAnswer =
async (
  question: string,
  answer: string
) => {

const prompt = `
You are a strict professional technical interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer VERY STRICTLY.

Rules:
- If answer is irrelevant to question, give very low score.
- If answer is too short, reduce score heavily.
- If answer lacks technical detail, reduce score.
- If answer is unrelated, clearly mention it.
- Only give high score for accurate and detailed answers.
- Do not encourage wrong answers.

Return ONLY in this format:

Score: <number>/100

Strengths:
- ...

Weaknesses:
- ...

Feedback:
- ...

Improvement Tips:
- ...
`;

  const response =
    await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          "openrouter/auto",

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

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "InterviewPrepAI",
        },
      }
    );

    if (answer.trim().length < 10) {

  return `
Score: 5/100

Strengths:
- Attempted answer

Weaknesses:
- Answer too short
- Lacks detail
- Not properly answering question

Feedback:
The answer is incomplete and does not properly address the interview question.

Improvement Tips:
Provide a detailed and professional answer.
`;

}

  return response.data
    .choices[0]
    .message.content;
};