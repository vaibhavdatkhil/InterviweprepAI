import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Brain, 
  HelpCircle, 
  Play, 
  Clock,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const interviewTypes = [
  {
    trackId: "frontend",
    title: "Frontend Engineering",
    description: "Deep dive into React architectures, JavaScript closures, DOM rendering pipeline, state management, and modern responsive systems.",
    duration: "25 Mins",
    difficulty: "Medium",
    questionsCount: 6,
    color: "from-blue-600/10 to-indigo-600/5 hover:border-blue-500/40 text-blue-400"
  },
  {
    trackId: "backend",
    title: "Backend & Systems",
    description: "Covers REST & GraphQL architectures, Node.js event loops, process execution, SQL/NoSQL indexing, distributed caching, and security.",
    duration: "30 Mins",
    difficulty: "Hard",
    questionsCount: 8,
    color: "from-purple-600/10 to-pink-600/5 hover:border-purple-500/40 text-purple-400"
  },
  {
    trackId: "dsa",
    title: "DSA & Problem Solving",
    description: "Focuses on runtime complexity analysis, Heap allocation, Binary search variations, Dynamic Programming, and Graph algorithms.",
    duration: "40 Mins",
    difficulty: "Hard",
    questionsCount: 5,
    color: "from-emerald-600/10 to-teal-600/5 hover:border-emerald-500/40 text-emerald-400"
  },
  {
    trackId: "hr",
    title: "Behavioral & Leadership",
    description: "Situational leadership, STAR method communication, cross-functional collaboration, conflict resolution, and career objectives.",
    duration: "15 Mins",
    difficulty: "Easy",
    questionsCount: 4,
    color: "from-amber-600/10 to-orange-600/5 hover:border-amber-500/40 text-amber-400"
  },
];

const MockInterview = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const startTrack = (trackId: string) => {
    localStorage.setItem("selected_interview_track", trackId);
    navigate("/voice-interview");
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Banner */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-r from-violet-900/35 via-indigo-900/25 to-zinc-950 border border-violet-900/30 rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={12} className="text-violet-400" />
              <span>Simulated High-Stakes Assessments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              Select Your Interview Specialization
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Every track features AI speech scoring, real-time follow-ups, and in-depth performance analytics modeled after real hiring bars at top tier tech companies.
            </p>
          </div>
        </motion.div>

        {/* Tracks Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {interviewTypes.map((interview) => (
            <div
              key={interview.title}
              className={`bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group ${interview.color}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{interview.title}</h3>
                      <span className="text-[11px] text-zinc-500 font-mono">Simulated Voice Exam</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    interview.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                    interview.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/25" :
                    "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}>
                    {interview.difficulty}
                  </span>
                </div>

                <p className="text-zinc-400 text-xs sm:text-sm mt-4 leading-relaxed">
                  {interview.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {interview.duration}
                  </span>
                  <span className="h-3 w-[1px] bg-zinc-800" />
                  <span className="flex items-center gap-1.5">
                    <HelpCircle size={13} /> {interview.questionsCount} Standard Questions
                  </span>
                  <span className="h-3 w-[1px] bg-zinc-800" />
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={13} /> Instant Feedback
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => startTrack(interview.trackId)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:bg-violet-600 group-hover:border-violet-500 group-hover:text-white"
                >
                  <span>Launch {interview.title}</span>
                  <Play size={11} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MockInterview;