"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/app/api/analyze/route";
import ThemeToggle from "@/components/ThemeToggle";

const DIMENSIONS_INFO = [
  {
    name: "Context Specificity",
    question: "Could AI do this without your course?",
    detail:
      "Does completing the assignment require materials, discussions, or knowledge only available inside your specific course? Or would generic knowledge be enough?",
  },
  {
    name: "Task Openness",
    question: "Is there one obvious, templateable answer?",
    detail:
      "The more open-ended a prompt, the easier it is to generate a plausible response without any course-specific grounding. Assignments that demand something only this student, in this course, at this moment could produce are genuinely harder to fake.",
  },
  {
    name: "Process Visibility",
    question: "Can you see how the student got there?",
    detail:
      "This is the most commonly missed dimension. Real fieldwork (interviews, observations, surveys) doesn't answer it. The risk is what happens after the data is collected. If there's no visible step between the experience and the final submission, a student can hand the synthesis step entirely to an AI.",
  },
  {
    name: "Output Type",
    question: "How fluently could AI produce this format?",
    detail:
      "Essays, reports, and reflections are formats AI handles extremely well. Formats that require live performance, visual artifact creation, or structured in-person interaction are harder to fake.",
  },
  {
    name: "Verification Surface",
    question: "Any other way to know it's really their work?",
    detail:
      "How much can an instructor cross-check this submission against other evidence: class participation, prior drafts, in-person conversation, known writing patterns? A submission that arrives in a vacuum with no other touchpoints is easy to fabricate.",
  },
];

const PLACEHOLDER = `Example: Paste your assignment prompt, rubric, or syllabus section here.

e.g. "Write a 1000-word argumentative essay on a topic of your choice related to the themes we have discussed in class. Your essay should include a clear thesis, supporting evidence, and a conclusion. Submit via Canvas by Friday at midnight."`;

const EXAMPLE_SHORT = `Write a 5-page research paper arguing a position on a social issue of your choice. Your paper should include at least 5 scholarly sources cited in APA format. A clear thesis, organized body paragraphs, and a conclusion are required. Submit to Turnitin by the last day of class.`;

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDimensions, setShowDimensions] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const isReady = charCount >= 40;

  async function handleAnalyze() {
    if (!isReady || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      sessionStorage.setItem("firstlight_result", JSON.stringify(data as AnalysisResult));
      sessionStorage.setItem("firstlight_input", text);
      router.push("/results");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setText(EXAMPLE_SHORT);
    textareaRef.current?.focus();
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 dark:text-amber-400 text-lg">◈</span>
          <span className="font-semibold text-sm tracking-wide text-neutral-800 dark:text-white/90">First Light</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="text-xs text-neutral-400 dark:text-white/30 font-mono">BETA</div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400 text-xs font-medium tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse-slow"></span>
          Assessment Design Analysis
        </div>

        <h1 className="text-5xl font-black tracking-tight text-neutral-900 dark:text-white max-w-2xl leading-[1.05] text-balance mb-4">
          How{" "}
          <span className="text-amber-500 dark:text-amber-400">AI-proof</span>{" "}
          are your assignments?
        </h1>

        <p className="text-lg text-neutral-500 dark:text-white/50 max-w-lg leading-relaxed text-balance">
          Paste any assignment prompt or syllabus section. We'll analyze it across five dimensions and give you a specific list of fixes.
        </p>

        <button
          onClick={() => setShowDimensions((v) => !v)}
          className="mt-4 text-xs text-amber-600 dark:text-amber-400/70 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium flex items-center gap-1"
        >
          <span>{showDimensions ? "▲" : "▼"}</span>
          <span>{showDimensions ? "Hide dimension guide" : "What are the five dimensions?"}</span>
        </button>

        {showDimensions && (
          <div className="mt-4 w-full max-w-2xl px-6 text-left">
            <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.03] divide-y divide-neutral-100 dark:divide-white/5 shadow-sm">
              {DIMENSIONS_INFO.map((d, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-neutral-700 dark:text-white/80">{d.name}</span>
                    <span className="text-xs text-neutral-400 dark:text-white/30 italic">{d.question}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-white/40 leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main input card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.03] overflow-hidden shadow-sm dark:shadow-2xl">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-white/6">
            <span className="text-xs font-medium text-neutral-500 dark:text-white/40 tracking-widest uppercase">
              Assignment Text
            </span>
            <button
              onClick={loadExample}
              className="text-xs text-amber-600 dark:text-amber-400/70 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Load example →
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={12}
              className="w-full bg-transparent px-5 py-4 text-sm text-neutral-700 dark:text-white/80 placeholder:text-neutral-400 dark:placeholder:text-white/20 resize-none outline-none leading-relaxed font-mono"
              disabled={loading}
            />
            <div className="absolute bottom-3 right-4 text-xs text-neutral-400 dark:text-white/20 font-mono tabular-nums">
              {charCount > 0 ? `${charCount.toLocaleString()} chars` : ""}
            </div>
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 dark:border-white/6 bg-neutral-50 dark:bg-white/[0.02]">
            <div className="text-xs text-neutral-500 dark:text-white/30">
              {!isReady && charCount > 0 && (
                <span>Need a bit more text</span>
              )}
              {isReady && (
                <span className="text-emerald-600 dark:text-emerald-400/70">Ready to analyze</span>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!isReady || loading}
              className={`
                relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${loading
                  ? "bg-amber-500/75 dark:bg-amber-400/60 text-white dark:text-black cursor-wait"
                  : isReady
                    ? "bg-amber-500 dark:bg-amber-400 text-white dark:text-black hover:bg-amber-400 dark:hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20"
                    : "bg-neutral-200 dark:bg-white/8 text-neutral-400 dark:text-white/25 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  Analyze
                  <span className="opacity-60">→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-center text-xs text-neutral-500 dark:text-white/30 leading-relaxed">
            Scores run 1–10.{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lower is better.</span>
            {" "}A low score means the assignment is harder to hand off to an AI.
          </p>
          <p className="text-center text-xs text-neutral-400 dark:text-white/20 leading-relaxed">
            Nothing you paste is stored · For educational use · © 2026 John Nash
          </p>
        </div>
      </div>
    </main>
  );
}
