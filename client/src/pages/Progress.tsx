import { useEffect, useState } from "react";
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
  RotateCcw
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getProgress, ProgressData } from "../services/progressService";

const Progress = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProgress();
      setData(res);
    } catch (err: any) {
      console.error("Progress fetch error:", err);
      setError(err.response?.data?.message || "Failed to load progress metrics from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      transition: { duration: 0.35 },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
            ))}
          </div>
          <div className="h-64 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
          <div className="h-44 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={22} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">Unable to load progress data</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{error}</p>
          <button
            onClick={fetchProgress}
            className="mt-6 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
          >
            Retry Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const streak = data?.currentStreak ?? 0;
  const xp = data?.totalXP ?? 0;
  const solved = data?.problemsSolved ?? 0;
  const interviews = data?.mockSessions ?? 0;
  const achievements = data?.achievements ?? [];
  const weeklyActivity = data?.weeklyActivity ?? [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
                {streak} {streak === 1 ? "Day" : "Days"}
              </h3>
              <p className="text-[11px] text-orange-400 font-medium">
                {streak > 0 ? "Active practice streak" : "Practice today to start streak"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame size={22} />
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Total XP
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {xp.toLocaleString()}
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                {xp === 0 ? "0 XP earned so far" : `Level ${Math.floor(xp / 100) + 1} Candidate`}
              </p>
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
                {solved}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                {solved === 0 ? "No verified solutions yet" : "Verified accepted submissions"}
              </p>
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
                {interviews}
              </h3>
              <p className="text-[11px] text-blue-400 font-medium">
                {interviews === 0 ? "No mock interviews yet" : "Completed mock interviews"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Brain size={22} />
            </div>
          </div>
        </motion.div>

        {/* Milestone Badges Section */}
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
                {unlockedCount} / {achievements.length} Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((badge) => (
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
                    <span className="text-[11px] text-zinc-500 block">{badge.description}</span>
                    <span className={`text-[10px] font-mono mt-1 block ${badge.unlocked ? "text-emerald-400" : "text-zinc-600"}`}>
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
                Weekly Activity Log (Past 7 Days)
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Total activities this week: {weeklyActivity.reduce((a, b) => a + b.solved, 0)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {weeklyActivity.map((day) => (
              <div
                key={day.date}
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
                  {day.active ? "Active" : "No activity"}
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