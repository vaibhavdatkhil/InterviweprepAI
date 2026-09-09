import api from "./api";

export interface DashboardData {
  questionsSolved: number;
  mockInterviews: number;
  readinessScore: number | null;
  currentStreak: number;
  xp: number;
  latestAtsScore: number | null;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");
  return response.data;
};
