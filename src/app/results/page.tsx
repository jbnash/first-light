"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/app/api/analyze/route";
import RadarChart from "@/components/RadarChart";
import DimensionCard from "@/components/DimensionCard";
import OverallBadge from "@/components/OverallBadge";
import PunchList from "@/components/PunchList";
import ThemeToggle from "@/components/ThemeToggle";

const DIMENSION_ORDER = [
  "context_specificity",
  "task_openness",
  "process_visibility",
  "output_type",
  "verification_surface",
] as const;

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("firstlight_result");
    if (!stored) { router.push("/"); return; }
    try {
      setResult(JSON.parse(stored));
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-amber-500 dark:border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const scores = DIMENSION_ORDER.map((k) => result.dimensions[k].score);
  const highCount = scores.filter((s) => s >= 8).length;
  const lowCount = scores.filter((s) => s <= 3).length;

  return (
    <main className="relative min-h-screen">
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-white/5">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 group">
          <span className="text-amber-500 dark:text-amber-400 text-lg">◈</span>
          <span className="font-semibold text-sm tracking-wide text-neutral-800 dark:text-white/90 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
            First Light
          </span>
        </button>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => window.open("/print", "_blank")}
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 transition-colors font-medium flex items-center gap-1.5 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-lg"
          >
            Print report →
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 transition-colors font-medium flex items-center gap-1.5"
          >
            ← New analysis
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 animate-fade-in">

        {/* Overall badge + headline */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white leading-tight">
              <OverallBadge score={result.overall_score} />
            </h1>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-black tabular-nums ${
                result.overall_score >= 8 ? "text-rose-600 dark:text-rose-400" :
                result.overall_score >= 4 ? "text-amber-600 dark:text-amber-400" :
                "text-emerald-600 dark:text-emerald-400"
              }`}>
                {result.overall_score.toFixed(1)}
              </span>
              <span className="text-base text-neutral-400 dark:text-white/30">/10</span>
            </div>
          </div>

          <p className="text-lg font-semibold text-neutral-700 dark:text-white/80 mb-2 leading-snug">
            {result.overall_headline}
          </p>
          <p className="text-neutral-500 dark:text-white/50 leading-relaxed text-sm mb-4">
            {result.overall_analysis}
          </p>

          {result.overall_bullets && result.overall_bullets.length > 0 && (
            <ul className="space-y-1.5 mb-4">
              {result.overall_bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-500 dark:text-white/40">
                  <span className="flex-shrink-0 text-neutral-300 dark:text-white/20">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-4">
            {highCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400/80" />
                <span className="text-neutral-500 dark:text-white/40">
                  {highCount} high concern {highCount === 1 ? "dimension" : "dimensions"}
                </span>
              </div>
            )}
            {lowCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400/80" />
                <span className="text-neutral-500 dark:text-white/40">
                  {lowCount} low concern {lowCount === 1 ? "dimension" : "dimensions"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Radar chart — full-width, labeled */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.02] p-4 sm:p-6 mb-10">
          <div className="max-w-md mx-auto">
            <RadarChart overallScore={result.overall_score} scores={scores} />
          </div>
          <p className="text-center text-xs text-neutral-400 dark:text-white/25 mt-1">
            Hover any point to highlight · <span className="font-medium text-emerald-600 dark:text-emerald-400">Lower is better</span>
          </p>
        </div>

        <div className="border-t border-neutral-200 dark:border-white/6 mb-10" />

        <div className="mb-3">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase">
            Dimension Breakdown
          </h2>
        </div>

        <div className="space-y-3">
          {DIMENSION_ORDER.map((key, i) => (
            <DimensionCard
              key={key}
              dimensionKey={key}
              dim={result.dimensions[key]}
              index={i}
            />
          ))}
        </div>

        {/* Punch list */}
        {result.recommendations && result.recommendations.length > 0 && (
          <>
            <div className="border-t border-neutral-200 dark:border-white/6 mt-12" />
            <PunchList
              recommendations={result.recommendations}
              overallScore={result.overall_score}
              overallHeadline={result.overall_headline}
            />
          </>
        )}

        {/* Legend */}
        <div className="mt-12 rounded-2xl border border-neutral-200 dark:border-white/8 bg-neutral-50 dark:bg-white/[0.02] p-6">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-600 dark:text-white/70">
              How to read this
            </h3>
            <span className="text-xs text-neutral-500 dark:text-white/30">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lower scores are better.</span> 1 is hardest to delegate, 10 is easiest.
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-500 dark:text-white/40 leading-relaxed">
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400/70 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-emerald-700 dark:text-emerald-400/80 font-medium">Low concern (1–3):</span> this dimension is doing its job. The design makes it genuinely harder to delegate to an AI.
              </div>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400/70 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-amber-700 dark:text-amber-400/80 font-medium">Worth a look (4–7):</span> some gaps worth thinking about. A motivated student could work around this.
              </div>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400/70 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-rose-700 dark:text-rose-400/80 font-medium">High concern (8–10):</span> a student could hand this to an AI and submit what comes back.
              </div>
            </div>
          </div>
        </div>

        {/* Feedback prompt */}
        <div className="mt-10 text-center">
          <a
            href="https://tally.so/r/kdWB7e"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm text-neutral-500 dark:text-white/40 hover:text-neutral-800 dark:hover:text-white/70 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-white/[0.02] transition-colors"
          >
            <span>Did this feel accurate?</span>
            <span className="text-amber-500 dark:text-amber-400">Share feedback →</span>
          </a>
        </div>

        <p className="text-center text-xs text-neutral-400 dark:text-white/15 mt-6">
          First Light · For educational use · © 2026 John Nash · <a href="/evidence" className="underline underline-offset-2 hover:text-neutral-500 dark:hover:text-white/15 transition-colors">Research basis</a>
        </p>
      </div>
    </main>
  );
}
