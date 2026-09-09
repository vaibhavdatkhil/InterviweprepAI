import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  BarChart3,
  Flame,
  CheckCircle,
  TrendingUp,
  Brain,
  Target,
  Zap,
  RotateCcw,
  Sparkles
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAnalytics, AnalyticsData } from "../services/analyticsService";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalytics();
      setData(res);
    } catch (err: any) {
      console.error("Analytics fetch error:", err);
      setError(err.response?.data?.message || "Failed to load analytics from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
          <div className="h-80 bg-zinc-900/60 rounded-3xl border border-zinc-800/80" />
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
          <h3 className="text-lg font-bold text-zinc-100">Unable to load analytics</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-6 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
          >
            Retry Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const hasEnoughData = data?.hasEnoughData ?? false;
  const accuracyRate = data?.accuracyRate;
  const totalSolved = data?.totalSolved ?? 0;
  const totalSubmissions = data?.totalSubmissions ?? 0;
  const totalInterviews = data?.totalInterviews ?? 0;
  const streak = data?.streak ?? 0;
  const weeklyProgress = data?.weeklyProgress ?? [];
  const difficultyData = data?.difficultyData ?? [];

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Metric Overview Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Accuracy */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Submission Accuracy
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {accuracyRate !== null ? `${accuracyRate}%` : "No data"}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp size={12} /> {totalSubmissions > 0 ? `${totalSolved}/${totalSubmissions} accepted` : "Awaiting first submission"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target size={22} />
            </div>
          </div>

          {/* Solved Problems */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                DSA Solved
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {totalSolved}
              </h3>
              <p className="text-[11px] text-violet-400 font-medium flex items-center gap-1">
                <Zap size={12} /> Verified submissions
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
          </div>

          {/* Mock Sessions */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Mock Sessions
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {totalInterviews}
              </h3>
              <p className="text-[11px] text-blue-400 font-medium">Completed rounds</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Brain size={22} />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                Consistency
              </span>
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {streak} {streak === 1 ? "Day" : "Days"}
              </h3>
              <p className="text-[11px] text-orange-400 font-medium">Active streak</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame size={22} />
            </div>
          </div>
        </motion.div>

        {/* Charts or Empty State */}
        {!hasEnoughData ? (
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-base font-bold text-zinc-200">Complete more practice sessions to generate analytics</h3>
            <p className="text-zinc-500 text-xs max-w-md mt-2 leading-relaxed">
              Once you submit code solutions or complete mock interviews, your problem velocity, accuracy rate, and difficulty distribution graphs will automatically appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weekly Progress Line Chart */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 size={16} className="text-violet-400" />
                    Weekly Questions Solved
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Problem velocity over the past 7 days</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "12px",
                        color: "#f4f4f5",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="solved"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#a78bfa", r: 4 }}
                      activeDot={{ r: 7, fill: "#c4b5fd" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Difficulty Breakdown Pie Chart */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-1">
                  Difficulty Distribution
                </h3>
                <p className="text-xs text-zinc-500">Breakdown of solved challenges</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                    >
                      {difficultyData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "12px",
                        color: "#f4f4f5",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 text-center">
                {difficultyData.map((item, idx) => (
                  <div key={item.name} className="p-2 rounded-xl bg-zinc-950/40 border border-zinc-850">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="text-[11px] font-semibold text-zinc-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-200">{item.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;