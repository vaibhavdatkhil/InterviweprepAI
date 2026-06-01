// ─────────────────────────────────────────────
//  src/data/index.ts
//  Single source of truth for all static data.
//  Replace these with real API calls once your
//  backend endpoints are ready.
// ─────────────────────────────────────────────

// ── Types ────────────────────────────────────

export interface Company {
  name: string;
  questions: number;
  color: string; // Tailwind hover-border class
}

export interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  acceptance: string;
  tags: string[];
}

export interface InterviewType {
  title: string;
  description: string;
  topics: string[];
}

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

export interface DailyActivity {
  day: string;
  active: boolean;
  solved: number;
}

export interface WeeklyProgress {
  day: string;
  solved: number;
}

export interface DifficultyBreakdown {
  name: "Easy" | "Medium" | "Hard";
  value: number;
  color: string;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
  accentBorder: string;
}

export interface UserStats {
  questionsSolved: number;
  interviewsCompleted: number;
  currentStreak: number;
  totalXP: number;
  readinessScore: number;
}

export interface VoiceQuestion {
  id: string;
  text: string;
}

// ── Companies ────────────────────────────────

export const COMPANIES: Company[] = [
  { name: "Google",    questions: 120, color: "hover:border-blue-500"   },
  { name: "Amazon",    questions: 95,  color: "hover:border-orange-500" },
  { name: "Microsoft", questions: 80,  color: "hover:border-green-500"  },
  { name: "TCS",       questions: 60,  color: "hover:border-purple-500" },
  { name: "Infosys",   questions: 55,  color: "hover:border-cyan-500"   },
  { name: "Adobe",     questions: 40,  color: "hover:border-red-500"    },
];

// ── DSA Questions ────────────────────────────

export const DSA_QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Two Sum",
    difficulty: "Easy",
    company: "Google",
    acceptance: "49%",
    tags: ["Array", "HashMap"],
  },
  {
    id: "q2",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    company: "Amazon",
    acceptance: "38%",
    tags: ["Sliding Window", "String"],
  },
  {
    id: "q3",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    company: "Microsoft",
    acceptance: "31%",
    tags: ["Linked List", "Heap"],
  },
  {
    id: "q4",
    title: "Valid Parentheses",
    difficulty: "Easy",
    company: "TCS",
    acceptance: "55%",
    tags: ["Stack", "String"],
  },
  {
    id: "q5",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    company: "Adobe",
    acceptance: "42%",
    tags: ["BFS", "Tree"],
  },
];

// ── Interview Types ───────────────────────────

export const INTERVIEW_TYPES: InterviewType[] = [
  {
    title: "Frontend Interview",
    description: "React, JavaScript, HTML, CSS",
    topics: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Backend Interview",
    description: "Node.js, Express, MongoDB",
    topics: ["Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    title: "DSA Interview",
    description: "Coding and problem solving",
    topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
  },
  {
    title: "HR Interview",
    description: "Behavioral and communication",
    topics: ["Situational", "Leadership", "Teamwork", "Goals"],
  },
];

// ── Achievements ──────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", label: "7 Day Streak",         icon: "🔥", unlocked: true  },
  { id: "a2", label: "100 Questions Solved",  icon: "💯", unlocked: true  },
  { id: "a3", label: "First Mock Interview",  icon: "🧠", unlocked: true  },
  { id: "a4", label: "Fast Solver Badge",     icon: "⚡", unlocked: true  },
  { id: "a5", label: "50 Day Streak",         icon: "🏆", unlocked: false },
  { id: "a6", label: "Perfect Score",         icon: "🎯", unlocked: false },
];

// ── Weekly Activity ───────────────────────────

export const WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: "Mon", active: true,  solved: 4 },
  { day: "Tue", active: false, solved: 0 },
  { day: "Wed", active: true,  solved: 6 },
  { day: "Thu", active: false, solved: 0 },
  { day: "Fri", active: true,  solved: 3 },
  { day: "Sat", active: true,  solved: 8 },
  { day: "Sun", active: false, solved: 0 },
];

// ── Analytics Charts ──────────────────────────

export const WEEKLY_PROGRESS: WeeklyProgress[] = [
  { day: "Mon", solved: 2 },
  { day: "Tue", solved: 5 },
  { day: "Wed", solved: 4 },
  { day: "Thu", solved: 7 },
  { day: "Fri", solved: 3 },
  { day: "Sat", solved: 8 },
  { day: "Sun", solved: 6 },
];

export const DIFFICULTY_BREAKDOWN: DifficultyBreakdown[] = [
  { name: "Easy",   value: 40, color: "#22c55e" },
  { name: "Medium", value: 35, color: "#eab308" },
  { name: "Hard",   value: 25, color: "#ef4444" },
];

// ── User Stats (replace with API call later) ──

export const MOCK_USER_STATS: UserStats = {
  questionsSolved:    128,
  interviewsCompleted: 24,
  currentStreak:       12,
  totalXP:           2450,
  readinessScore:      82,
};

// ── Dashboard Cards ───────────────────────────

export const getDashboardStats = (stats: UserStats): DashboardStat[] => [
  {
    label:        "Questions Solved",
    value:        stats.questionsSolved,
    change:       "+12% this week",
    changeColor:  "text-green-400",
    accentBorder: "hover:border-blue-500",
  },
  {
    label:        "Mock Interviews",
    value:        stats.interviewsCompleted,
    change:       "+5 completed today",
    changeColor:  "text-green-400",
    accentBorder: "hover:border-purple-500",
  },
  {
    label:        "Readiness Score",
    value:        `${stats.readinessScore}%`,
    change:       "Excellent progress",
    changeColor:  "text-green-400",
    accentBorder: "hover:border-pink-500",
  },
];

// ── Voice Interview Questions ─────────────────

export const VOICE_QUESTIONS: VoiceQuestion[] = [
  { id: "v1", text: "Tell me about yourself."                      },
  { id: "v2", text: "What are your strengths?"                     },
  { id: "v3", text: "Explain your final year project."             },
  { id: "v4", text: "Why should we hire you?"                      },
  { id: "v5", text: "Where do you see yourself in 5 years?"        },
  { id: "v6", text: "Describe a challenge you overcame in a team." },
];

// ── Difficulty colour helper ──────────────────

export const getDifficultyColor = (
  difficulty: "Easy" | "Medium" | "Hard"
): string => {
  const map: Record<string, string> = {
    Easy:   "text-green-400 bg-green-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    Hard:   "text-red-400 bg-red-400/10",
  };
  return map[difficulty] ?? "";
};
