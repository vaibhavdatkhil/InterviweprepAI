import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../middleware/authMiddleware";
import { analyzeCodeLocally } from "../services/codeAnalysisService";
import CodeReview from "../models/CodeReview";
import Activity from "../models/Activity";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const reviewCode = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { code, language, problemContext } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Code snippet is required." });
    }

    const selectedLang = (language || "javascript").toLowerCase();

    // 1. Perform Real Local Static & Syntax Analysis
    const localAnalysis = analyzeCodeLocally(selectedLang, code);

    // 2. Prepare Ground Truth Context for AI Prompt
    const prompt = `
You are an expert technical code reviewer.

CRITICAL INSTRUCTIONS:
- Analyze ONLY the submitted code below.
- Do NOT assume the code implements any preset or challenge.
- Do NOT invent loops, hash maps, binary trees, arrays, or optimizations that are not in the submitted code.
- If syntax errors exist, focus on explaining and correcting the syntax error.
- The detected time complexity based on loop nesting is: ${localAnalysis.timeComplexity}.
- The detected space complexity is: ${localAnalysis.spaceComplexity}.

Language: ${selectedLang}
${problemContext ? `Optional Context provided by user (do not assume code matches this): ${problemContext}` : ""}

Submitted Code:
${code}

${
  !localAnalysis.syntaxValid
    ? `Syntax Validation FAILED: ${localAnalysis.syntaxErrors.join("; ")}. State clearly that the code does NOT compile.`
    : `Syntax Validation PASSED.`
}

${
  localAnalysis.semanticBugs.length > 0
    ? `Detected Semantic/Type Issues: ${localAnalysis.semanticBugs.join("; ")}`
    : ""
}

Respond in this format:
Score: <0-100>/100
Time Complexity: ${localAnalysis.timeComplexity}
Space Complexity: ${localAnalysis.spaceComplexity}

Bugs:
- <bug item 1>
- <bug item 2>

Improvements:
- <specific improvement 1>
- <specific improvement 2>

Final Feedback:
<constructive evaluation based only on the submitted code>
`;

    let aiReviewText = "";
    let finalScore = 50;

    // 3. Attempt AI Explanation via Groq if available
    if (GROQ_API_KEY && !GROQ_API_KEY.includes("xxx") && !GROQ_API_KEY.startsWith("invalid")) {
      try {
        const aiResponse = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 5000,
          }
        );
        aiReviewText = aiResponse.data.choices?.[0]?.message?.content || "";
      } catch (err: any) {
        console.warn("Groq AI call failed:", err.response?.data?.error?.message || err.message);
      }
    }

    // 4. Construct Authentic Result from Ground Truth Static Analysis
    let reportedBugs = [...localAnalysis.syntaxErrors, ...localAnalysis.semanticBugs];
    let reportedImprovements: string[] = [];
    let reportedFeedback = "";

    if (!localAnalysis.syntaxValid) {
      finalScore = 25;
      reportedFeedback = `Code does not compile. Resolved ${localAnalysis.syntaxErrors.length} syntax error(s) before assessing algorithmic efficiency.`;
      reportedImprovements = [
        "Fix syntax errors indicated above to enable program compilation.",
        "Check closing brackets, indentation, and required colons / semicolons.",
      ];
    } else {
      finalScore = localAnalysis.semanticBugs.length > 0 ? 55 : 85;
      if (localAnalysis.loopNesting === 0) {
        reportedFeedback = "Code has straight-line execution with O(1) constant time and space complexity.";
        reportedImprovements = [
          "Ensure input bounds and edge cases are handled.",
          "Add docstrings and type annotations to improve maintainability.",
        ];
      } else {
        reportedFeedback = `Code executes with ${localAnalysis.timeComplexity} runtime complexity across ${localAnalysis.loopNesting} loop level(s).`;
        reportedImprovements = [
          "Evaluate if data structures can reduce loop iterations.",
          "Add unit tests covering boundary test values.",
        ];
      }
    }

    // If AI responded, blend its verbal feedback while preserving static analysis ground truth
    if (aiReviewText) {
      const scoreMatch = aiReviewText.match(/Score:\s*(\d+)/i) || aiReviewText.match(/(\d+)\/100/);
      if (scoreMatch) {
        const parsedScore = parseInt(scoreMatch[1], 10);
        // If syntax is invalid, score cannot exceed 40
        finalScore = !localAnalysis.syntaxValid ? Math.min(parsedScore, 35) : parsedScore;
      }

      const bugsSection = aiReviewText.split(/Improvements:|Final Feedback:/i)[0];
      const parsedBugs = bugsSection
        .split("\n")
        .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
        .map((l) => l.replace(/^[-*]\s*/, "").trim());

      if (parsedBugs.length > 0) {
        reportedBugs = Array.from(new Set([...reportedBugs, ...parsedBugs]));
      }

      const improvementsSection = aiReviewText.split(/Improvements:/i)[1]?.split(/Final Feedback:/i)[0];
      if (improvementsSection) {
        const parsedImprov = improvementsSection
          .split("\n")
          .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
          .map((l) => l.replace(/^[-*]\s*/, "").trim());
        if (parsedImprov.length > 0) reportedImprovements = parsedImprov;
      }

      const feedbackSection = aiReviewText.split(/Final Feedback:/i)[1];
      if (feedbackSection && feedbackSection.trim().length > 10) {
        reportedFeedback = feedbackSection.trim();
      }
    }

    // Format review text
    const formattedReview = `Score: ${finalScore}/100
Time Complexity: ${localAnalysis.timeComplexity}
Space Complexity: ${localAnalysis.spaceComplexity}

Bugs:
${reportedBugs.length > 0 ? reportedBugs.map((b) => `- ${b}`).join("\n") : "- No critical bugs detected."}

Improvements:
${reportedImprovements.map((i) => `- ${i}`).join("\n")}

Final Feedback:
${reportedFeedback}`;

    // 5. Save to Database for Authenticated User
    const savedReview = await CodeReview.create({
      userId,
      code,
      language: selectedLang,
      problemContext: problemContext || "",
      syntaxValid: localAnalysis.syntaxValid,
      syntaxErrors: localAnalysis.syntaxErrors,
      bugs: reportedBugs,
      improvements: reportedImprovements,
      timeComplexity: localAnalysis.timeComplexity,
      spaceComplexity: localAnalysis.spaceComplexity,
      score: finalScore,
      feedback: reportedFeedback,
    });

    // Record Activity
    await Activity.create({
      userId,
      type: "code_review",
      title: `Code Review: ${selectedLang.toUpperCase()} (${localAnalysis.timeComplexity})`,
      details: `Score: ${finalScore}/100 · ${localAnalysis.syntaxValid ? "Valid Syntax" : "Syntax Errors"}`,
      xpEarned: 5,
    });

    res.json({
      success: true,
      reviewId: savedReview._id,
      review: formattedReview,
      score: finalScore,
      syntaxValid: localAnalysis.syntaxValid,
      syntaxErrors: localAnalysis.syntaxErrors,
      timeComplexity: localAnalysis.timeComplexity,
      spaceComplexity: localAnalysis.spaceComplexity,
      complexity: {
        time: localAnalysis.timeComplexity,
        space: localAnalysis.spaceComplexity,
      },
      bugs: reportedBugs,
      improvements: reportedImprovements,
      suggestions: reportedImprovements,
      feedback: reportedFeedback,
    });
  } catch (error: any) {
    console.error("reviewCode error:", error);
    res.status(500).json({
      message: "Code review failed.",
      error: error.message,
    });
  }
};

export const getLatestReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const latest = await CodeReview.findOne({ userId }).sort({ createdAt: -1 });
    if (!latest) {
      return res.json(null);
    }
    res.json({
      ...latest.toObject(),
      complexity: {
        time: latest.timeComplexity,
        space: latest.spaceComplexity,
      },
      suggestions: latest.improvements,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch latest review." });
  }
};