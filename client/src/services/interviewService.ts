import api from "./api";

export interface StartInterviewPayload {
  track: string;
  role?: string;
  difficulty?: string;
}

export interface StartInterviewResponse {
  interviewId: string;
  track: string;
  questions: Array<{
    id: string;
    question: string;
    category?: string;
  }>;
}

export interface EvaluateAnswerPayload {
  interviewId?: string;
  question: string;
  answer: string;
  questionIndex?: number;
}

export interface CompleteInterviewPayload {
  interviewId: string;
  answers: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
}

export const startInterview = async (payload: StartInterviewPayload): Promise<StartInterviewResponse> => {
  const response = await api.post("/interview/start", payload);
  return response.data;
};

export const evaluateInterviewAnswer = async (payload: EvaluateAnswerPayload) => {
  const response = await api.post("/interview/evaluate", payload);
  return response.data;
};

export const completeInterview = async (payload: CompleteInterviewPayload) => {
  const response = await api.post("/interview/complete", payload);
  return response.data;
};
