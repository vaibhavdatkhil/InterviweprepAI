import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  UploadCloud, 
  AlertTriangle, 
  ListChecks,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  RotateCcw,
  Layers,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import { analyzeResume, getLatestResume } from "../services/resumeService";

type AnalysisState = "idle" | "uploading" | "extracting" | "analyzing" | "complete" | "invalid_resume" | "failed";

const TARGET_ROLES = [
  "Full Stack Engineer",
  "Frontend Engineer",
  "Backend & Distributed Systems",
  "Machine Learning / AI Engineer",
  "DevOps & Cloud Engineer",
];

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load latest analysis from MongoDB on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getLatestResume();
        if (data && (data.atsScore !== undefined || data.skills)) {
          setResult(data);
          if (data.status === "Invalid / Unreadable Document" || data.atsScore === 0) {
            setAnalysisState("invalid_resume");
          } else {
            setAnalysisState("complete");
          }
        }
      } catch (err) {
        // No saved resume, stay in idle state
      }
    };

    fetchLatest();
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a PDF resume file first.");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Only valid PDF files are supported.");
      return;
    }

    try {
      setErrorMessage(null);
      setAnalysisState("uploading");
      
      // Step simulation for granular UX feedback
      const timer1 = setTimeout(() => setAnalysisState("extracting"), 400);
      const timer2 = setTimeout(() => setAnalysisState("analyzing"), 900);

      const data = await analyzeResume(file, targetRole);

      clearTimeout(timer1);
      clearTimeout(timer2);

      setResult(data);

      if (data.status === "Invalid / Unreadable Document" || data.atsScore === 0) {
        setAnalysisState("invalid_resume");
        toast.error("Document is invalid or contains no readable text.");
      } else {
        setAnalysisState("complete");
        toast.success("Resume analyzed and saved to your profile!");
      }
    } catch (error: any) {
      console.error("Resume analysis error:", error);
      setAnalysisState("failed");
      setErrorMessage(error.response?.data?.message || "Failed to analyze resume. Please check backend connection.");
      toast.error("Resume analysis failed.");
    }
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return "Strong Technical Alignment";
    if (score >= 60) return "Moderate Technical Alignment";
    if (score >= 35) return "Partial Alignment — Key Gaps";
    return "Insufficient Content / Low Alignment";
  };

  const breakdown = result?.categoryScores || {
    skillsMatch: { score: 0, max: 35 },
    experience: { score: 0, max: 20 },
    projects: { score: 0, max: 15 },
    education: { score: 0, max: 10 },
    keywords: { score: 0, max: 10 },
    structure: { score: 0, max: 10 },
  };

  const totalCalculated = 
    (breakdown.skillsMatch?.score || 0) +
    (breakdown.experience?.score || 0) +
    (breakdown.projects?.score || 0) +
    (breakdown.education?.score || 0) +
    (breakdown.keywords?.score || 0) +
    (breakdown.structure?.score || 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Upload Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-violet-500/40 rounded-3xl p-8 text-center transition-all duration-300 bg-zinc-950/40">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <UploadCloud size={28} />
            </div>

            <h3 className="text-xl font-bold text-zinc-100">Upload Your Resume (PDF)</h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
              We extract readable text directly from your PDF, measure skill match against your target role, and calculate a transparent, explainable ATS score.
            </p>

            {/* Target Role Selector */}
            <div className="mt-5 w-full max-w-sm text-left">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Target Role Benchmark
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2.5 outline-none hover:border-zinc-700 cursor-pointer"
              >
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* File Input */}
            <div className="mt-4 w-full max-w-sm relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  setFile(selectedFile);
                  if (selectedFile) toast.success(`Selected: ${selectedFile.name}`);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                <FileText size={15} className="text-violet-400" />
                <span className="truncate">{file ? file.name : "Select PDF Document"}</span>
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analysisState === "uploading" || analysisState === "extracting" || analysisState === "analyzing" || !file}
              className="mt-4 w-full max-w-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {analysisState === "uploading" && (
                <>
                  <Sparkles size={14} className="animate-spin" /> Uploading resume...
                </>
              )}
              {analysisState === "extracting" && (
                <>
                  <Sparkles size={14} className="animate-spin" /> Extracting PDF text...
                </>
              )}
              {analysisState === "analyzing" && (
                <>
                  <Sparkles size={14} className="animate-spin" /> Analyzing skills & score...
                </>
              )}
              {analysisState !== "uploading" && analysisState !== "extracting" && analysisState !== "analyzing" && (
                <>
                  <TrendingUp size={14} /> Run ATS Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Invalid Resume / Extraction Failed State */}
        {analysisState === "invalid_resume" && (
          <div className="bg-rose-950/25 border border-rose-800/50 rounded-3xl p-8 max-w-3xl mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-rose-400">0%</span>
              <h4 className="text-base font-bold text-zinc-100 mt-1">Unable to Establish a Match</h4>
              <p className="text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                The uploaded document contains no readable text, is blank, or does not contain recognizable resume sections. Please upload a valid text-based PDF resume.
              </p>
            </div>
            {result?.suggestions && result.suggestions.length > 0 && (
              <div className="text-left bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850 max-w-md mx-auto space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Issues Detected:</span>
                {result.suggestions.map((sug: string, idx: number) => (
                  <div key={idx} className="text-xs text-rose-300 flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analysis Failed State */}
        {analysisState === "failed" && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <h4 className="text-base font-bold text-zinc-100">Resume Analysis Failed</h4>
            <p className="text-zinc-400 text-xs">{errorMessage || "An unexpected error occurred during PDF parsing."}</p>
          </div>
        )}

        {/* Results Panel */}
        {analysisState === "complete" && result && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Top Score & Status Card */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Circular Gauge */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      className="text-zinc-800"
                      strokeWidth="7"
                      stroke="currentColor"
                      fill="transparent"
                      r="38"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className={`transition-all duration-1000 ${
                        result.atsScore >= 75 ? "text-emerald-400" : result.atsScore >= 50 ? "text-amber-400" : "text-rose-400"
                      }`}
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={2 * Math.PI * 38 * (1 - (result.atsScore || 0) / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="38"
                      cx="48"
                      cy="48"
                    />
                  </svg>
                  <span className="text-2xl font-extrabold text-zinc-100">
                    {result.atsScore || 0}%
                  </span>
                </div>

                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    result.atsScore >= 75
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : result.atsScore >= 50
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}>
                    ATS Match Rating
                  </span>
                  <h3 className="text-xl font-bold text-zinc-100 mt-1">
                    {getStatusText(result.atsScore || 0)}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Target benchmark: <strong className="text-zinc-200">{result.targetRole || targetRole}</strong>
                  </p>
                </div>
              </div>

              {/* Jump to Tailored Voice Interview */}
              <Link to="/voice-interview" className="shrink-0 w-full md:w-auto">
                <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer">
                  <span>Start Interview from Resume</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Explainable ATS Score Breakdown */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/70">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-violet-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    Transparent ATS Score Breakdown
                  </h4>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Total: <strong className="text-zinc-100">{totalCalculated} / 100</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Skills Match</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.skillsMatch?.score || 0} / {breakdown.skillsMatch?.max || 35}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Experience</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.experience?.score || 0} / {breakdown.experience?.max || 20}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Projects</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.projects?.score || 0} / {breakdown.projects?.max || 15}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Education</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.education?.score || 0} / {breakdown.education?.max || 10}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Keywords</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.keywords?.score || 0} / {breakdown.keywords?.max || 10}
                  </span>
                </div>

                <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-850 text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Structure</span>
                  <span className="text-base font-extrabold text-zinc-100 mt-1 block font-mono">
                    {breakdown.structure?.score || 0} / {breakdown.structure?.max || 10}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Extracted Skills & Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detected Skills */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-violet-400" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                    Detected Skills in PDF ({result.skills?.length || 0})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.skills && result.skills.length > 0 ? (
                    result.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-violet-600/10 border border-violet-500/25 text-violet-300 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={12} className="text-violet-400" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">No recognized technical skills found in uploaded PDF.</span>
                  )}
                </div>
              </div>

              {/* Recommended Skills for Target Role */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-amber-400" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                    Target Role Skill Gaps ({result.missingSkills?.length || 0})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.missingSkills && result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-amber-500/10 border border-amber-500/25 text-amber-300 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <AlertTriangle size={12} className="text-amber-400" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium">
                      All core skills for {result.targetRole || targetRole} detected!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks size={18} className="text-amber-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                  Tailored ATS Recommendations
                </h4>
              </div>

              <div className="space-y-2.5">
                {result.suggestions && result.suggestions.length > 0 ? (
                  result.suggestions.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-850 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                    >
                      <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-zinc-500">Resume satisfies all evaluated criteria.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {analysisState === "idle" && (
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} />
            </div>
            <h4 className="text-base font-bold text-zinc-200">No Resume Analyzed Yet</h4>
            <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
              Upload your PDF resume above to calculate an explainable ATS score, inspect skill gaps, and save the report to your profile.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;