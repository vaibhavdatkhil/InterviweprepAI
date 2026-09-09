import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  Terminal as TerminalIcon,
  FileCode,
  RotateCcw,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { runCode, submitCode } from "../services/codeService";

interface ProblemDef {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  description: string;
  example: { input: string; output: string; explanation?: string };
  constraints: string[];
  tags: string[];
  starterCode: Record<string, string>;
}

const PROBLEMS: ProblemDef[] = [
  {
    id: "q1",
    title: "Two Sum",
    difficulty: "Easy",
    company: "Google",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: {
      input: "nums = [2, 7, 11, 15], target = 9",
      output: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists."
    ],
    tags: ["Array", "Hash Table"],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            return [map.get(comp), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      python: `def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))`,
    }
  },
  {
    id: "q4",
    title: "Valid Parentheses",
    difficulty: "Easy",
    company: "Meta",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    example: {
      input: 's = "()[]{}"',
      output: "true",
      explanation: "All opening brackets are closed by matching closing brackets."
    },
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    tags: ["Stack", "String"],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let ch of s) {
        if (ch === '(' || ch === '{' || ch === '[') {
            stack.push(ch);
        } else {
            if (stack.pop() !== map[ch]) return false;
        }
    }
    return stack.length === 0;
}

console.log(isValid("()[]{}"));`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

print(is_valid("()[]{}"))`,
    }
  },
  {
    id: "q2",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    company: "Amazon",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    example: {
      input: 's = "abcabcbb"',
      output: "3",
      explanation: 'The answer is "abc", with the length of 3.'
    },
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    let set = new Set();
    let left = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        while (set.has(s[right])) {
            set.delete(s[left]);
            left++;
        }
        set.add(s[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb"));`,
      python: `def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    res = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        res = max(res, right - left + 1)
    return res

print(length_of_longest_substring("abcabcbb"))`,
    }
  }
];

