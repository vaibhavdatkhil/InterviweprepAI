import api from "./api";

export interface AnalyticsData {
  accuracyRate: number | null;
  totalSolved: number;
  totalSubmissions: number;
  totalInterviews: number;
  streak: number;
  weeklyProgress: Array<{
    day: string;
    solved: number;
  }>;
  difficultyData: Array<{
    name: string;
    value: number;
    count: number;
  }>;
  hasEnoughData: boolean;
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get("/analytics");
  return response.data;
};
