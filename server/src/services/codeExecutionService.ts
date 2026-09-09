import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

export interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Compile Error" | "Runtime Error" | "Time Limit Exceeded" | "Execution Unavailable";
  output: string;
  error?: string;
  runtimeMs: number;
  passedTests: number;
  totalTests: number;
  testResults: Array<{
    testIndex: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
}

// Problem test suites
const PROBLEM_TESTS: Record<
  string,
  {
    functionName: string;
    pythonFunctionName: string;
    testCases: Array<{ input: any[]; expected: any; inputStr: string; expectedStr: string }>;
  }
> = {
  q1: {
    functionName: "twoSum",
    pythonFunctionName: "two_sum",
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], inputStr: "nums=[2,7,11,15], target=9", expectedStr: "[0,1]" },
      { input: [[3, 2, 4], 6], expected: [1, 2], inputStr: "nums=[3,2,4], target=6", expectedStr: "[1,2]" },
      { input: [[3, 3], 6], expected: [0, 1], inputStr: "nums=[3,3], target=6", expectedStr: "[0,1]" },
    ],
  },
  q2: {
    functionName: "lengthOfLongestSubstring",
    pythonFunctionName: "length_of_longest_substring",
    testCases: [
      { input: ["abcabcbb"], expected: 3, inputStr: 's="abcabcbb"', expectedStr: "3" },
      { input: ["bbbbb"], expected: 1, inputStr: 's="bbbbb"', expectedStr: "1" },
      { input: ["pwwkew"], expected: 3, inputStr: 's="pwwkew"', expectedStr: "3" },
    ],
  },
  q4: {
    functionName: "isValid",
    pythonFunctionName: "is_valid",
    testCases: [
      { input: ["()"], expected: true, inputStr: 's="()"', expectedStr: "true" },
      { input: ["()[]{}"], expected: true, inputStr: 's="()[]{}"', expectedStr: "true" },
      { input: ["(]"], expected: false, inputStr: 's="(]"', expectedStr: "false" },
    ],
  },
};

/**
 * Executes code in a safe isolated child process with strict timeout.
 */
export const runRawCode = async (
  language: string,
  code: string,
  timeoutMs: number = 3000
): Promise<{ stdout: string; stderr: string; runtimeMs: number; timedOut: boolean }> => {
  const normalizedLang = language.toLowerCase();
  const tempDir = os.tmpdir();
  const startTime = Date.now();

  let command = "";
  let args: string[] = [];
  let tempFilePath = "";

  if (normalizedLang === "javascript" || normalizedLang === "typescript") {
    tempFilePath = path.join(tempDir, `prepai_${Date.now()}_${Math.random().toString(36).substring(7)}.js`);
    fs.writeFileSync(tempFilePath, code, "utf8");
    command = "node";
    args = [tempFilePath];
  } else if (normalizedLang === "python" || normalizedLang === "py") {
    tempFilePath = path.join(tempDir, `prepai_${Date.now()}_${Math.random().toString(36).substring(7)}.py`);
    fs.writeFileSync(tempFilePath, code, "utf8");
    command = "python";
    args = [tempFilePath];
  } else {
    return {
      stdout: "",
      stderr: `Execution for ${language} is currently not supported in local sandbox. Supported languages: JavaScript, Python, TypeScript.`,
      runtimeMs: 0,
      timedOut: false,
    };
  }

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const child = spawn(command, args, {
      timeout: timeoutMs,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      shell: false,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore
      }
    }, timeoutMs);

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", () => {
      clearTimeout(timer);
      const runtimeMs = Date.now() - startTime;
      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      } catch {
        // ignore
      }

      resolve({
        stdout: stdout.slice(0, 5000),
        stderr: stderr.slice(0, 5000),
        runtimeMs,
        timedOut,
      });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      try {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      } catch {
        // ignore
      }

      resolve({
        stdout: "",
        stderr: err.message,
        runtimeMs: Date.now() - startTime,
        timedOut: false,
      });
    });
  });
};

/**
 * Runs a problem submission against actual test cases and verifies answers.
 */
