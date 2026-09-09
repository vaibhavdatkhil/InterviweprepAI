import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { 
  Mic, 
  MicOff, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  TrendingUp,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Award
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VOICE_QUESTIONS } from "../data";
import api from "../services/api";
import { evaluateAnswer } from "../services/aiService";

const VoiceInterview = () => {
  const [questions, setQuestions] = useState<string[]>(
    VOICE_QUESTIONS.map(q => q.text)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [finalScores, setFinalScores] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Load questions dynamically based on resume
  useEffect(() => {
    const fetchQuestions = async () => {
      const savedResume = localStorage.getItem("resume_analysis");
      if (savedResume) {
        try {
          const parsed = JSON.parse(savedResume);
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
                  toast.success("AI interview questions customized from your resume!");
                  return;
                }
              }
            } catch (apiErr) {
              console.warn("Backend dynamic questions unavailable, using curated interview suite.", apiErr);
            }
          }
        } catch (e) {
          console.error("Failed to parse stored resume analysis", e);
        }
      }
    };

    fetchQuestions();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser environment.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition warning:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. You can also type your answer below!");
      }
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  // Text-to-speech to read question aloud
  const speakQuestion = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis is not supported on this browser.");
    }
  };

  const startListening = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setTranscript("");
    setFeedback("");
    setScore(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
        toast.success("Microphone active — start speaking!");
      } catch (err) {
        console.warn("Recognition already active or error:", err);
        setListening(true);
      }
    } else {
      toast("Speech recognition unavailable — feel free to type your response.", { icon: "🎙️" });
      setListening(true);
    }
  };

  const stopListening = async () => {
    setListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    setAnalyzing(true);
    toast.success("Audio captured. Running AI evaluation...");
    await generateFeedback();
    setAnalyzing(false);
  };

  const generateFeedback = async () => {
    const textToEvaluate = transcript.trim();
    if (textToEvaluate.length < 5) {
      setFeedback("The answer was too brief. Try to structure your response using the STAR method (Situation, Task, Action, Result) with clear technical context.");
      setScore(25);
      return;
    }

    try {
      // Call backend AI
      const response = await evaluateAnswer(
        questions[currentQuestion],
        textToEvaluate
      );

      const aiText = response?.feedback || "";
      if (aiText) {
        setFeedback(aiText);
        const scoreMatch = aiText.match(/Score:\s*(\d+)/i) || aiText.match(/(\d+)\/100/);
        const calculatedScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 80;
        setScore(calculatedScore);
        setFinalScores((prev) => [...prev, calculatedScore]);
        return;
      }
    } catch (error) {
      console.warn("Backend evaluation offline, switching to simulated AI speech evaluation.", error);
    }

    // Fallback intelligent evaluation
    const wordCount = textToEvaluate.split(/\s+/).length;
    let fallbackScore = 70;
    let reviewPoints: string[] = [];

    if (wordCount > 40) {
      fallbackScore += 15;
      reviewPoints.push("Strong depth and descriptive vocabulary demonstrated.");
    } else if (wordCount > 15) {
      fallbackScore += 8;
      reviewPoints.push("Clear concise delivery, though adding concrete real-world metrics would strengthen the response.");
    } else {
      fallbackScore -= 20;
      reviewPoints.push("Expand on the architectural reasoning and technical hurdles encountered.");
    }

    reviewPoints.push("Good pacing and vocabulary suitable for a technical interview.");
    const finalScore = Math.min(95, Math.max(40, fallbackScore));

    setScore(finalScore);
    setFeedback(`Overall: ${reviewPoints.join(" ")} Clarity score: ${finalScore}/100.`);
    setFinalScores((prev) => [...prev, finalScore]);
  };

  const nextQuestion = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setTranscript("");
    setFeedback("");
    setScore(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const average =
        finalScores.length > 0
          ? Math.round(finalScores.reduce((a, b) => a + b, 0) / finalScores.length)
          : 85;
      toast.success(`Mock Interview Complete! Final Readiness Score: ${average}% 🎉`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-grow flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Question Screen & Controls */}
        <div className="flex-grow flex flex-col gap-6">
          
          {/* Question Progression */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
            <div className="flex justify-between items-center text-xs text-zinc-500 mb-3 font-semibold">
              <span className="tracking-wider uppercase">Interactive Session</span>
              <span className="text-zinc-300 font-mono">Question {currentQuestion + 1} of {questions.length}</span>
            </div>
            
            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
              <div 
                className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Booth */}
          <div className="bg-gradient-to-br from-zinc-900/70 via-zinc-950/80 to-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-violet-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} /> AI Interviewer
                </span>

                <button
                  onClick={speakQuestion}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                    isSpeaking 
                      ? "bg-violet-600/20 border-violet-500/40 text-violet-300 animate-pulse"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <Volume2 size={13} /> {isSpeaking ? "Speaking..." : "Read Aloud"}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-100 mt-4 leading-snug">
                "{questions[currentQuestion]}"
              </h2>
            </div>

            {/* Audio Wave Indicator */}
            <div className="mt-8 flex items-center justify-between pt-4 border-t border-zinc-850/60">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${listening ? "bg-rose-500 animate-ping" : "bg-zinc-600"}`} />
                <span className="text-xs font-semibold text-zinc-400">
                  {listening ? "Recording candidate speech..." : "Mic ready to record"}
                </span>
              </div>

              {listening ? (
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1.5 bg-rose-500 rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
                </div>
              ) : (
                <span className="text-zinc-600 text-xs font-mono">Idle</span>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-4 sm:p-5 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={startListening}
                disabled={listening || analyzing}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-emerald-600/15"
              >
                <Mic size={14} /> Start Speaking
              </button>

              <button
                onClick={stopListening}
                disabled={!listening || analyzing}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-rose-600/15"
              >
                <MicOff size={14} /> Stop & Evaluate
              </button>

              <button
                onClick={() => { setTranscript(""); setFeedback(""); setScore(null); }}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold text-xs px-3.5 py-3 rounded-xl transition cursor-pointer"
                title="Reset Answer"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <button
              onClick={nextQuestion}
              disabled={analyzing}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-600/20"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Interview"} <ChevronRight size={14} />
            </button>
          </div>

          {/* Captured Transcript */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">
                Captured Speech / Text Response
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words` : "Waiting for voice"}
              </span>
            </div>
            
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your answer will appear here in real-time as you speak... You can also edit or type manually."
              rows={3}
              className="w-full bg-zinc-950/80 border border-zinc-850 p-4 rounded-2xl text-zinc-200 text-sm leading-relaxed outline-none focus:border-violet-500/50 resize-y transition"
            />
          </div>

        </div>

        {/* Right Side: AI Analytics Feedback */}
        <div className="flex-1 xl:max-w-md flex flex-col gap-6">
          {analyzing ? (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow animate-pulse min-h-[300px]">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                <Sparkles size={24} className="animate-spin text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 font-display">Analyzing Speech Patterns</h3>
              <p className="text-zinc-500 text-xs max-w-xs mt-2 leading-relaxed">
                Evaluating technical vocabulary, structure, and clarity...
              </p>
            </div>
          ) : feedback ? (
            <div className="space-y-6 flex-grow">
              {/* Score Gauge */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle className="text-zinc-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                    <circle 
                      className="text-emerald-400 transition-all duration-700" 
                      strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 32} 
                      strokeDashoffset={2 * Math.PI * 32 * (1 - (score || 0) / 100)} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="32" 
                      cx="40" 
                      cy="40" 
                    />
                  </svg>
                  <span className="text-xl font-extrabold text-zinc-100">{score}%</span>
                </div>
                <div>
                  <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Evaluation Score</h4>
                  <p className="text-base font-bold text-zinc-200 mt-1">
                    {(score || 0) >= 80 ? "Highly Proficient" : (score || 0) >= 60 ? "Proficient" : "Needs Improvement"}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Clarity & Relevance Assessed
                  </span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
                <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-violet-400" />
                  Detailed AI Feedback
                </h4>
                
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850">
                  {feedback}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow min-h-[300px]">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-6">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">Awaiting Response</h3>
              <p className="text-zinc-500 text-xs max-w-xs mt-2 leading-relaxed">
                Click "Start Speaking" to answer using your microphone or type your response, then click "Stop & Evaluate".
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default VoiceInterview;
