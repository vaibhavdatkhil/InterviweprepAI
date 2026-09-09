import api from "./api";

export interface RunCodePayload {
  language: string;
  code: string;
  input?: string;
}

export interface SubmitCodePayload {
  language: string;
  code: string;
  problemId: string;
}

export const runCode = async (payload: RunCodePayload) => {
  const response = await api.post("/code/run", payload);
  return response.data;
};

export const submitCode = async (payload: SubmitCodePayload) => {
  const response = await api.post("/code/submit", payload);
  return response.data;
};
