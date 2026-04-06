"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/app/api/analyze/route";

const DIMENSION_ORDER = [
  "context_specificity",
  "task_openness",
  "process_visibility",
  "output_type",
  "verification_surface",
] as const;

const DIMENSION_LABELS: Record<string, string> = {
  context_specificity: "Context Specificity",
  task_openness: "Task Openness",
  process_visibility: "Process Visibility",
  output_type: "Output Type",
  verification_surface: "Verification Surface",
};

function scoreLabel(score: number) {
  if (score <= 3) return { label: "Low Concern", color: "text-emerald-700" };
  if (score <= 7) return { label: "Worth a Look", color: "text-amber-700" };
  return { label: "High Concern", color: "text-rose-700" };
}

function difficultyLabel(d: string) {
  if (d === "easy") return "Easy win";
  if (d === "moderate") return "Some effort";
  return "Significant redesign";
}

function getInputPreview(input: string): string {
  const lines = input.split("\n").filter((l) => l.trim().length > 0);
  const preview = lines.slice(0, 3).join(" ");
  const suffix = lines.length > 3 ? "..." : "";
  return preview.length > 300
    ? preview.slice(0, 300) + "..."
    : preview + suffix;
}

export default function PrintPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("firstlight_result");
    const storedInput = sessionStorage.getItem("firstlight_input") ?? "";
    if (!stored) { router.push("/"); return; }
    try {
      setResult(JSON.parse(stored));
      setInput(storedInput);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!result) return null;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const overallCat = scoreLabel(result.overall_score);

  return (
    <div className="bg-white text-neutral-900 min-h-screen">

      {/* Nav bar — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-lg">◈</span>
          <span className="font-semibold text-sm text-neutral-800">First Light</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/results")}
            className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← Back to results
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-400 transition-colors shadow-sm"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Report */}
      <div className="max-w-3xl mx-auto px-8 pt-28 pb-16 print:pt-8">

        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            First Light · Assessment Report
          </p>
          <h1 className="text-3xl font-black text-neutral-900 mb-1">
            {result.assignment_title ?? "Assignment Analysis"}
          </h1>
          <p className="text-sm text-neutral-400">{today}</p>
        </div>

        {/* Assignment preview */}
        {input && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              Assignment Text
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed italic border-l-4 border-neutral-200 pl-4">
              &ldquo;{getInputPreview(input)}&rdquo;
            </p>
          </div>
        )}

        {/* Overall */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Overall Assessment
          </h2>
          <div className="flex items-baseline gap-3 mb-2">
            <span className={`text-5xl font-black tabular-nums ${overallCat.color}`}>
              {result.overall_score.toFixed(1)}
            </span>
            <span className="text-lg text-neutral-400">/10</span>
            <span className={`text-sm font-bold ml-2 ${overallCat.color}`}>
              {overallCat.label}
            </span>
          </div>
          <p className="font-bold text-neutral-800 mb-2">{result.overall_headline}</p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-3">
            {result.overall_analysis}
          </p>
          {result.overall_bullets && result.overall_bullets.length > 0 && (
            <ul className="space-y-1.5">
              {result.overall_bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-600">
                  <span className="text-neutral-400 flex-shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Score table */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Dimension Scores
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-900">
                <th className="text-left py-2 font-semibold text-neutral-700">Dimension</th>
                <th className="text-center py-2 font-semibold text-neutral-700 w-20">Score</th>
                <th className="text-left py-2 font-semibold text-neutral-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {DIMENSION_ORDER.map((k) => {
                const dim = result.dimensions[k];
                const cat = scoreLabel(dim.score);
                return (
                  <tr key={k} className="border-b border-neutral-200">
                    <td className="py-2 text-neutral-700">{DIMENSION_LABELS[k]}</td>
                    <td className="py-2 text-center font-mono font-bold text-neutral-900">
                      {dim.score}/10
                    </td>
                    <td className={`py-2 font-semibold ${cat.color}`}>{cat.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dimension detail */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Dimension Analysis
          </h2>
          <div className="space-y-7">
            {DIMENSION_ORDER.map((k) => {
              const dim = result.dimensions[k];
              const cat = scoreLabel(dim.score);
              return (
                <div key={k}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-neutral-900">{DIMENSION_LABELS[k]}</span>
                    <span className={`font-bold font-mono text-sm ${cat.color}`}>
                      {dim.score}/10
                    </span>
                    <span className={`text-xs font-semibold ${cat.color}`}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-700 mb-1">{dim.headline}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-2">{dim.analysis}</p>
                  {dim.signals && dim.signals.length > 0 && (
                    <ul className="space-y-1 pl-2">
                      {dim.signals.map((s, i) => (
                        <li key={i} className="text-xs text-neutral-500 flex gap-2">
                          <span className="flex-shrink-0 text-neutral-300">—</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Recommendations
            </h2>
            <div className="space-y-6">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="border-l-4 border-neutral-200 pl-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {DIMENSION_LABELS[rec.dimension] ?? rec.dimension}
                    </span>
                    <span className={`text-xs font-semibold ${
                      rec.difficulty === "easy" ? "text-emerald-700" :
                      rec.difficulty === "moderate" ? "text-amber-700" :
                      "text-rose-700"
                    }`}>
                      · {difficultyLabel(rec.difficulty)}
                    </span>
                  </div>
                  <p className="font-bold text-neutral-900 mb-1">{rec.title}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 text-center">
            First Light · Assessment Analysis Tool · For educational use · © 2026 John Nash
          </p>
        </div>
      </div>
    </div>
  );
}
