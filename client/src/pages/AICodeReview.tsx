import { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  Sparkles, 
  HelpCircle, 
  Bug, 
  Lightbulb, 
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { reviewCodeAI } from "../services/aiService";

const starterCode = `function twoSum(nums, target) {
  // Write or paste your solution here...
  for(let i=0; i<nums.length; i++) {
    for(let j=i+1; j<nums.length; j++) {
      if(nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`;

const AICodeReview = () => {
  const [code, setCode] = useState(starterCode);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bugs, setBugs] = useState<string[]>([]);

const analyzeCode = async () => {

  try {

    setLoading(true);

    setSuggestions([]);

    setBugs([]);

    setScore(null);

    // REAL AI RESPONSE
    const response =
      await reviewCodeAI(code);

    const aiText =
      response.review || "";

    console.log(aiText);

    // Extract score dynamically
    const scoreMatch =
      aiText.match(
        /(\d+)\/100/
      );

    if (scoreMatch) {

      setScore(
        parseInt(
          scoreMatch[1]
        )
      );

    } else {

      setScore(50);

    }

    // Extract suggestions
    const suggestionLines =
      aiText
        .split("\n")
        .filter((line: string) =>
          line.includes("-")
        );

    setSuggestions(
      suggestionLines.slice(0, 3)
    );

    // Extract bugs
    const detectedBugs =
      aiText
        .split("\n")
        .filter((line: string) =>
          line.toLowerCase().includes(
            "bug"
          ) ||
          line.toLowerCase().includes(
            "issue"
          ) ||
          line.toLowerCase().includes(
            "problem"
          )
        );

    setBugs(
      detectedBugs.length
        ? detectedBugs
        : [
            "No major bugs detected.",
          ]
    );

    toast.success(
      "Live AI Analysis Complete!"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to analyze code."
    );

  } finally {

    setLoading(false);

  }

};
  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Code Editor Input */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col">
            <div className="bg-zinc-950/60 border-b border-zinc-900 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Review Workspace</span>
              </div>
            </div>

            <div className="border-b border-zinc-900 p-2 bg-[#1e1e1e]">
              <Editor
                height="50vh"
                theme="vs-dark"
                language="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                  }
                }}
              />
            </div>

            <div className="p-4 bg-zinc-950/20">
              <button
                onClick={analyzeCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm py-4 rounded-xl shadow-lg shadow-violet-600/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Syntax & Big-O...
                  </span>
                ) : (
                  <>
                    Run AI Review <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: AI Review Dashboard */}
        <div className="flex-1 xl:max-w-md flex flex-col gap-6">
          {score === null ? (
            /* Blank state */
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">No active review</h3>
              <p className="text-zinc-500 text-sm max-w-xs mt-2 leading-relaxed">
                Paste your solution in the workspace editor and click the review button to trigger our AI debugger.
              </p>
            </div>
          ) : (
            /* Review output details */
            <div className="space-y-6 flex-grow overflow-y-auto">
              {/* Score card */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-95">
                    <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                    <circle className="text-violet-500" strokeWidth="6" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - score / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                  </svg>
                  <span className="text-xl font-extrabold text-zinc-100">{score}%</span>
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Quality Rating</h4>
                  <p className="text-lg font-bold text-zinc-200 mt-1">Refining Required</p>
                  <span className="text-[10px] text-violet-400 font-mono mt-0.5 block">Time: O(N^2) | Space: O(1)</span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb size={15} className="text-amber-400" />
                  AI Suggestions
                </h4>
                
                <ul className="space-y-3">
                  {suggestions.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-zinc-350 leading-relaxed">
                      <span className="text-violet-400 font-bold font-mono">0{idx + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bugs */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Bug size={15} className="text-rose-400" />
                  Detected Gaps & Bugs
                </h4>
                
                <ul className="space-y-3">
                  {bugs.map((bug, idx) => (
                    <li key={idx} className="bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-xl flex gap-3 text-xs text-rose-300 leading-relaxed">
                      <span>{bug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AICodeReview;