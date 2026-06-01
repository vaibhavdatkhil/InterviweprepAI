import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  HelpCircle, 
  Play, 
  Clock
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const interviewTypes = [
  {
    title: "Frontend Interview",
    description: "Deep dive into React, JavaScript scope, DOM compilation, state engines, and modern CSS layout properties.",
    duration: "25 Mins",
    difficulty: "Medium",
    questionsCount: 6,
    color: "from-blue-600/10 to-indigo-600/5 hover:border-blue-500/30 text-blue-400"
  },
  {
    title: "Backend Interview",
    description: "Covers REST architectures, Node.js event loops, process execution, query indexing, and security strategies.",
    duration: "30 Mins",
    difficulty: "Hard",
    questionsCount: 8,
    color: "from-purple-600/10 to-pink-600/5 hover:border-purple-500/30 text-purple-400"
  },
  {
    title: "DSA Interview",
    description: "Focuses on runtime complexity analysis, Heap allocation, Binary search variations, and dynamic memory.",
    duration: "40 Mins",
    difficulty: "Hard",
    questionsCount: 5,
    color: "from-emerald-600/10 to-teal-600/5 hover:border-emerald-500/30 text-emerald-400"
  },
  {
    title: "HR Interview",
    description: "Behavioral assessment evaluating situational leadership, dispute resolution, goals, and communication skills.",
    duration: "15 Mins",
    difficulty: "Easy",
    questionsCount: 4,
    color: "from-amber-600/10 to-orange-600/5 hover:border-amber-500/30 text-amber-400"
  },
];

const MockInterview = () => {
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
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {interviewTypes.map((interview) => (
            <div
              key={interview.title}
              className={`bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group ${interview.color}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center">
                      <Brain size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100">{interview.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    interview.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                    interview.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/25" :
                    "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}>
                    {interview.difficulty}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm mt-5 leading-relaxed">
                  {interview.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {interview.duration}
                  </span>
                  <span className="h-3 w-[1px] bg-zinc-800" />
                  <span className="flex items-center gap-1.5">
                    <HelpCircle size={13} /> {interview.questionsCount} Questions
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/voice-interview" className="w-full">
                  <button className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer">
                    Start Mock Session <Play size={10} fill="currentColor" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MockInterview;