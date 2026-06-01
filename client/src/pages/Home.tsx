import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Brain, 
  Terminal, 
  FileText, 
  Mic, 
  ArrowRight, 
  Sparkles,
  Layers
} from "lucide-react";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as any } }
  };

  const features = [
    {
      icon: Brain,
      title: "Interactive Mock Interviews",
      description: "Experience fully interactive mock technical interviews across Frontend, Backend, and DSA topics.",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400"
    },
    {
      icon: Mic,
      title: "Voice AI Interviewer",
      description: "Answer real-world behavioral and situational questions using voice, and get scored on clarity and confidence.",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400"
    },
    {
      icon: FileText,
      title: "ATS Resume Analyzer",
      description: "Upload your resume in PDF format to receive instant analysis, detected key skills, and critical ATS improvements.",
      color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-400"
    },
    {
      icon: Sparkles,
      title: "AI Code Reviewer",
      description: "Submit code snippets to receive comprehensive code quality scoring, bug analysis, and syntax suggestions.",
      color: "from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-400"
    },
    {
      icon: Terminal,
      title: "Code Playground",
      description: "Practice algorithmic DSA challenges in real-time inside a fully integrated Monaco code editor environment.",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400"
    },
    {
      icon: Layers,
      title: "DSA Company Filters",
      description: "Filter questions by major tech leaders including Google, Amazon, Microsoft, and Adobe.",
      color: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-400"
    }
  ];

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden font-sans selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Background Orbs & Grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Cpu size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              PrepAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition duration-200">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200 flex items-center gap-1.5"
            >
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8 shadow-sm"
        >
          <Sparkles size={13} className="text-violet-400 animate-pulse" />
          <span>The Ultimate Technical Interview Suite</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
        >
          Master Coding & Tech Interviews with{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent text-glow-gradient">
            AI Guidance
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Practice simulated live interviews, analyze your resumes, solve targeted DSA challenges, and receive detailed AI feedback on your performance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link 
            to="/signup" 
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-violet-600/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Preparing Now <ArrowRight size={18} />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-8 py-4 rounded-2xl transition duration-200 flex items-center justify-center"
          >
            Sign In to Account
          </Link>
        </motion.div>
      </section>

      {/* Interactive Mockup Graphic */}
      <section className="px-6 max-w-6xl mx-auto pb-28">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md shadow-2xl shadow-violet-950/20"
        >
          {/* Mock Browser Header */}
          <div className="bg-zinc-950/80 border-b border-zinc-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 text-[10px] text-zinc-500 px-4 py-1.5 rounded-lg mx-auto font-mono w-64 text-center">
              https://prepai.io/dashboard
            </div>
          </div>
          
          {/* Mock content representation */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-b from-zinc-950/40 to-zinc-950/90">
            {/* Left stats mockup */}
            <div className="md:col-span-4 space-y-4">
              <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Overall Readiness</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-emerald-400">82%</span>
                  <span className="text-xs text-zinc-500">Excellent</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[82%]" />
                </div>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Weekly Goal</span>
                <span className="block text-xl font-bold mt-2">12/15 Solved</span>
                <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-violet-500 h-full w-[80%]" />
                </div>
              </div>
            </div>

            {/* Right interface mockup */}
            <div className="md:col-span-8 bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono">STEP 03 — INTERACTIVE CHAT</span>
                  <h4 className="text-lg font-bold mt-1">Design Patterns Interview</h4>
                </div>
                <span className="bg-violet-600/20 text-violet-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Live Voice</span>
              </div>
              
              <div className="space-y-3.5 my-8">
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-2xl max-w-md">
                  <p className="text-xs text-zinc-400 font-medium">AI Interviewer:</p>
                  <p className="text-sm text-zinc-200 mt-1">Can you describe the Singleton pattern and when you should avoid it?</p>
                </div>
                <div className="bg-violet-600/10 border border-violet-500/20 p-3.5 rounded-2xl max-w-md ml-auto text-right">
                  <p className="text-xs text-violet-400 font-medium">Your Voice Answer:</p>
                  <p className="text-sm text-violet-200 mt-1 italic">“It restricts class instantiation to one single instance, but it introduces global state...”</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-zinc-400">Microphone Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-zinc-900/20 border-t border-zinc-900 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Everything you need to land the offer</h2>
            <p className="text-zinc-400 mt-4">PrepAI delivers end-to-end simulation suites tailored specifically to modern software engineering placement tracks.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className={`bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6.5 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg flex flex-col justify-between`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 border`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm mt-3.5 leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-violet-400 group cursor-pointer">
                    <span>Learn more</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-violet-900/25 via-indigo-950/20 to-zinc-950 border border-violet-900/30 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-violet-600/5 blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to ace your next round?</h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Join thousands of students and developers using PrepAI to master technical coding, system design, and behavioral interviews.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200"
            >
              Sign Up For Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 px-6 text-center text-xs text-zinc-500 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} PrepAI. All rights reserved. Built with advanced AI pipelines.</p>
      </footer>

    </div>
  );
};

export default Home;