import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  Flame,
  Award,
  CheckCircle,
  Brain,
  Lock,
  Unlock,
  Calendar,
  Trophy,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ACHIEVEMENTS, MOCK_USER_STATS, WEEKLY_ACTIVITY } from "../data";

const Progress = () => {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get("/progress");
        if (response.data) {
          setProgress(response.data);
        }
      } catch (error) {
        console.warn("Progress API offline, rendering baseline profile stats.", error);
        setProgress({
          streak: MOCK_USER_STATS.currentStreak,
          xp: MOCK_USER_STATS.totalXP,
          questionsSolved: MOCK_USER_STATS.questionsSolved,
          interviews: MOCK_USER_STATS.interviewsCompleted,
        });
      }
    };

    fetchProgress();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  const solvedCount = progress?.questionsSolved ?? MOCK_USER_STATS.questionsSolved;
  const streakCount = progress?.streak ?? MOCK_USER_STATS.currentStreak;
  const xpCount = progress?.xp ?? MOCK_USER_STATS.totalXP;
  const interviewCount = progress?.interviews ?? MOCK_USER_STATS.interviewsCompleted;

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Top Metric Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Current Streak */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Current Streak
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {streakCount} Days
              </h3>
              <p className="text-[11px] text-orange-400 font-medium">Daily practice habit</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame size={22} className="animate-pulse" />
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Total XP
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {xpCount.toLocaleString()}
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">Level 8 Candidate</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Award size={22} />
            </div>
          </div>

          {/* Questions Solved */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Problems Solved
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {solvedCount}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">65% of target goal</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
          </div>

          {/* Interviews Completed */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Mock Sessions
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {interviewCount}
              </h3>
              <p className="text-[11px] text-blue-400 font-medium">Prepared for Big Tech</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Brain size={22} />
            </div>
          </div>
        </motion.div>

        {/* Milestone Badges Section (Uses ACHIEVEMENTS, Lock, Unlock) */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800/70">
            <div>
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                <h3 className="text-base font-bold text-zinc-100">
                  Milestone Achievements & Badges
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Earn badges as you solve problems, maintain streaks, and complete mock interviews.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-600/15 text-violet-400 border border-violet-500/25">
                {ACHIEVEMENTS.filter((a) => a.unlocked).length} / {ACHIEVEMENTS.length} Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all duration-300 flex items-center justify-between ${
                  badge.unlocked
                    ? "bg-zinc-950/60 border-zinc-800/80 hover:border-violet-500/40 shadow-sm"
                    : "bg-zinc-950/20 border-zinc-900 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      badge.unlocked
                        ? "bg-violet-600/10 border border-violet-500/20 shadow-inner"
                        : "bg-zinc-900 border border-zinc-800 grayscale"
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">{badge.label}</h4>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {badge.unlocked ? "Earned & Active" : "Locked Objective"}
                    </span>
                  </div>
                </div>

                <div>
                  {badge.unlocked ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Unlock size={14} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                      <Lock size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity Grid */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-zinc-300">
              <Calendar size={16} className="text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Weekly Activity Log
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Total solved this week: {WEEKLY_ACTIVITY.reduce((a, b) => a + b.solved, 0)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {WEEKLY_ACTIVITY.map((day) => (
              <div
                key={day.day}
                className={`rounded-2xl p-4 border text-center transition duration-200 flex flex-col justify-between items-center min-h-[105px] ${
                  day.active
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-950/30 border-zinc-850 text-zinc-600"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {day.day}
                </span>
                <span className="block text-2xl font-extrabold text-zinc-100 my-1">
                  {day.solved}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {day.active ? "Active" : "Rest day"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Progress;