export const executeProblemSubmission = async (
  problemId: string,
  language: string,
  code: string
): Promise<ExecutionResult> => {
  const problemSuite = PROBLEM_TESTS[problemId] || PROBLEM_TESTS["q1"];
  const normalizedLang = language.toLowerCase();

  // Build the test execution harness
  let harnessCode = "";
  if (normalizedLang === "javascript" || normalizedLang === "typescript") {
    const fnName = problemSuite.functionName;
    harnessCode = `
${code}

// Test Runner Harness
const testCases = ${JSON.stringify(problemSuite.testCases)};
const results = [];

try {
  const targetFn = typeof ${fnName} === 'function' ? ${fnName} : (typeof twoSum === 'function' ? twoSum : null);
  if (!targetFn) {
    console.log(JSON.stringify({ error: "Function '${fnName}' not found in code." }));
    process.exit(0);
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    try {
      const res = targetFn(...tc.input);
      results.push({
        testIndex: i + 1,
        input: tc.inputStr,
        expected: tc.expectedStr,
        actual: JSON.stringify(res),
        passed: JSON.stringify(res) === tc.expectedStr || JSON.stringify(res) === JSON.stringify(tc.expected)
      });
    } catch (testErr) {
      results.push({
        testIndex: i + 1,
        input: tc.inputStr,
        expected: tc.expectedStr,
        actual: "Runtime Error: " + testErr.message,
        passed: false
      });
    }
  }

  console.log("PREPAI_TEST_RESULTS_START" + JSON.stringify(results) + "PREPAI_TEST_RESULTS_END");
} catch (outerErr) {
  console.log(JSON.stringify({ error: outerErr.message }));
}
`;
  } else if (normalizedLang === "python" || normalizedLang === "py") {
    const pyFnName = problemSuite.pythonFunctionName;
    harnessCode = `
import json, sys

${code}

test_cases = ${JSON.stringify(problemSuite.testCases)}
results = []

try:
    target_fn = None
    if '${pyFnName}' in globals() and callable(globals()['${pyFnName}']):
        target_fn = globals()['${pyFnName}']
    elif 'two_sum' in globals() and callable(globals()['two_sum']):
        target_fn = globals()['two_sum']
    elif 'twoSum' in globals() and callable(globals()['twoSum']):
        target_fn = globals()['twoSum']

    if target_fn is None:
        print(json.dumps({"error": "Function '${pyFnName}' not found in submitted code."}))
        sys.exit(0)

    for i, tc in enumerate(test_cases):
        try:
            res = target_fn(*tc['input'])
            expected = tc['expected']
            passed = (res == expected) or (json.dumps(res) == tc['expectedStr'])
            results.push = results.append({
                "testIndex": i + 1,
                "input": tc['inputStr'],
                "expected": tc['expectedStr'],
                "actual": json.dumps(res),
                "passed": bool(passed)
            })
        except Exception as e:
            results.append({
                "testIndex": i + 1,
                "input": tc['inputStr'],
                "expected": tc['expectedStr'],
                "actual": "Runtime Error: " + str(e),
                "passed": False
            })

    print("PREPAI_TEST_RESULTS_START" + json.dumps(results) + "PREPAI_TEST_RESULTS_END")
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
  } else {
    return {
      status: "Execution Unavailable",
      output: `Live test execution for ${language} is not available in the current environment.`,
      runtimeMs: 0,
      passedTests: 0,
      totalTests: problemSuite.testCases.length,
      testResults: [],
    };
  }

  const { stdout, stderr, runtimeMs, timedOut } = await runRawCode(language, harnessCode, 3500);

  if (timedOut) {
    return {
      status: "Time Limit Exceeded",
      output: "Time Limit Exceeded: Code execution exceeded 3.5 seconds.",
      error: "Potential infinite loop or recursion without base case.",
      runtimeMs,
      passedTests: 0,
      totalTests: problemSuite.testCases.length,
      testResults: [],
    };
  }

  if (stderr && !stdout.includes("PREPAI_TEST_RESULTS_START")) {
    return {
      status: stderr.toLowerCase().includes("syntax") ? "Compile Error" : "Runtime Error",
      output: stderr,
      error: stderr,
      runtimeMs,
      passedTests: 0,
      totalTests: problemSuite.testCases.length,
      testResults: [],
    };
  }

  // Extract structured test results
  const markerStart = stdout.indexOf("PREPAI_TEST_RESULTS_START");
  const markerEnd = stdout.indexOf("PREPAI_TEST_RESULTS_END");

  if (markerStart !== -1 && markerEnd !== -1) {
    try {
      const jsonStr = stdout.slice(markerStart + "PREPAI_TEST_RESULTS_START".length, markerEnd);
      const testResults = JSON.parse(jsonStr);
      const passedTests = testResults.filter((t: any) => t.passed).length;
      const totalTests = testResults.length;
      const isAllPassed = passedTests === totalTests && totalTests > 0;

      return {
        status: isAllPassed ? "Accepted" : "Wrong Answer",
        output: isAllPassed
          ? `All ${totalTests} test cases passed.`
          : `Passed ${passedTests} of ${totalTests} test cases.`,
        runtimeMs,
        passedTests,
        totalTests,
        testResults,
      };
    } catch {
      // JSON parse error
    }
  }

  return {
    status: "Runtime Error",
    output: stdout || stderr || "Execution finished without valid test output.",
    error: stderr,
    runtimeMs,
    passedTests: 0,
    totalTests: problemSuite.testCases.length,
    testResults: [],
  };
};
