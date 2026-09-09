import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import vm from "vm";

export interface CodeAnalysisResult {
  syntaxValid: boolean;
  syntaxErrors: string[];
  semanticBugs: string[];
  timeComplexity: string;
  spaceComplexity: string;
  loopNesting: number;
  hasRecursion: boolean;
}

/**
 * Perform real syntax and static analysis on user submitted code.
 */
export const analyzeCodeLocally = (language: string, code: string): CodeAnalysisResult => {
  const normLang = language.toLowerCase();
  const syntaxErrors: string[] = [];
  const semanticBugs: string[] = [];
  let syntaxValid = true;
  let loopNesting = 0;
  let hasRecursion = false;
  let timeComplexity = "O(1)";
  let spaceComplexity = "O(1)";

  if (normLang === "python" || normLang === "py") {
    // 1. Python Syntax Validation via python -m py_compile
    const tempFile = path.join(os.tmpdir(), `syntax_check_${Date.now()}_${Math.random().toString(36).substring(7)}.py`);
    try {
      fs.writeFileSync(tempFile, code, "utf8");
      execSync(`python -m py_compile "${tempFile}"`, {
        timeout: 3000,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      syntaxValid = true;
    } catch (err: any) {
      syntaxValid = false;
      const stderr = (err.stderr || err.stdout || err.message || "").toString().trim();
      const lines = stderr.split("\n").filter((l: string) => l.trim().length > 0);
      const syntaxLine = lines.find((l: string) => l.includes("SyntaxError")) || lines[lines.length - 1] || "SyntaxError: invalid syntax";
      syntaxErrors.push(syntaxLine.trim());
    } finally {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }

    // 2. Python Semantic Checks (e.g. input() string compared to int)
    const lines = code.split("\n");
    const inputVars = new Set<string>();

    lines.forEach((line) => {
      // Find input assignments: e.g. age = input(...)
      const inputMatch = line.match(/^\s*([a-zA-Z_]\w*)\s*=\s*input\s*\(/);
      if (inputMatch) {
        inputVars.add(inputMatch[1]);
      }

      // Check comparisons of those variables directly with numbers without int()
      inputVars.forEach((v) => {
        const compRegex = new RegExp(`\\b${v}\\s*(>|<|>=|<=)\\s*\\d+`);
        if (compRegex.test(line)) {
          semanticBugs.push(
            `Type Mismatch: variable '${v}' is a string returned from input(); comparing string with number will throw TypeError in Python. Wrap with int(${v}).`
          );
        }
      });
    });

    // 3. Python Loop Nesting & Complexity Analysis
    let currentIndent = 0;
    let loopStack: number[] = [];
    let maxNesting = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const indent = line.search(/\S/);
      while (loopStack.length > 0 && loopStack[loopStack.length - 1] >= indent) {
        loopStack.pop();
      }

      if (/^(for|while)\b/.test(trimmed)) {
        loopStack.push(indent);
        if (loopStack.length > maxNesting) {
          maxNesting = loopStack.length;
        }
      }
    });

    loopNesting = maxNesting;

    // Detect recursion
    const fnMatch = code.match(/def\s+([a-zA-Z_]\w*)\s*\(/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      const callCount = (code.match(new RegExp(`\\b${fnName}\\s*\\(`, "g")) || []).length;
      if (callCount > 1) {
        hasRecursion = true;
      }
    }

    // Determine complexities
    if (hasRecursion) {
      timeComplexity = "O(2ⁿ) or O(n) recursive";
      spaceComplexity = "O(n) call stack";
    } else if (loopNesting === 0) {
      timeComplexity = "O(1)";
      spaceComplexity = "O(1)";
    } else if (loopNesting === 1) {
      timeComplexity = "O(n)";
      spaceComplexity = /\[.*for.*in|list\(|dict\(|\.append\(/.test(code) ? "O(n)" : "O(1)";
    } else if (loopNesting === 2) {
      timeComplexity = "O(n²)";
      spaceComplexity = "O(1)";
    } else {
      timeComplexity = `O(n^${loopNesting})`;
      spaceComplexity = "O(1)";
    }
  } else {
    // JavaScript / TypeScript Analysis
    try {
      new vm.Script(code);
      syntaxValid = true;
    } catch (e: any) {
      syntaxValid = false;
      syntaxErrors.push(e.message || "JavaScript SyntaxError: code failed parsing.");
    }

    // Loop Nesting Count
    const lines = code.split("\n");
    let maxNesting = 0;
    let currentLoops = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (/\b(for|while)\s*\(/.test(trimmed)) {
        currentLoops++;
        if (currentLoops > maxNesting) maxNesting = currentLoops;
      }
      if (trimmed.includes("}") && currentLoops > 0) {
        currentLoops--;
      }
    });

    loopNesting = maxNesting;

    // Detect function recursion
    const fnMatch = code.match(/function\s+([a-zA-Z_]\w*)\s*\(/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      const callCount = (code.match(new RegExp(`\\b${fnName}\\s*\\(`, "g")) || []).length;
      if (callCount > 1) hasRecursion = true;
    }

    if (hasRecursion) {
      timeComplexity = "O(2ⁿ) or O(n) recursive";
      spaceComplexity = "O(n) call stack";
    } else if (loopNesting === 0) {
      timeComplexity = "O(1)";
      spaceComplexity = "O(1)";
    } else if (loopNesting === 1) {
      timeComplexity = "O(n)";
      spaceComplexity = /new Map|new Set|\[\]|\.push\(/.test(code) ? "O(n)" : "O(1)";
    } else if (loopNesting === 2) {
      timeComplexity = "O(n²)";
      spaceComplexity = "O(1)";
    } else {
      timeComplexity = `O(n^${loopNesting})`;
      spaceComplexity = "O(1)";
    }
  }

  return {
    syntaxValid,
    syntaxErrors,
    semanticBugs,
    timeComplexity,
    spaceComplexity,
    loopNesting,
    hasRecursion,
  };
};
