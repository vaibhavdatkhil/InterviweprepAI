import api from "./api";

export interface AchievementItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface WeeklyDayActivity {
  day: string;
  date: string;
  solved: number;
  active: boolean;
}

export interface ProgressData {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  problemsSolved: number;
  mockSessions: number;
  weeklyActivity: WeeklyDayActivity[];
  achievements: AchievementItem[];
}

export const getProgress = async (): Promise<ProgressData> => {
  const response = await api.get("/progress");
  return response.data;
};
