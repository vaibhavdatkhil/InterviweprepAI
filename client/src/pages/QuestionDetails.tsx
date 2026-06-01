import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Filter, 
  Building2, 
  Award
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DSA_QUESTIONS } from "../data";

const QuestionDetails = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } }
  };

  const getDifficultyBadge = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (difficulty) {
      case "Easy": 
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Medium": 
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Hard": 
        return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: 
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Filters Panel */}
        <motion.div 
          variants={itemVariants}
          className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-zinc-400">
            <Filter size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Quick Filters</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {DSA_QUESTIONS.length} Questions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-600/10 border border-violet-500/25 text-violet-400 cursor-pointer hover:bg-violet-600/20 transition">
              All Difficulties
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition">
              Easy
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition">
              Medium
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition">
              Hard
            </span>
          </div>
        </motion.div>

        {/* Question List */}
        <motion.div 
          variants={itemVariants}
          className="space-y-4"
        >
          {DSA_QUESTIONS.map((question) => (
            <div
              key={question.id}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">
                    {question.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getDifficultyBadge(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} /> {question.company}
                  </span>
                  <span className="h-3 w-[1px] bg-zinc-850" />
                  <span className="flex items-center gap-1.5">
                    <Award size={13} /> Acceptance: <span className="text-zinc-300 font-semibold">{question.acceptance}</span>
                  </span>
                </div>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-zinc-900/80 border border-zinc-850 text-zinc-400 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <Link to="/editor">
                  <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/10 cursor-pointer">
                    Solve Question <ArrowRight size={13} />
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

export default QuestionDetails;