const CodeEditor = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<ProblemDef>(PROBLEMS[0]);
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(PROBLEMS[0].starterCode["javascript"]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "PrepAI Execution Console",
    "Select Run Code to test your current script or Submit Solution to evaluate against test cases.",
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "Accepted" | "Wrong Answer" | "Runtime Error">("idle");
  const [lastRuntimeMs, setLastRuntimeMs] = useState<number | null>(null);

  const handleQuestionChange = (qId: string) => {
    const q = PROBLEMS.find((item) => item.id === qId);
    if (q) {
      setSelectedQuestion(q);
      const newCode = q.starterCode[language] || q.starterCode["javascript"] || "";
      setCode(newCode);
      setSubmissionStatus("idle");
      setLastRuntimeMs(null);
      setConsoleLogs([
        `Switched problem to: ${q.title} (${q.difficulty})`,
        "Ready to run or submit solution."
      ]);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const newCode = selectedQuestion.starterCode[newLang] || `// Write your ${newLang} solution here\n`;
    setCode(newCode);
    setSubmissionStatus("idle");
    setLastRuntimeMs(null);
    setConsoleLogs([`Switched environment to ${newLang.toUpperCase()}`]);
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setConsoleLogs(["[INFO] Executing code in isolated sandbox...", ""]);

      const res = await runCode({ language, code });
      const timeMs = res.executionTimeMs ?? 0;
      setLastRuntimeMs(timeMs);

      const logs: string[] = [
        `[STATUS] Process finished in ${timeMs}ms (Exit: ${res.success ? "0" : "1"})`,
        ""
      ];

      if (res.output) {
        logs.push("[OUTPUT]");
        logs.push(res.output);
      }
      if (res.error) {
        logs.push("[STDERR / ERROR]");
        logs.push(res.error);
      }
      if (!res.output && !res.error) {
        logs.push("Code executed successfully with no stdout output.");
      }

      setConsoleLogs(logs);
      if (res.success) {
        toast.success("Code executed!");
      } else {
        toast.error("Execution produced errors.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Execution unavailable";
      setConsoleLogs([
        "[ERROR] Sandbox execution failed",
        errMsg,
      ]);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      setConsoleLogs(["[INFO] Running submitted code against problem test cases...", ""]);

      const res = await submitCode({
        language,
        code,
        problemId: selectedQuestion.id
      });

      setSubmissionStatus(res.status);
      setLastRuntimeMs(res.runtimeMs);

      const logs: string[] = [
        `[SUBMISSION RESULT] ${res.status.toUpperCase()}`,
        `Tests Passed: ${res.totalPassed} / ${res.totalTests}`,
        `Execution Runtime: ${res.runtimeMs}ms`,
        ""
      ];

      if (res.results && Array.isArray(res.results)) {
        res.results.forEach((test: any) => {
          if (test.passed) {
            logs.push(`✓ Test Case ${test.testIndex + 1}: Passed`);
          } else {
            logs.push(`✗ Test Case ${test.testIndex + 1}: Failed`);
            if (test.input) logs.push(`  Input: ${test.input}`);
            if (test.expected) logs.push(`  Expected: ${test.expected}`);
            if (test.actual) logs.push(`  Actual Output: ${test.actual}`);
            if (test.error) logs.push(`  Error: ${test.error}`);
          }
        });
      }

      setConsoleLogs(logs);

      if (res.status === "Accepted") {
        toast.success("Accepted! All test cases passed and progress recorded.");
      } else {
        toast.error(`Submission: ${res.status}`);
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Submission failed. Please check backend connection.";
      setConsoleLogs(["[ERROR] Submission evaluation failed", errMsg]);
      toast.error("Submission failed");
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const resetCode = () => {
    const starter = selectedQuestion.starterCode[language] || "";
    setCode(starter);
    setSubmissionStatus("idle");
    setLastRuntimeMs(null);
    setConsoleLogs(["Editor reset to starter template."]);
    toast.success("Reset to template.");
  };

  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        {/* Left Side: Question Specifications Panel */}
        <div className="w-full xl:w-[380px] bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Question Selector */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Current Challenge
              </span>
              <select
                value={selectedQuestion.id}
                onChange={(e) => handleQuestionChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm font-semibold rounded-xl px-3.5 py-2.5 outline-none hover:border-zinc-700 cursor-pointer"
              >
                {PROBLEMS.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Details Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    selectedQuestion.difficulty === "Easy"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : selectedQuestion.difficulty === "Medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Company: <strong className="text-zinc-200">{selectedQuestion.company}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-100">{selectedQuestion.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {selectedQuestion.description}
                </p>
              </div>

              {/* Example */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Example 1:
                </span>
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 text-xs font-mono space-y-1">
                  <div className="text-zinc-400"><strong>Input:</strong> {selectedQuestion.example.input}</div>
                  <div className="text-zinc-200"><strong>Output:</strong> {selectedQuestion.example.output}</div>
                  {selectedQuestion.example.explanation && (
                    <div className="text-zinc-500 text-[11px]">{selectedQuestion.example.explanation}</div>
                  )}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Constraints:
                </span>
                <ul className="text-xs text-zinc-500 space-y-1 font-mono list-disc list-inside">
                  {selectedQuestion.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedQuestion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-zinc-950 text-zinc-400 border border-zinc-850"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submission status banner */}
          {submissionStatus !== "idle" && (
            <div
              className={`mt-4 p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                submissionStatus === "Accepted"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {submissionStatus === "Accepted" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                <span>Solution {submissionStatus}</span>
              </div>
              {lastRuntimeMs !== null && (
                <span className="font-mono text-[11px] opacity-80 flex items-center gap-1">
                  <Clock size={12} /> {lastRuntimeMs}ms
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Monaco Code Editor & Terminal */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="bg-zinc-950/80 border-b border-zinc-850 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-violet-400" />
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none hover:border-zinc-700 cursor-pointer"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                </select>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                  title="Reset to starter code"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                  title="Copy code"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className="p-2 bg-[#1e1e1e]">
              <Editor
                height="48vh"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                }}
              />
            </div>

            {/* Action Bar */}
            <div className="bg-zinc-950/80 border-t border-zinc-850 p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-500 font-mono">
                {code.split("\n").length} lines · Isolated sandbox execution
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 text-zinc-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={13} fill="currentColor" /> Run Code
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-600/20"
                >
                  <Send size={13} /> Submit Solution
                </button>
              </div>
            </div>
          </div>

          {/* Terminal / Console Console */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TerminalIcon size={15} className="text-violet-400" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Test Execution Console
                </span>
              </div>

              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-850"
              >
                Clear
              </button>
            </div>

            <div className="bg-zinc-950/90 border border-zinc-850 p-4 rounded-2xl min-h-[120px] max-h-[160px] overflow-y-auto font-mono text-xs text-zinc-300 space-y-1">
              {consoleLogs.length > 0 ? (
                consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith("[ERROR]") || log.includes("Failed") || log.includes("Wrong Answer")
                        ? "text-rose-400 font-semibold"
                        : log.startsWith("[STATUS]") || log.includes("Passed") || log.includes("ACCEPTED")
                        ? "text-emerald-400 font-semibold"
                        : log.startsWith("[INFO]") || log.startsWith("[OUTPUT]")
                        ? "text-cyan-400"
                        : "text-zinc-300"
                    }
                  >
                    {log}
                  </div>
                ))
              ) : (
                <span className="text-zinc-600 italic">No execution output. Click Run or Submit to see real results.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditor;