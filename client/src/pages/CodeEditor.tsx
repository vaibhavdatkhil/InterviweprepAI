import { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  Send, 
  Terminal as TerminalIcon, 
  Code2, 
  FileCode
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";

const starterCode = `function hello() {
  console.log("Hello World");
}

hello();
`;

const CodeEditor = () => {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState("javascript");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs(["Compiling...", "Running sandbox..."]);
    setTimeout(() => {
      setConsoleLogs([
        "[INFO] Execution success",
        "> Hello World",
        "",
        "-----------------------------",
        "Runtime: 48 ms | Memory: 32.4 MB"
      ]);
      setIsRunning(false);
      toast.success("Code executed successfully!");
    }, 1500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setConsoleLogs(["Testing against 12 testcases..."]);
    setTimeout(() => {
      setConsoleLogs([
        "[SUCCESS] All test cases passed!",
        "12/12 cases matched.",
        "",
        "-----------------------------",
        "Rank: Beats 92.4% of users | runtime: 52 ms"
      ]);
      setIsRunning(false);
      toast.success("Solution Accepted! +100 XP");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Question Details Panel */}
        <div className="flex-1 xl:max-w-md flex flex-col gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/25">
                Easy
              </span>
              <span className="text-zinc-500 text-xs">Recommended</span>
            </div>
            
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Code2 size={20} className="text-violet-400" />
              1. Two Sum
            </h2>

            <div className="text-zinc-300 text-sm leading-relaxed space-y-3">
              <p>
                Given an array of integers <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-violet-400 font-mono text-xs">nums</code> and an integer <code className="bg-zinc-950 px-1.5 py-0.5 rounded text-violet-400 font-mono text-xs">target</code>, return <em>indices of the two numbers such that they add up to target</em>.
              </p>
              <p>
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Example 1:</h4>
              <pre className="bg-zinc-950/80 border border-zinc-850 p-3.5 rounded-xl font-mono text-xs text-zinc-300 space-y-1 overflow-x-auto">
                <div>Input: nums = [2,7,11,15], target = 9</div>
                <div>Output: [0,1]</div>
                <div className="text-zinc-500">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</div>
              </pre>
            </div>
          </div>
        </div>

        {/* Right Side: Monaco Editor Workspace */}
        <div className="flex-2 flex flex-col gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col">
            {/* Editor toolbar */}
            <div className="bg-zinc-950/60 border-b border-zinc-900 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-violet-400" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Workspace</span>
              </div>
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 focus:border-violet-500/50 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            {/* Monaco Container */}
            <div className="border-b border-zinc-900 p-2 bg-[#1e1e1e]">
              <Editor
                height="45vh"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-zinc-950/20 flex items-center justify-between gap-4">
              <span className="text-[10px] text-zinc-500 font-mono">Sandbox: Node v20 environment</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play size={13} fill="currentColor" /> Run Sandbox
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="bg-violet-600 hover:bg-violet-500 text-white transition px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-600/10 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} /> Submit Code
                </button>
              </div>
            </div>
          </div>

          {/* Console / Output logs */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
              <TerminalIcon size={16} className="text-violet-400" />
              Execution Console
            </h3>
            
            <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-2xl min-h-24 font-mono text-xs text-emerald-400 space-y-1">
              {consoleLogs.length > 0 ? (
                consoleLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith("[SUCCESS]") ? "text-emerald-400 font-bold" : log.startsWith("[INFO]") ? "text-blue-400" : log.startsWith("[ERROR]") ? "text-rose-400" : "text-zinc-300"}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-zinc-500">Run or Submit your solution to print execution details.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CodeEditor;