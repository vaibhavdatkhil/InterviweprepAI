import { useEffect, useState } from "react";
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
  Play,
  RotateCcw,
  Clock,
  Code2
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getDashboardStats, DashboardData } from "../services/dashboardService";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      setData(res);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard metrics from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-36 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
            <div className="h-36 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
            <div className="h-36 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-64 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
            <div className="lg:col-span-4 h-64 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
          </div>
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
          <h3 className="text-lg font-bold text-zinc-100">Unable to load dashboard data</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{error}</p>
          <button
            onClick={loadData}
            className="mt-6 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
          >
            Retry Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const questionsSolved = data?.questionsSolved ?? 0;
  const mockInterviews = data?.mockInterviews ?? 0;
  const readinessScore = data?.readinessScore;
  const currentStreak = data?.currentStreak ?? 0;
  const xp = data?.xp ?? 0;
  const recentActivity = data?.recentActivity ?? [];

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
          className="relative bg-gradient-to-r from-violet-950/40 via-zinc-900/60 to-zinc-950 border border-violet-900/25 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-violet-600/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-400 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={12} />
              <span>PrepAI Live Workspace</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
              Technical Interview Preparation
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              {readinessScore !== null ? (
                <>
                  Your calculated interview readiness is at{" "}
                  <span className="text-violet-400 font-bold">{readinessScore}%</span>, derived from your DSA submissions, mock interview answers, and code reviews.
                </>
              ) : (
                "Complete a few practice sessions or an interview to calculate your personalized readiness score."
              )}
            </p>
          </div>
          <Link to="/mock-interview" className="shrink-0 relative z-10">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-3.5 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer">
              <Play size={13} fill="white" /> Start Practice Session
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Questions Solved */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 transition-all duration-200 hover:border-zinc-700/80">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Questions Solved</span>
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-100">{questionsSolved}</span>
              <span className="text-[11px] text-zinc-500 font-medium">Problems</span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (questionsSolved / 50) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              {questionsSolved === 0 ? "No solved questions yet" : `${questionsSolved} verified submissions`}
            </p>
          </div>

          {/* Mock Interviews */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 transition-all duration-200 hover:border-zinc-700/80">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Mock Sessions</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Brain size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-100">{mockInterviews}</span>
              <span className="text-[11px] text-zinc-500 font-medium">Completed</span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (mockInterviews / 10) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              {mockInterviews === 0 ? "No interview sessions recorded" : `${mockInterviews} sessions evaluated`}
            </p>
          </div>

          {/* Overall Readiness */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 transition-all duration-200 hover:border-zinc-700/80">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Interview Readiness</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-100">
                {readinessScore !== null ? `${readinessScore}%` : "No data"}
              </span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-500" 
                style={{ width: `${readinessScore ?? 0}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              {readinessScore !== null 
                ? `${readinessScore >= 80 ? "Interview Ready" : readinessScore >= 60 ? "Moderate Readiness" : "Early Preparation"}`
                : "Complete practice sessions to calculate"}
            </p>
          </div>
        </motion.div>

        {/* Workspaces & Streak Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main quick start workspaces */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-base font-bold text-zinc-200">Practice Workspaces</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DSA Shortcut */}
              <Link to="/dsa" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/40 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <Zap size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-sm">Data Structures & Algorithms</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Practice LeetCode-style algorithmic challenges across arrays, trees, graphs, and dynamic programming.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Open Practice</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Code Review Shortcut */}
              <Link to="/ai-review" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/40 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <Code2 size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-sm">Code Review & Static Analysis</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Validate code syntax, time/space complexity, edge cases, and runtime bugs on your actual submitted code.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Review Code</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Resume Shortcut */}
              <Link to="/resume-analyzer" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/40 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-sm">ATS Resume Analyzer</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Extract readable text from your PDF and get an explainable score breakdown across skills, experience, and keywords.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Analyze Resume</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Mock Interview Shortcut */}
              <Link to="/mock-interview" className="block group">
                <div className="bg-zinc-900/30 border border-zinc-800/80 hover:border-violet-500/40 p-5 rounded-2xl transition duration-200 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
                      <Brain size={18} />
                    </div>
                    <h4 className="font-bold text-zinc-200 text-sm">Interactive Mock Interview</h4>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                      Simulate high-stakes technical rounds for Frontend, Backend, Systems, or Behavioral engineering tracks.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400">
                    <span>Launch Interview</span>
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} className="text-violet-400" />
                  Recent Activity Feed
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">Live Database Feed</span>
              </div>
              {recentActivity.length > 0 ? (
                <div className="space-y-2.5">
                  {recentActivity.map((act, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        <span className="text-zinc-300 font-medium">{act.description}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No activity recorded yet. Complete a practice problem, code review, or mock interview to begin your timeline.
                </div>
              )}
            </div>
          </div>

          {/* Streak & XP Card */}
          <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Consistency & XP</h3>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="w-13 h-13 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-500 shrink-0">
                  <Flame size={26} />
                </div>
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-zinc-100">
                    {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                  </span>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Consecutive practice streak</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-5 pt-5 border-t border-zinc-800/60">
                <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-zinc-100">{xp.toLocaleString()} XP</span>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Earned through verified practice</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-zinc-950/50 border border-zinc-850 text-xs text-zinc-400 space-y-2">
                <div className="flex justify-between">
                  <span>DSA Solution:</span>
                  <span className="text-emerald-400 font-semibold">+50 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Mock Interview:</span>
                  <span className="text-blue-400 font-semibold">+100 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Resume Analysis:</span>
                  <span className="text-violet-400 font-semibold">+30 XP</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/progress" className="w-full">
                <button className="w-full bg-zinc-900 hover:bg-zinc-800/80 text-zinc-300 hover:text-white border border-zinc-800 transition py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                  View Progress & Badges <ArrowRight size={13} />
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
