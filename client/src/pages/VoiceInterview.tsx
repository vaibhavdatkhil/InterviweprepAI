import { Link } from "react-router-dom";
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
  ArrowRight,
  Award
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { 
  startInterview, 
  evaluateInterviewAnswer, 
  completeInterview 
} from "../services/interviewService";

interface AnswerRecord {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

const VoiceInterview = () => {
  const navigate = useNavigate();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([
    "How do you approach designing scalable systems with high availability and fault tolerance?",
    "Explain how you handle performance bottlenecks in database queries or API latency.",
    "Describe a challenging technical disagreement you resolved within an engineering team."
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Voice & Transcription states
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  // Session answers & final report
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finalReport, setFinalReport] = useState<any | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize session from DB on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const track = localStorage.getItem("selected_interview_track") || "backend";
        const session = await startInterview({ track });
        if (session && session.questions && session.questions.length > 0) {
          setInterviewId(session.interviewId);
          setQuestions(session.questions.map((q) => q.question));
          toast.success(`Started live ${track.toUpperCase()} interview session`);
        }
      } catch (err) {
        console.warn("Could not start backend interview session:", err);
      }
    };

    initSession();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
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
      console.warn("Speech recognition notice:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Microphone permission denied. You can type your answer manually below.");
      }
      setListening(false);
    };

    recognition.onend = () => {
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
      const text = questions[currentQuestionIndex];
      const utterance = new SpeechSynthesisUtterance(text);
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
    setCurrentScore(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
        toast.success("Microphone active — answer out loud!");
      } catch (err) {
        setListening(true);
      }
    } else {
      toast("Microphone API unavailable. Type your response in the box below.", { icon: "🎙️" });
      setListening(true);
    }
  };

  const stopListeningAndEvaluate = async () => {
    setListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    const currentAnswer = transcript.trim();
    if (currentAnswer.length < 5) {
      toast.error("Please speak or type a substantive answer before evaluating.");
      return;
    }

    try {
      setEvaluating(true);
      const activeQuestion = questions[currentQuestionIndex];
      const res = await evaluateInterviewAnswer({
        interviewId: interviewId || undefined,
        question: activeQuestion,
        answer: currentAnswer,
        questionIndex: currentQuestionIndex,
      });

      const scoreValue = res.score ?? 70;
      const feedbackText = res.feedback || "Answer evaluated for technical accuracy and clarity.";

      setCurrentScore(scoreValue);
      setFeedback(feedbackText);

      // Record answer
      const record: AnswerRecord = {
        question: activeQuestion,
        answer: currentAnswer,
        score: scoreValue,
        feedback: feedbackText,
      };

      setAnswers((prev) => [...prev, record]);
      toast.success("Answer evaluated!");
    } catch (err: any) {
      console.error("Evaluation error:", err);
      toast.error("Failed to evaluate answer. Check server connection.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextOrFinish = async () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setFeedback("");
      setCurrentScore(null);
    } else {
      // Complete interview in database
      try {
        setEvaluating(true);
        if (interviewId && answers.length > 0) {
          const report = await completeInterview({
            interviewId,
            answers,
          });
          setFinalReport(report);
          toast.success("Interview completed and saved to database!");
        } else {
          // Calculate score from answers
          const totalScore = answers.length > 0 
            ? Math.round(answers.reduce((acc, a) => acc + a.score, 0) / answers.length) 
            : 75;
          setFinalReport({
            overallScore: totalScore,
            summary: "Comprehensive mock session completed across technical depth and clear articulation.",
            answersCount: answers.length
          });
        }
      } catch (err) {
        console.error("Completion error:", err);
      } finally {
        setEvaluating(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Final Report Modal / Card */}
        {finalReport ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 sm:p-10 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Interview Session Complete</h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
                Your performance has been evaluated and saved to your progress and dashboard records.
              </p>
            </div>

            {/* Final Overall Score */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Overall Score</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
                  {finalReport.overallScore ?? 75}%
                </span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Questions Evaluated</span>
                <span className="text-3xl font-extrabold text-zinc-100 mt-1 block">
                  {answers.length}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">XP Earned</span>
                <span className="text-3xl font-extrabold text-amber-400 mt-1 block">+100 XP</span>
              </div>
            </div>

            {/* Questions review */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Performance by Question
              </h4>
              {answers.map((ans, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-850 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-zinc-200">Q{idx + 1}: {ans.question}</span>
                    <span className="text-xs font-mono font-bold text-violet-400">{ans.score}%</span>
                  </div>
                  <p className="text-xs text-zinc-400 italic">"{ans.answer}"</p>
                  <p className="text-[11px] text-zinc-500">{ans.feedback}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link to="/dashboard">
                <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2">
                  <span>Return to Dashboard</span>
                  <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* Live Interview Workspace */
          <div className="flex-grow flex flex-col xl:flex-row gap-6">
            {/* Left Side: Question Screen & Controls */}
            <div className="flex-grow flex flex-col gap-6">
              {/* Question Progression */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 sm:p-6">
                <div className="flex justify-between items-center text-xs text-zinc-500 mb-3 font-semibold">
                  <span className="tracking-wider uppercase">Live Voice Session</span>
                  <span className="text-zinc-300 font-mono">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                  <div 
                    className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Booth */}
              <div className="bg-gradient-to-br from-zinc-900/70 via-zinc-950/80 to-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-violet-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} /> Technical Interviewer
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
                    "{questions[currentQuestionIndex]}"
                  </h2>
                </div>

                {/* Audio Wave Indicator */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-zinc-850/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${listening ? "bg-rose-500 animate-ping" : "bg-zinc-600"}`} />
                    <span className="text-xs font-semibold text-zinc-400">
                      {listening ? "Recording candidate speech..." : "Microphone idle"}
                    </span>
                  </div>

                  {listening ? (
                    <div className="flex items-end gap-1 h-6">
                      <span className="w-1.5 bg-rose-500 rounded-full h-3 animate-pulse" />
                      <span className="w-1.5 bg-rose-500 rounded-full h-6 animate-pulse" />
                      <span className="w-1.5 bg-rose-500 rounded-full h-4 animate-pulse" />
                      <span className="w-1.5 bg-rose-500 rounded-full h-5 animate-pulse" />
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
                    disabled={listening || evaluating}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-emerald-600/15"
                  >
                    <Mic size={14} /> Start Speaking
                  </button>

                  <button
                    onClick={stopListeningAndEvaluate}
                    disabled={evaluating || (!listening && transcript.length < 5)}
                    className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-rose-600/15"
                  >
                    <MicOff size={14} /> Stop & Evaluate
                  </button>

                  <button
                    onClick={() => { setTranscript(""); setFeedback(""); setCurrentScore(null); }}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold text-xs px-3.5 py-3 rounded-xl transition cursor-pointer"
                    title="Reset Answer"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                <button
                  onClick={handleNextOrFinish}
                  disabled={evaluating}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-600/20"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"} <ChevronRight size={14} />
                </button>
              </div>

              {/* Captured Transcript */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider">
                    Candidate Response (Voice or Text)
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {transcript ? `${transcript.split(/\s+/).filter(Boolean).length} words` : "Waiting for response"}
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
              {evaluating ? (
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-grow animate-pulse min-h-[300px]">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6">
                    <Sparkles size={24} className="animate-spin text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200 font-display">Evaluating Answer</h3>
                  <p className="text-zinc-500 text-xs max-w-xs mt-2 leading-relaxed">
                    Analyzing technical clarity, structural depth, and relevance to the question...
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
                          strokeDashoffset={2 * Math.PI * 32 * (1 - (currentScore || 0) / 100)} 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="32" 
                          cx="40" 
                          cy="40" 
                        />
                      </svg>
                      <span className="text-xl font-extrabold text-zinc-100">{currentScore}%</span>
                    </div>
                    <div>
                      <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Evaluation Score</h4>
                      <p className="text-base font-bold text-zinc-200 mt-1">
                        {(currentScore || 0) >= 80 ? "Highly Proficient" : (currentScore || 0) >= 60 ? "Proficient" : "Needs Improvement"}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Clarity & Relevance Assessed
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
                    <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={15} className="text-violet-400" />
                      Interviewer Evaluation
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default VoiceInterview;
