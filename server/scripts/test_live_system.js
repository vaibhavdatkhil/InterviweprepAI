// test_live_system.js
// Automated End-to-End Verification of PrepAI Live Platform

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("==================================================");
  console.log("STARTING PREPAI LIVE SYSTEM AUDIT & QA SUITE");
  console.log("==================================================\n");

  const results = [];
  const logResult = (name, passed, details = "") => {
    results.push({ name, passed, details });
    console.log(`${passed ? "✅ PASS" : "❌ FAIL"}: ${name}`);
    if (details) console.log(`   ${details}`);
  };

  try {
    // 0. HEALTH CHECK
    const health = await axios.get(`${BASE_URL}/health`);
    logResult(
      "Health Check & Database Connection",
      health.data.status === "ok" && health.data.database === "connected",
      `Status: ${health.data.status}, DB: ${health.data.database}`
    );

    // TEST A: REGISTER COMPLETELY NEW USER
    const testEmailA = `test_engineer_${Date.now()}@prepai.live`;
    const regResA = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Alex Dev",
      email: testEmailA,
      password: "SuperSecretPassword123!",
    });
    const tokenA = regResA.data.token;
    const userIdA = regResA.data.user.id;
    logResult(
      "TEST A1: User Registration in MongoDB",
      !!tokenA && !!userIdA && regResA.data.user.email === testEmailA,
      `User ID: ${userIdA}, Token issued`
    );

    // Verify session via /auth/me
    const meResA = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST A2: Session Persistence & JWT Authentication (/auth/me)",
      meResA.data.user.id === userIdA,
      `Authenticated as: ${meResA.data.user.name} (${meResA.data.user.email})`
    );

    // TEST 5: NEW USER EMPTY STATE (ZERO FAKE STATS)
    const dashResA = await axios.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const d = dashResA.data;
    const noFakeData = 
      d.questionsSolved === 0 &&
      d.mockInterviews === 0 &&
      d.readinessScore === null &&
      d.currentStreak === 0 &&
      d.xp === 0 &&
      d.recentActivity.length === 0;

    logResult(
      "TEST 5: New User Dashboard has ZERO Fake Numbers",
      noFakeData,
      `Solved: ${d.questionsSolved}, Interviews: ${d.mockInterviews}, Readiness: ${d.readinessScore}, Streak: ${d.currentStreak}, XP: ${d.xp}`
    );

    // TEST 1: AI CODE REVIEW - ACTUAL CODE ANALYZED (NOT TWO SUM OVERRIDE)
    // Submitting simple invalid Python code
    const invalidPython = `name = input("Enter your name: ")
age = input("Enter your age: ")

if age > 18
    print("You are eligible")
else
    print("You are not eligible")

print("Hello " + name`;

    const reviewResA = await axios.post(`${BASE_URL}/ai/review`, {
      code: invalidPython,
      language: "python",
      problemContext: "Two Sum" // Testing that Two Sum does NOT override actual code analysis
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    const rev = reviewResA.data;
    const hasSyntaxError = rev.syntaxErrors && rev.syntaxErrors.length > 0;
    const timeIsO1 = rev.complexity.time === "O(1)";
    const notTwoSumReview = !rev.suggestions.some(s => s.toLowerCase().includes("hash table") || s.toLowerCase().includes("two sum"));

    logResult(
      "TEST 1A: AI Review Detects Python Syntax Errors (Missing colons, parens)",
      hasSyntaxError,
      `Syntax Errors: ${JSON.stringify(rev.syntaxErrors)}`
    );

    logResult(
      "TEST 1B: Actual Complexity O(1) for Code Without Loops (Not Two Sum O(n))",
      timeIsO1,
      `Calculated Time: ${rev.complexity.time}, Space: ${rev.complexity.space}`
    );

    logResult(
      "TEST 1C: No Irrelevant Two Sum / Hash Table Recommendations on Unrelated Code",
      notTwoSumReview,
      `Suggestions: ${JSON.stringify(rev.suggestions)}`
    );

    // Verify Latest Review retrieval from DB
    const latestRev = await axios.get(`${BASE_URL}/ai/latest-review`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST 1D: Code Review Saved & Retrieved from MongoDB",
      latestRev.data.score === rev.score,
      `Stored Review Score: ${latestRev.data.score}`
    );

    // TEST 3 & 4: REAL CODE RUN & REAL TEST CASE SUBMISSION
    // Run raw Python
    const runRes = await axios.post(`${BASE_URL}/code/run`, {
      language: "python",
      code: "print('PREPAI_SANDBOX_SUCCESS_42')",
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST 3A: Sandboxed Code Execution stdout/runtime",
      runRes.data.success && runRes.data.output.includes("PREPAI_SANDBOX_SUCCESS_42"),
      `Output: "${runRes.data.output.trim()}", Runtime: ${runRes.data.executionTimeMs}ms`
    );

    // Submit correct solution for Two Sum (q1)
    const validTwoSumSolution = `function twoSum(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
      }
      return [];
    }`;

    const submitRes = await axios.post(`${BASE_URL}/code/submit`, {
      language: "javascript",
      code: validTwoSumSolution,
      problemId: "q1",
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    logResult(
      "TEST 3B: DSA Test Cases Actually Evaluated & Accepted",
      submitRes.data.status === "Accepted" && submitRes.data.totalPassed === submitRes.data.totalTests,
      `Status: ${submitRes.data.status}, Passed: ${submitRes.data.totalPassed}/${submitRes.data.totalTests}, Runtime: ${submitRes.data.runtimeMs}ms`
    );

    // Verify Progress and Dashboard updated in DB
    const progRes = await axios.get(`${BASE_URL}/progress`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST 3C: Database Progress and XP Updated from Real Submission",
      progRes.data.problemsSolved === 1 && progRes.data.totalXP >= 50,
      `Problems Solved: ${progRes.data.problemsSolved}, XP: ${progRes.data.totalXP}, Streak: ${progRes.data.currentStreak}`
    );

    // Check achievement unlocked
    const firstSolvedAchievement = progRes.data.achievements.find(a => a.id === "first_solve" || a.id === "a1");
    logResult(
      "TEST 3D: Milestone Badge 'First Problem Solved' Unlocked Upon Actual Solve",
      firstSolvedAchievement && firstSolvedAchievement.unlocked,
      `Badge: ${firstSolvedAchievement?.label}, Unlocked: ${firstSolvedAchievement?.unlocked}`
    );

    // TEST 2: RESUME / ATS ANALYZER TEST
    // Test with empty/unrelated text PDF
    const emptyPdfPath = path.join(__dirname, "sample_empty.pdf");
    // Minimal PDF header with minimal content
    const minimalPdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n212\n%%EOF";
    fs.writeFileSync(emptyPdfPath, minimalPdf);

    const formEmpty = new FormData();
    formEmpty.append("resume", fs.createReadStream(emptyPdfPath));
    formEmpty.append("targetRole", "Frontend Engineer");

    const emptyRes = await axios.post(`${BASE_URL}/resume/analyze`, formEmpty, {
      headers: {
        ...formEmpty.getHeaders(),
        Authorization: `Bearer ${tokenA}`,
      }
    });

    logResult(
      "TEST 2A: Empty/Unreadable PDF Scores 0% (NO Fake 75%)",
      emptyRes.data.atsScore === 0 && emptyRes.data.status.includes("Invalid"),
      `ATS Score: ${emptyRes.data.atsScore}%, Status: ${emptyRes.data.status}, Skills: ${emptyRes.data.skills.length}`
    );

    // Clean up sample file
    if (fs.existsSync(emptyPdfPath)) fs.unlinkSync(emptyPdfPath);

    // Test with Python-only resume text
    const samplePythonResume = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 160>>stream
BT
/F1 12 Tf
50 700 Td
(Software Engineer Resume. Experience with Python, Django, PostgreSQL, and Linux. Education: B.S. Computer Science. Projects: Python backend microservice.) Tj
ET
endstream
endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref
400
%%EOF`;
    const pythonPdfPath = path.join(__dirname, "sample_python.pdf");
    fs.writeFileSync(pythonPdfPath, samplePythonResume);

    const formPython = new FormData();
    formPython.append("resume", fs.createReadStream(pythonPdfPath));
    formPython.append("targetRole", "Frontend Engineer");

    const pythonRes = await axios.post(`${BASE_URL}/resume/analyze`, formPython, {
      headers: {
        ...formPython.getHeaders(),
        Authorization: `Bearer ${tokenA}`,
      }
    });

    const hasPython = pythonRes.data.skills.includes("Python");
    const noFakeReact = !pythonRes.data.skills.includes("React");
    const reactsInMissing = pythonRes.data.missingSkills.some(s => s.toLowerCase().includes("react"));

    logResult(
      "TEST 2B: Resume with Python Extracts Python and NEVER Fake React",
      hasPython && noFakeReact,
      `Extracted Skills: [${pythonRes.data.skills.join(", ")}]`
    );

    logResult(
      "TEST 2C: React Correctly Identified as Missing Skill for Frontend Target Role",
      reactsInMissing,
      `Missing Skills: [${pythonRes.data.missingSkills.join(", ")}]`
    );

    // Category breakdown sum test
    const cats = pythonRes.data.categoryScores;
    const catSum = cats.skillsMatch.score + cats.experience.score + cats.projects.score + cats.education.score + cats.keywords.score + cats.structure.score;
    logResult(
      "TEST 2D: Explainable ATS Category Scores Sum Exactly to Total Score",
      catSum === pythonRes.data.atsScore,
      `Breakdown: Skills=${cats.skillsMatch.score}/35, Exp=${cats.experience.score}/20, Proj=${cats.projects.score}/15, Edu=${cats.education.score}/10, Kw=${cats.keywords.score}/10, Struct=${cats.structure.score}/10 -> Sum=${catSum}, Total=${pythonRes.data.atsScore}`
    );

    if (fs.existsSync(pythonPdfPath)) fs.unlinkSync(pythonPdfPath);

    // TEST 4: MOCK INTERVIEW STATEFUL SESSION
    const intStart = await axios.post(`${BASE_URL}/interview/start`, {
      track: "backend"
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const interviewId = intStart.data.interviewId;
    logResult(
      "TEST 4A: Mock Interview Session Created in MongoDB",
      !!interviewId && intStart.data.questions.length > 0,
      `Interview ID: ${interviewId}, Questions Count: ${intStart.data.questions.length}`
    );

    const intEval = await axios.post(`${BASE_URL}/interview/evaluate`, {
      interviewId,
      question: intStart.data.questions[0].question,
      answer: "We decouple systems using asynchronous message queues like Kafka and implement circuit breakers with fallback caching to maintain high availability.",
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST 4B: Interview Answer Evaluated on Substantive Content",
      intEval.data.score >= 70 && !!intEval.data.feedback,
      `Score: ${intEval.data.score}%, Feedback: "${intEval.data.feedback.substring(0, 70)}..."`
    );

    const intComplete = await axios.post(`${BASE_URL}/interview/complete`, {
      interviewId,
      answers: [
        {
          question: intStart.data.questions[0].question,
          answer: "We decouple systems using asynchronous message queues.",
          score: intEval.data.score,
          feedback: intEval.data.feedback,
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    logResult(
      "TEST 4C: Mock Interview Completed & Saved to Profile",
      intComplete.data.overallScore === intEval.data.score,
      `Overall Score: ${intComplete.data.overallScore}%`
    );

    // TEST F: USER ISOLATION (USER B CANNOT SEE USER A'S DATA)
    const testEmailB = `user_b_${Date.now()}@prepai.live`;
    const regResB = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Jordan B",
      email: testEmailB,
      password: "Password456!",
    });
    const tokenB = regResB.data.token;

    const dashResB = await axios.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const userBIsIsolated = 
      dashResB.data.questionsSolved === 0 &&
      dashResB.data.mockInterviews === 0 &&
      dashResB.data.xp === 0;

    logResult(
      "TEST F: User Isolation (User B cannot see User A's solved questions, XP, or interviews)",
      userBIsIsolated,
      `User B Solved: ${dashResB.data.questionsSolved}, XP: ${dashResB.data.xp}`
    );

    console.log("\n==================================================");
    const passedCount = results.filter(r => r.passed).length;
    console.log(`AUDIT RESULTS: ${passedCount} / ${results.length} PASSED`);
    console.log("==================================================");

  } catch (err) {
    console.error("Test execution error:", err.response?.data || err.message);
  }
}

runTests();
