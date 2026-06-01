import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Brain, 
  FileText, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Flame,
  Award,
  Sparkles,
  Play
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { MOCK_USER_STATS, getDashboardStats } from "../data";

const Dashboard = () => {
  const stats = getDashboardStats(MOCK_USER_STATS);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
        {/* Banner Card */}
        <motion.div 
          variants={itemVariants}
          className="relative bg-gradient-to-r from-violet-900/35 via-indigo-900/25 to-zinc-950 border border-violet-900/30 rounded-3xl p-6.5 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={11} className="animate-spin-slow" />
              <span>AI Prep Active</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">Ready to level up your technical skills?</h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Your overall readiness is at <span className="text-violet-400 font-bold">{MOCK_USER_STATS.readinessScore}%</span>. We recommend starting a mock interview or doing an AI code review to boost your profile score.
            </p>
          </div>
          <Link to="/mock-interview" className="shrink-0 relative z-10">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer">
              <Play size={14} fill="white" /> Start Quick Prep
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-lg`}
            >
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">{stat.label}</span>
                {stat.label.includes("Questions") && <CheckCircle size={18} className="text-violet-400" />}
                {stat.label.includes("Interviews") && <Brain size={18} className="text-violet-400" />}
                {stat.label.includes("Readiness") && <TrendingUp size={18} className="text-violet-400" />}
              </div>
              
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-zinc-100">{stat.value}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>

              {stat.label.includes("Readiness") && (
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full w-[82%]" />
                </div>
              )}
              {stat.label.includes("Questions") && (
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[65%]" />
                </div>
              )}
              {stat.label.includes("Interviews") && (
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full w-[50%]" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Shortcuts & Streak Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main quick action cards */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-lg font-bold text-zinc-300">Quick Start Workspaces</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DSA Shortcut */}
              <Link to="/dsa" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/30 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between hover:shadow-md">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <Zap size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-base">Practice DSA questions</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Target company specific array, tree, graph, and DP problems.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Practice Suite</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Resume Shortcut */}
              <Link to="/resume-analyzer" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/30 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between hover:shadow-md">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-base">ATS Resume Analyzer</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Get instant scoring on formatting, keywords, and skill gaps.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Analyze Resume</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Streak & XP Card */}
          <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5 flex flex-col justify-between">
            <div>
              <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Consistency Record</h3>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-500">
                  <Flame size={28} className="animate-bounce" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-100">{MOCK_USER_STATS.currentStreak} Days</span>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Consecutive practice streak</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-5 pt-5 border-t border-zinc-800/60">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500">
                  <Award size={26} />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-zinc-100">{MOCK_USER_STATS.totalXP.toLocaleString()} XP</span>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Total experience points earned</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/progress" className="w-full">
                <button className="w-full bg-zinc-900 hover:bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-800 transition py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                  View Milestone Badges <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
