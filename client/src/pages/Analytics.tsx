import { useEffect, useState }
from "react";

import api
from "../services/api";

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

import { motion }
from "framer-motion";

import {
  BarChart3,
  Flame,
  CheckCircle,
  TrendingUp,
  Brain,
} from "lucide-react";

import DashboardLayout
from "../layouts/DashboardLayout";

const COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#f97316",
];

const Analytics = () => {

  // ==========================
  // STATES
  // ==========================

  const [stats, setStats] =
    useState<any>(null);

  const [weeklyProgress,
    setWeeklyProgress] =
    useState<any[]>([]);

  const [difficultyData,
    setDifficultyData] =
    useState<any[]>([]);

  // ==========================
  // FETCH ANALYTICS
  // ==========================

  useEffect(() => {

    const fetchAnalytics =
    async () => {

      try {

        const response =
          await api.get(
            "/analytics"
          );

        console.log(
          response.data
        );

        setStats(
          response.data
        );

        // WEEKLY CHART
        setWeeklyProgress([
          {
            day: "Mon",
            solved: 2,
          },
          {
            day: "Tue",
            solved: 4,
          },
          {
            day: "Wed",
            solved: 3,
          },
          {
            day: "Thu",
            solved: 6,
          },
          {
            day: "Fri",
            solved: 5,
          },
          {
            day: "Sat",
            solved: 8,
          },
          {
            day: "Sun",
            solved: 7,
          },
        ]);

        // PIE CHART
        setDifficultyData([
          {
            name: "Easy",
            value: 40,
          },
          {
            name: "Medium",
            value: 35,
          },
          {
            name: "Hard",
            value: 25,
          },
        ]);

      } catch (error) {

        console.log(error);

      }

    };

    fetchAnalytics();

  }, []);

  // ==========================
  // ANIMATION
  // ==========================

  const containerVariants = {

    hidden: {
      opacity: 0,
    },

    visible: {

      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },

    },

  };

  const itemVariants = {

    hidden: {
      y: 15,
      opacity: 0,
    },

    visible: {

      y: 0,

      opacity: 1,

      transition: {
        duration: 0.4,
      },

    },

  };

  const fontStyles = {

    fontSize: 11,

    fill: "#71717a",

  };

  return (

    <DashboardLayout>

      <motion.div
        variants={
          containerVariants
        }
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >

        {/* ========================= */}
        {/* METRICS */}
        {/* ========================= */}

        <motion.div
          variants={
            itemVariants
          }
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* TOTAL SOLVED */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Total Solved

              </span>

              <h3 className="text-4xl font-extrabold text-zinc-100">

                {
                  stats?.totalSolved || 0
                }

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">

              <CheckCircle
                size={20}
              />

            </div>

          </div>

          {/* MOCK INTERVIEWS */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Mock Interviews

              </span>

              <h3 className="text-4xl font-extrabold text-zinc-100">

                {
                  stats?.mockInterviews || 0
                }

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">

              <Brain
                size={20}
              />

            </div>

          </div>

          {/* AVERAGE SCORE */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Average Score

              </span>

              <h3 className="text-4xl font-extrabold text-zinc-100">

                {
                  stats?.averageScore || 0
                }%

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">

              <Flame
                size={20}
              />

            </div>

          </div>

        </motion.div>

        {/* ========================= */}
        {/* CHARTS */}
        {/* ========================= */}

        <motion.div
          variants={
            itemVariants
          }
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >

          {/* LINE CHART */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">

                <TrendingUp
                  size={15}
                  className="text-violet-400"
                />

                Weekly Progress

              </h3>

            </div>

            <div className="h-72 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    weeklyProgress
                  }
                  margin={{
                    top: 5,
                    right: 10,
                    left: -25,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.03)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={fontStyles}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={fontStyles}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="solved"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* PIE CHART */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">

                <BarChart3
                  size={15}
                  className="text-violet-400"
                />

                Difficulty Breakdown

              </h3>

            </div>

            <div className="h-60 w-full flex items-center justify-center">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      difficultyData
                    }
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    label
                  >

                    {difficultyData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </DashboardLayout>

  );

};

export default Analytics;