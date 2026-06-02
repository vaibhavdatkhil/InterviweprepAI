import { useState }
from "react";

import Editor
from "@monaco-editor/react";

import {
  Play,
  Send,
  Terminal as TerminalIcon,
  Code2,
  FileCode,
} from "lucide-react";

import toast
from "react-hot-toast";

import api
from "../services/api";

import DashboardLayout
from "../layouts/DashboardLayout";

const starterCode = `function hello() {
  console.log("Hello World");
}

hello();
`;

const CodeEditor = () => {

  // ==========================
  // STATES
  // ==========================

  const [code, setCode] =
    useState(starterCode);

  const [language,
    setLanguage] =
    useState("javascript");

  const [consoleLogs,
    setConsoleLogs] =
    useState<string[]>([]);

  const [isRunning,
    setIsRunning] =
    useState(false);

  // ==========================
  // RUN CODE
  // ==========================

  const handleRun =
  async () => {

    try {

      setIsRunning(true);

      setConsoleLogs([
        "[INFO] Compiling...",
      ]);

      const response =
        await api.post(
          "/code/run",
          {
            language,
            code,
          }
        );

      console.log(
        response.data
      );

      const output =
        response.data.run
          ?.output;

      if (output) {

        setConsoleLogs([

          "[INFO] Execution Success",

          "",

          output,

        ]);

        toast.success(
          "Code executed successfully!"
        );

      } else {

        setConsoleLogs([

          "[ERROR] No output generated",

        ]);

      }

    } catch (error: any) {

      console.log(error);

      setConsoleLogs([

        "[ERROR] Execution Failed",

        "",

        error.message,

      ]);

      toast.error(
        "Execution failed!"
      );

    } finally {

      setIsRunning(false);

    }

  };

  // ==========================
  // SUBMIT CODE
  // ==========================

  const handleSubmit =
  async () => {

    try {

      setIsRunning(true);

      setConsoleLogs([

        "[INFO] Running test cases...",

      ]);

      const response =
        await api.post(
          "/code/run",
          {
            language,
            code,
          }
        );

      const output =
        response.data.run
          ?.output;

      console.log(output);

      // ======================
      // SIMPLE CHECK
      // ======================

      if (
        output?.includes(
          "Hello World"
        )
      ) {

        setConsoleLogs([

          "[SUCCESS] All test cases passed!",

          "",

          output,

          "",

          "Runtime: 45ms",

        ]);

        toast.success(
          "Solution Accepted!"
        );

      } else {

        setConsoleLogs([

          "[ERROR] Wrong Output",

          "",

          output ||
            "No output",

        ]);

        toast.error(
          "Wrong Answer!"
        );

      }

    } catch (error: any) {

      console.log(error);

      setConsoleLogs([

        "[ERROR] Submission Failed",

        "",

        error.message,

      ]);

      toast.error(
        "Submission failed!"
      );

    } finally {

      setIsRunning(false);

    }

  };

  return (

    <DashboardLayout>

      <div className="flex-grow flex flex-col xl:flex-row gap-6">

        {/* ========================= */}
        {/* QUESTION PANEL */}
        {/* ========================= */}

        <div className="flex-1 xl:max-w-md flex flex-col gap-6">

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">

            <div className="flex items-center gap-2">

              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/25">

                Easy

              </span>

              <span className="text-zinc-500 text-xs">

                Recommended

              </span>

            </div>

            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">

              <Code2
                size={20}
                className="text-violet-400"
              />

              1. Two Sum

            </h2>

            <div className="text-zinc-300 text-sm leading-relaxed space-y-3">

              <p>

                Given an array of integers nums and a target value,
                return indices of the two numbers that add up to target.

              </p>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* EDITOR PANEL */}
        {/* ========================= */}

        <div className="flex-2 flex flex-col gap-6">

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col">

            {/* TOOLBAR */}

            <div className="bg-zinc-950/60 border-b border-zinc-900 px-5 py-3.5 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FileCode
                  size={16}
                  className="text-violet-400"
                />

                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">

                  Workspace

                </span>

              </div>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none"
              >

                <option value="javascript">
                  JavaScript
                </option>

                <option value="python">
                  Python
                </option>

                <option value="java">
                  Java
                </option>

              </select>

            </div>

            {/* MONACO */}

            <div className="border-b border-zinc-900 p-2 bg-[#1e1e1e]">

              <Editor
                height="45vh"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) =>
                  setCode(
                    value || ""
                  )
                }
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 14,
                }}
              />

            </div>

            {/* BUTTONS */}

            <div className="p-4 bg-zinc-950/20 flex items-center justify-between gap-4">

              <span className="text-[10px] text-zinc-500 font-mono">

                Sandbox Environment

              </span>

              <div className="flex items-center gap-2">

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >

                  <Play
                    size={13}
                    fill="currentColor"
                  />

                  Run Sandbox

                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >

                  <Send size={13} />

                  Submit Code

                </button>

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* CONSOLE */}
          {/* ========================= */}

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">

            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4">

              <TerminalIcon
                size={16}
                className="text-violet-400"
              />

              Execution Console

            </h3>

            <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-2xl min-h-24 font-mono text-xs space-y-1">

              {consoleLogs.length > 0 ? (

                consoleLogs.map(
                  (log, idx) => (

                    <div
                      key={idx}
                      className={
                        log.startsWith(
                          "[SUCCESS]"
                        )
                          ? "text-emerald-400"

                          : log.startsWith(
                              "[INFO]"
                            )
                          ? "text-blue-400"

                          : log.startsWith(
                              "[ERROR]"
                            )
                          ? "text-rose-400"

                          : "text-zinc-300"
                      }
                    >

                      {log}

                    </div>

                  )
                )

              ) : (

                <div className="text-zinc-500">

                  Run or submit your solution.

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default CodeEditor;