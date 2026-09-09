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
    // 1. Python Syntax Validation via python ast
    const checkScript = `
import ast, sys

code = sys.stdin.read()
try:
    tree = ast.parse(code)
except SyntaxError as e:
    print(f"SyntaxError on line {e.lineno}: {e.msg} -> '{e.text.strip() if e.text else ''}'")
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
`;

    try {
      execSync("python -c \"" + checkScript.replace(/"/g, '\\"') + "\"", {
        input: code,
        timeout: 2500,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      syntaxValid = true;
    } catch (err: any) {
      syntaxValid = false;
      const errMsg = (err.stdout || err.stderr || err.message).trim();
      const firstLine = errMsg.split("\n")[0];
      syntaxErrors.push(firstLine || "Python SyntaxError: code failed to parse.");
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
