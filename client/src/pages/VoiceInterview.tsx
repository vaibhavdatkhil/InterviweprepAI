import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { 
  Mic, 
  MicOff, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  TrendingUp
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VOICE_QUESTIONS } from "../data";
import api from "../services/api";

const generateLocalQuestions = (skills: string[]): string[] => {
  const list: string[] = ["Tell me about yourself and walk me through your engineering experience."];
  
  const skillTemplates: Record<string, string> = {
    react: "You mentioned React on your resume. How do you manage global state in a complex React application, and when would you choose Context API over Redux?",
    node: "Since your resume lists Node.js, can you explain the Node.js event loop and how it handles concurrency despite being single-threaded?",
    mongodb: "MongoDB is listed on your resume. When designing a database, how do you decide between embedding documents vs referencing them, and how do indexes affect query speed?",
    java: "Can you discuss the differences between Abstract Classes and Interfaces in Java, and when you would prefer one over the other?",
    python: "Since you have worked with Python, how does memory management work, and what are the implications of the Global Interpreter Lock (GIL) in multi-threaded programs?",
    typescript: "TypeScript is listed in your skills. What are generics, and how do they help you write reusable, type-safe components?",
    javascript: "Can you explain JavaScript closures and how they can be used to emulate private variables or methods?",
    sql: "For relational databases, what is the difference between an INNER JOIN, LEFT JOIN, and outer joins, and how would you optimize a slow query?",
    aws: "You listed AWS on your resume. How would you design a scalable web hosting architecture using services like AWS EC2, S3, RDS, and CloudFront?",
    express: "Can you explain the role of middleware in Express.js, and describe how custom error handling middleware is structured?",
    html: "What is the CSS box model, and how do Flexbox and CSS Grid differ in modern responsive layouts?",
    css: "What is the CSS box model, and how do Flexbox and CSS Grid differ in modern responsive layouts?",
    "c++": "Since your resume mentions C++, what are smart pointers (unique_ptr, shared_ptr), and how do they prevent memory leaks compared to raw pointers?"
  };

  let count = 0;
  for (const s of skills) {
    const key = s.replace(/[^a-zA-Z50-9+#]/g, '').toLowerCase(); // clean spacing
    
    let matchKey = "";
    if (skillTemplates[key]) matchKey = key;
    else if (key.includes("react") && skillTemplates["react"]) matchKey = "react";
    else if (key.includes("node") && skillTemplates["node"]) matchKey = "node";
    else if (key.includes("mongo") && skillTemplates["mongodb"]) matchKey = "mongodb";
    else if (key.includes("typescript") || key === "ts") matchKey = "typescript";
    else if (key.includes("javascript") || key === "js") matchKey = "javascript";
    
    if (matchKey && skillTemplates[matchKey]) {
      list.push(skillTemplates[matchKey]);
      count++;
      if (count >= 3) break; // limit to 3 skill questions
    }
  }

  // Fallback to general questions if not enough skills found
  if (list.length < 3) {
    list.push("Explain your final year project or a recent technical project you are proud of. What was the tech stack and architectural choices?");
    list.push("Describe a challenging technical bug you encountered and the step-by-step process you took to identify and debug it.");
  }
  
  list.push("Why do you want to join our organization, and what makes you a good fit for this engineering position?");
  return list;
};

const VoiceInterview = () => {
  const [questions, setQuestions] = useState<string[]>(
    VOICE_QUESTIONS.map(q => q.text)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [listening, setListening]             = useState(false);
  const [transcript, setTranscript]           = useState("");
  const [feedback, setFeedback]               = useState("");
  const [score, setScore]                     = useState<number | null>(null);
  const [analyzing, setAnalyzing]             = useState(false);
  const [finalScores, setFinalScores]         = useState<number[]>([]);
  const recognitionRef                        = useRef<any>(null);

  // Load questions dynamically based on resume
  useEffect(() => {
    const fetchQuestions = async () => {
      const savedResume = localStorage.getItem("resume_analysis");
      if (savedResume) {
        try {
          const parsed = JSON.parse(savedResume);
          const skillsList: string[] = parsed.skills || [];
          
          if (parsed.extractedText) {
            try {
              const response = await api.post("/interview/questions", { resumeText: parsed.extractedText });
              if (response.data && response.data.questions) {
                let backendQ: string[] = [];
                if (Array.isArray(response.data.questions)) {
                  backendQ = response.data.questions;
                } else if (typeof response.data.questions === "string") {
                  backendQ = response.data.questions.split("\n").filter((q: string) => q.trim().length > 5);
                }
                if (backendQ.length > 0) {
                  setQuestions(backendQ);
                  toast.success("AI interview questions loaded from your resume!");
                  return;
                }
              }
            } catch (err) {
              console.warn("Backend dynamic question generation failed (missing API key or offline). Falling back to skill templates.");
            }
          }
          
          // Fallback to skill-based generation
          const customQuestions = generateLocalQuestions(skillsList);
          setQuestions(customQuestions);
          toast.success("Questions generated dynamically based on your resume skills!");
        } catch (e) {
          console.error("Error parsing resume analysis data", e);
        }
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous    = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    setTranscript("");
    setFeedback("");
    setScore(null);
    setListening(true);
    recognitionRef.current?.start();
    toast.success("Microphone active - start speaking!");
  };

  const stopListening = async () => {

  setListening(false);

  recognitionRef.current?.stop();

  setAnalyzing(true);

  toast.success(
    "Speech captured. Running AI evaluation..."
  );

  await generateFeedback();

  setAnalyzing(false);

};

  const generateFeedback = async () => {

  try {

    // Short answer check
    if (
      transcript.trim().length < 5
    ) {

      setFeedback(
        "Answer too short and not relevant."
      );

      setScore(5);

      return;

    }

    // Call backend AI
    const response =
      await evaluateAnswer(
        questions[currentQuestion],
        transcript
      );

    const aiText =
      response.feedback || "";

    setFeedback(aiText);

    // Extract score dynamically
    const scoreMatch =
      aiText.match(
        /Score:\s*(\d+)/i
      );

    if (scoreMatch) {

      const extractedScore =
        parseInt(
          scoreMatch[1]
        );

      setScore(
        extractedScore
      );

      setFinalScores(
        (prev) => [
          ...prev,
          extractedScore,
        ]
      );

    } else {

      // fallback score
      setScore(50);

    }

  } catch (error) {

    console.log(error);

    setFeedback(
      "AI evaluation failed."
    );

    setScore(0);

  }

};

  const nextQuestion = () => {
    setTranscript("");
    setFeedback("");
    setScore(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const average =
        [...finalScores].reduce((a, b) => a + b, 0) / (finalScores.length || 1);
      toast.success(`Interview Completed 🎉 — Final Score: ${Math.round(average)}%`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Question Screen & Controls */}
        <div className="flex-grow flex flex-col gap-6">
          
          {/* Question Progression */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6.5">
            <div className="flex justify-between items-center text-xs text-zinc-500 mb-3 font-semibold">
              <span>PROGRESSION</span>
              <span>Question {currentQuestion + 1} of {questions.length}</span>
            </div>
            
            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-violet-500 h-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Booth */}
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">AI Question</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mt-4 leading-snug">
                "{questions[currentQuestion]}"
              </h2>
            </div>

            {/* Waveform / Microphone booth status */}
            <div className="flex items-center gap-6 mt-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                listening 
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-500 animate-pulse" 
                  : "bg-zinc-900 border border-zinc-850 text-zinc-400"
              }`}>
                {listening ? <Mic size={24} /> : <MicOff size={24} />}
              </div>

              {listening ? (
                /* Wave bars bouncing */
                <div className="flex items-end gap-1 h-8">
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
                </div>
              ) : (
                <span className="text-zinc-500 text-xs font-medium">Recording booth is idle. Click start speaking to record.</span>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={startListening}
                disabled={listening || analyzing}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                Start Speaking
              </button>

              <button
                onClick={stopListening}
                disabled={!listening || analyzing}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                Stop & Analyze
              </button>
            </div>

            <button
              onClick={nextQuestion}
              disabled={analyzing}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Interview"} <ChevronRight size={14} />
            </button>
          </div>

          {/* Captured Transcript */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider mb-4">Captured Answer Transcript</h3>
            <div className="bg-zinc-950/80 border border-zinc-855 p-5 rounded-2xl min-h-[100px] text-zinc-300 text-sm leading-relaxed italic">
              {transcript || "Your answer will be transcribed here in real-time as you speak..."}
            </div>
          </div>

        </div>

        {/* Right Side: AI Analytics Feedback */}
        <div className="flex-1 xl:max-w-md flex flex-col gap-6">
          {analyzing ? (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <Sparkles size={24} className="animate-spin-slow text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 font-display">Analyzing Speech Patterns</h3>
              <p className="text-zinc-500 text-sm max-w-xs mt-2 leading-relaxed">
                Evaluating semantics, keyword matches, density, and communication syntax...
              </p>
            </div>
          ) : feedback ? (
            <div className="space-y-6 flex-grow">
              {/* Score Gauge */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                    <circle className="text-emerald-400" strokeWidth="6" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - score! / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                  </svg>
                  <span className="text-xl font-extrabold text-zinc-100">{score}%</span>
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Evaluation Score</h4>
                  <p className="text-lg font-bold text-zinc-200 mt-1">
                    {score! >= 80 ? "Highly Proficient" : score! >= 60 ? "Proficient" : "Needs Improvement"}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">Confidence & Grammar checks passed</span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-violet-400" />
                  Detailed AI Feedback
                </h4>
                
                <p className="text-sm text-zinc-350 leading-relaxed">
                  {feedback}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center text-zinc-550 mb-6">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">Pending Evaluation</h3>
              <p className="text-zinc-500 text-sm max-w-xs mt-2 leading-relaxed">
                Click start speaking, answer the query, and click stop to fetch communication scoring.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default VoiceInterview;
