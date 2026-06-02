import { useEffect, useState }
from "react";

import api
from "../services/api";

import { motion }
from "framer-motion";

import {
  Flame,
  Award,
  CheckCircle,
  Brain,
  Lock,
  Unlock,
  Calendar,
} from "lucide-react";

import DashboardLayout
from "../layouts/DashboardLayout";

import {
  ACHIEVEMENTS,
} from "../data";

const Progress = () => {

  // ==========================
  // STATE
  // ==========================

  const [progress,
    setProgress] =
    useState<any>(null);

  // ==========================
  // FETCH DATA
  // ==========================

  useEffect(() => {

    const fetchProgress =
    async () => {

      try {

        const response =
          await api.get(
            "/progress"
          );

        console.log(
          response.data
        );

        setProgress(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchProgress();

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
        staggerChildren: 0.08,
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

  // ==========================
  // WEEKLY ACTIVITY
  // ==========================

  const weeklyActivity = [

    {
      day: "Mon",
      solved: 2,
      active: true,
    },

    {
      day: "Tue",
      solved: 3,
      active: true,
    },

    {
      day: "Wed",
      solved: 1,
      active: true,
    },

    {
      day: "Thu",
      solved: 0,
      active: false,
    },

    {
      day: "Fri",
      solved: 4,
      active: true,
    },

    {
      day: "Sat",
      solved: 5,
      active: true,
    },

    {
      day: "Sun",
      solved: 2,
      active: true,
    },

  ];

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
        {/* TOP METRICS */}
        {/* ========================= */}

        <motion.div
          variants={
            itemVariants
          }
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >

          {/* STREAK */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Current Streak

              </span>

              <h3 className="text-3xl font-extrabold text-zinc-100">

                {
                  progress?.streak || 0
                } Days

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">

              <Flame
                size={20}
                className="animate-pulse"
              />

            </div>

          </div>

          {/* XP */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Total XP

              </span>

              <h3 className="text-3xl font-extrabold text-zinc-100">

                {
                  progress?.xp || 0
                }

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">

              <Award size={20} />

            </div>

          </div>

          {/* SOLVED */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Questions Solved

              </span>

              <h3 className="text-3xl font-extrabold text-zinc-100">

                {
                  progress?.questionsSolved || 0
                }

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">

              <CheckCircle size={20} />

            </div>

          </div>

          {/* INTERVIEWS */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center justify-between">

            <div className="space-y-2">

              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">

                Interviews

              </span>

              <h3 className="text-3xl font-extrabold text-zinc-100">

                {
                  progress?.interviews || 0
                }

              </h3>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">

              <Brain size={20} />

            </div>

          </div>

        </motion.div>

        {/* WEEKLY ACTIVITY */}

        <motion.div
          variants={
            itemVariants
          }
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6"
        >

          <div className="flex items-center gap-2 mb-6 text-zinc-400">

            <Calendar size={16} />

            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">

              Weekly Activity Hub

            </h3>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">

            {weeklyActivity.map(
              (day) => (

                <div
                  key={day.day}
                  className={`rounded-2xl p-5 border text-center transition duration-200 flex flex-col justify-between items-center min-h-[110px]
                  ${
                    day.active
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                      : "bg-zinc-950/20 border-zinc-850 text-zinc-500"
                  }`}
                >

                  <span className="text-sm font-bold uppercase tracking-wider">

                    {day.day}

                  </span>

                  <div className="space-y-1">

                    <span className="block text-2xl font-extrabold text-zinc-100">

                      {day.solved}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </motion.div>

      </motion.div>

    </DashboardLayout>

  );

};

export default Progress;