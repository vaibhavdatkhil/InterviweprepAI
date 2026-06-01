import { motion } from "framer-motion";
import { 
  Flame, 
  Award, 
  CheckCircle, 
  Brain, 
  Lock, 
  Unlock,
  Calendar
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  ACHIEVEMENTS,
  WEEKLY_ACTIVITY,
  MOCK_USER_STATS,
} from "../data";

const Progress = () => {
  const stats = MOCK_USER_STATS;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Top Metric Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Current Streak */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Current Streak</span>
              <h3 className="text-3xl font-extrabold text-zinc-100">{stats.currentStreak} Days</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame size={20} className="animate-pulse" />
            </div>
          </div>

          {/* Total XP */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total XP</span>
              <h3 className="text-3xl font-extrabold text-zinc-100">{stats.totalXP.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>

          {/* Solved */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
              <h3 className="text-3xl font-extrabold text-zinc-100">{stats.questionsSolved}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Completed */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <h3 className="text-3xl font-extrabold text-zinc-100">{stats.interviewsCompleted}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
              <Brain size={20} />
            </div>
          </div>
        </motion.div>

        {/* Weekly Activity Grid */}
        <motion.div 
          variants={itemVariants}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5"
        >
          <div className="flex items-center gap-2 mb-6 text-zinc-400">
            <Calendar size={16} />
            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">Weekly Activity Hub</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {WEEKLY_ACTIVITY.map((day) => (
              <div
                key={day.day}
                className={`rounded-2xl p-5 border text-center transition duration-200 flex flex-col justify-between items-center min-h-[110px] ${
                  day.active
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-950/20 border-zinc-850 text-zinc-500"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">{day.day}</span>
                {day.active ? (
                  <div className="space-y-1">
                    <span className="block text-2xl font-extrabold text-zinc-100">{day.solved}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-500">Solved</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="block text-2xl font-extrabold text-zinc-600">0</span>
                    <span className="text-[10px] uppercase font-bold text-zinc-600">Inactive</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestone Achievements */}
        <motion.div 
          variants={itemVariants}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5"
        >
          <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Award size={16} className="text-violet-400" />
            Prep Milestones & Badges
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-5 border flex items-center justify-between gap-4 transition duration-300 ${
                  achievement.unlocked
                    ? "bg-zinc-900/50 border-zinc-800/80 hover:border-violet-500/30"
                    : "bg-zinc-950/40 border-zinc-900/60 opacity-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition duration-200 ${
                    achievement.unlocked 
                      ? "bg-violet-600/10 border border-violet-500/20 shadow-md shadow-violet-500/5" 
                      : "bg-zinc-900 border border-zinc-850"
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-base">{achievement.label}</h4>
                    <p className="text-zinc-500 text-xs mt-1">
                      {achievement.unlocked ? "Milestone unlocked" : "In progress - lock state active"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-zinc-600">
                  {achievement.unlocked ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <Unlock size={14} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-zinc-600 border border-zinc-900">
                      <Lock size={14} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Progress;
