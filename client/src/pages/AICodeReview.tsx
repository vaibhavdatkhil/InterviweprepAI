import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Sparkles,
  Bug,
  Lightbulb,
  CheckCircle2,
  Clock,
  HardDrive,
  Copy,
  Code2,
  AlertTriangle,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { reviewCodeAI, getLatestReview } from "../services/aiService";

const STARTER_PRESETS = [
  {
    name: "Python - Simple Input (Bug Test)",
    language: "python",
    code: `name = input("Enter your name: ")
age = input("Enter your age: ")

if age > 18:
    print("You are eligible")
else:
    print("You are not eligible")

print("Hello " + name)`,
  },
  {
    name: "Two Sum (Brute Force)",
    language: "javascript",
    code: `// Brute Force O(n^2) Two Sum
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
  },
  {
    name: "Fibonacci (Recursive)",
    language: "javascript",
    code: `// Naive recursive Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  },
  {
    name: "Clean Python Script",
    language: "python",
    code: `def greet_user(name: str, count: int) -> list:
    results = []
    for i in range(count):
        results.append(f"Hello {name} #{i+1}")
    return results

print(greet_user("Alex", 3))`,
  }
];

const AICodeReview = () => {
  const [code, setCode] = useState(STARTER_PRESETS[0].code);
  const [language, setLanguage] = useState(STARTER_PRESETS[0].language);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review State from Backend
  const [score, setScore] = useState<number | null>(null);
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  const [bugs, setBugs] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [complexity, setComplexity] = useState({
    time: "",
    space: "",
  });
  const [finalFeedback, setFinalFeedback] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch latest saved review from MongoDB on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getLatestReview();
        if (data && data.code) {
          setCode(data.code);
          setLanguage(data.language || "javascript");
          setScore(data.score ?? null);
          setSyntaxErrors(data.syntaxErrors || []);
          setBugs(data.bugs || []);
          setSuggestions(data.suggestions || []);
          setComplexity({
            time: data.complexity?.time || "O(1)",
            space: data.complexity?.space || "O(1)",
          });
          setFinalFeedback(data.feedback || "");
          setHasReviewed(true);
        }
      } catch (e) {
        // No previous review saved, leave as initial empty state
      }
    };

    fetchLatest();
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error("Please enter code to analyze.");
      return;
    }

    try {
      setLoading(true);
      const res = await reviewCodeAI(code, language);
      
      setScore(res.score ?? null);
      setSyntaxErrors(res.syntaxErrors || []);
      setBugs(res.bugs || []);
      setSuggestions(res.suggestions || []);
      setComplexity({
        time: res.complexity?.time || "O(1)",
        space: res.complexity?.space || "O(1)",
      });
      setFinalFeedback(res.feedback || "");
      setHasReviewed(true);

      if (res.syntaxErrors && res.syntaxErrors.length > 0) {
        toast.error("Syntax or validation errors detected in submitted code.");
      } else {
        toast.success("Code review completed from actual code!");
      }
    } catch (error: any) {
      console.error("Code review error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze code. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        {/* Left Side: Monaco Editor Workspace */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col">
            {/* Header bar */}
            <div className="bg-zinc-950/80 border-b border-zinc-850 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                  <Code2 size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">
                    Code Review & Static Analysis
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Direct AST syntax checks & algorithmic complexity verification
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-1.5 outline-none hover:border-zinc-700 cursor-pointer"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>

                {/* Preset selector */}
                <select
                  onChange={(e) => {
                    const preset = STARTER_PRESETS.find((p) => p.name === e.target.value);
                    if (preset) {
                      setCode(preset.code);
                      setLanguage(preset.language);
                    }
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-xl px-3 py-1.5 outline-none hover:border-zinc-700 cursor-pointer max-w-[160px] truncate"
                >
                  <option value="">Load Preset Template...</option>
                  {STARTER_PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={copyCode}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="p-2 bg-[#1e1e1e]">
              <Editor
                height="55vh"
                theme="vs-dark"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 14 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                }}
              />
            </div>

            {/* Action Bottom Bar */}
            <div className="bg-zinc-950/80 border-t border-zinc-850 p-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">
                {code.split("\n").length} lines · {code.length} characters
              </span>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-6 py-3 rounded-xl transition duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-600/20"
              >
                {loading ? (
                  <>
                    <Sparkles size={14} className="animate-spin" /> Analyzing Actual Code...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Run Code Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Assessment Report */}
        <div className="w-full xl:w-[440px] flex flex-col gap-6">
          {hasReviewed && score !== null ? (
            <div className="space-y-6">
              {/* Syntax / Compilation Errors Alert */}
              {syntaxErrors.length > 0 && (
                <div className="bg-rose-950/30 border border-rose-800/60 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-rose-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                      Syntax / Validation Errors Detected
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {syntaxErrors.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-900/20 border border-rose-800/40 text-xs text-rose-200 font-mono leading-relaxed"
                      >
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Score Card */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center gap-5">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                    <circle
                      className={`transition-all duration-700 ${
                        score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400"
                      }`}
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={2 * Math.PI * 32 * (1 - score / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                  </svg>
                  <span className="text-xl font-extrabold text-zinc-100">{score}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Code Quality Rating
                  </span>
                  <h4 className="text-base font-bold text-zinc-100 mt-0.5">
                    {score >= 80 ? "Clean Implementation" : score >= 50 ? "Requires Refactoring" : "Critical Issues / Syntax Errors"}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Calculated from actual syntax checks, loop depth, and type safety.
                  </p>
                </div>
              </div>

              {/* Complexity Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Time Complexity</span>
                    <span className="text-sm font-bold text-zinc-200 font-mono">{complexity.time}</span>
                  </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Space Complexity</span>
                    <span className="text-sm font-bold text-zinc-200 font-mono">{complexity.space}</span>
                  </div>
                </div>
              </div>

              {/* Detected Bugs / Issues */}
              {bugs.length > 0 && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug size={16} className="text-rose-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Identified Potential Bugs ({bugs.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {bugs.map((bug, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300 leading-relaxed"
                      >
                        {bug}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                      Targeted Suggestions
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-850 text-xs text-zinc-300 leading-relaxed flex items-start gap-2"
                      >
                        <CheckCircle2 size={13} className="text-violet-400 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Summary */}
              {finalFeedback && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-2">
                    Review Summary
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850">
                    {finalFeedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
                <Code2 size={26} />
              </div>
              <h3 className="text-base font-bold text-zinc-200">Awaiting Code Submission</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-2 leading-relaxed">
                Paste your code in the editor or select a template, then click "Run Code Review" to inspect syntax errors, time/space complexity, and runtime safety.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AICodeReview;