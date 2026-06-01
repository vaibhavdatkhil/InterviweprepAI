// src/services/resumeService.ts
import api from "./api";

export const analyzeResume = async (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
