// src/services/resumeService.ts
import api from "./api";

export const analyzeResume = async (file: File, targetRole?: string) => {
  const formData = new FormData();
  formData.append("resume", file);
  if (targetRole) {
    formData.append("targetRole", targetRole);
  }

  const response = await api.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getLatestResume = async () => {
  const response = await api.get("/resume/latest");
  return response.data;
};
