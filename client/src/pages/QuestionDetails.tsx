import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Building2, 
  Award,
  Search,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DSA_QUESTIONS } from "../data";

const QuestionDetails = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

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

  const filteredQuestions = DSA_QUESTIONS.filter((q) => {
    const matchesDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.company.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

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
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-xl flex-1 max-w-sm">
              <Search size={15} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by question, topic, or company..."
                className="bg-transparent outline-none text-xs text-zinc-200 placeholder-zinc-500 w-full"
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono hidden md:inline">
              Showing {filteredQuestions.length} of {DSA_QUESTIONS.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                    : "bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-750"
                }`}
              >
                {diff === "All" ? "All Difficulties" : diff}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Question List */}
        <motion.div 
          variants={itemVariants}
          className="space-y-3.5"
        >
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-violet-400 transition-colors">
                      {question.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getDifficultyBadge(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} /> {question.company}
                    </span>
                    <span className="h-3 w-[1px] bg-zinc-800" />
                    <span className="flex items-center gap-1.5">
                      <Award size={13} /> Acceptance: <span className="text-zinc-300 font-semibold">{question.acceptance}</span>
                    </span>
                  </div>

                  {/* Tag chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-zinc-950/80 border border-zinc-850 text-zinc-400 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link to="/editor">
                    <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/10 cursor-pointer">
                      Solve in Workspace <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-zinc-900/20 border border-zinc-850 rounded-2xl">
              <p className="text-zinc-500 text-sm">No challenges match your current search or difficulty filter.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default QuestionDetails;
