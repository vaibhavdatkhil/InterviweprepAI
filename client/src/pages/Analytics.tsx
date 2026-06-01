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
  Brain
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  WEEKLY_PROGRESS,
  DIFFICULTY_BREAKDOWN,
  MOCK_USER_STATS,
} from "../data";

const Analytics = () => {
  const stats = MOCK_USER_STATS;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Custom styling for charts
  const fontStyles = {
    fontSize: 11,
    fill: "#71717a",
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Metric Row */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Solved</span>
              <h3 className="text-4xl font-extrabold text-zinc-100">{stats.questionsSolved}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Mock Interviews</span>
              <h3 className="text-4xl font-extrabold text-zinc-100">{stats.interviewsCompleted}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
              <Brain size={20} />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Consistency Record</span>
              <h3 className="text-4xl font-extrabold text-zinc-100">{stats.currentStreak} Days</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
              <Flame size={20} />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Progress Line Chart */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={15} className="text-violet-400" />
                Weekly Progress Index
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Solved questions tracker</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_PROGRESS} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={fontStyles} />
                  <YAxis axisLine={false} tickLine={false} tick={fontStyles} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "#18181b", 
                      border: "1px solid #27272a", 
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#f4f4f5"
                    }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="solved"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#09090b' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#a78bfa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Difficulty Breakdown Pie Chart */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={15} className="text-violet-400" />
                Difficulty Breakdown
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Category density</span>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DIFFICULTY_BREAKDOWN}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {DIFFICULTY_BREAKDOWN.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="rgba(9, 9, 11, 0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: "#18181b", 
                      border: "1px solid #27272a", 
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#f4f4f5"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="flex justify-center gap-6 mt-4 border-t border-zinc-800/40 pt-4">
              {DIFFICULTY_BREAKDOWN.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-zinc-400 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
