import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Building2
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { COMPANIES } from "../data";

const DSAQuestions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Helper to determine custom gradients per company brand
  const getCompanyBrandGradient = (name: string) => {
    switch (name) {
      case "Google": return "from-blue-600/10 to-indigo-600/5 hover:border-blue-500/40 text-blue-400";
      case "Amazon": return "from-orange-600/10 to-amber-600/5 hover:border-orange-500/40 text-orange-400";
      case "Microsoft": return "from-emerald-600/10 to-teal-600/5 hover:border-emerald-500/40 text-emerald-400";
      case "TCS": return "from-violet-600/10 to-fuchsia-600/5 hover:border-violet-500/40 text-violet-400";
      case "Infosys": return "from-cyan-600/10 to-sky-600/5 hover:border-cyan-500/40 text-cyan-400";
      case "Adobe": return "from-rose-600/10 to-pink-600/5 hover:border-red-500/40 text-red-400";
      default: return "from-zinc-900 to-zinc-950 hover:border-zinc-800";
    }
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
          className="relative bg-gradient-to-r from-violet-900/35 via-indigo-900/25 to-zinc-950 border border-violet-900/30 rounded-3xl p-6.5 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl font-bold text-zinc-100">Practice Company Specific Questions</h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Solve the exact algorithmic questions asked during interviews at leading tech organizations. Filter and target based on active job openings.
            </p>
          </div>
          <Link to="/questions" className="shrink-0 relative z-10">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer">
              Explore All <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>

        {/* Company Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className={`bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group ${getCompanyBrandGradient(company.name)}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-200">
                      <Building2 size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100">{company.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-800/40 uppercase tracking-wider">
                    High Priority
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                    <span>Solved Progress</span>
                    <span>{company.questions} Questions</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                    <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full w-[45%]" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">45% Completed</span>
                <Link to="/questions">
                  <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer">
                    Solve Problems <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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

export default DSAQuestions;
