"use client";

import { useState, useEffect } from "react";
import type { DimensionResult } from "@/app/api/analyze/route";

interface DimensionCardProps {
  dimensionKey: string;
  dim: DimensionResult;
  index: number;
  forceExpanded?: boolean;
}

function scoreCategory(score: number): "low" | "medium" | "high" {
  if (score <= 3) return "low";
  if (score <= 7) return "medium";
  return "high";
}

const categoryConfig = {
  low: {
    label: "Low concern",
    sublabel: "this dimension is doing its job",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    bar: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-400/15",
    bg: "bg-emerald-50 dark:bg-emerald-400/[0.04]",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-400/20 dark:text-emerald-400",
  },
  medium: {
    label: "Worth a look",
    sublabel: "some gaps worth thinking about",
    dot: "bg-amber-500 dark:bg-amber-400",
    bar: "bg-amber-500 dark:bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-400/15",
    bg: "bg-amber-50/60 dark:bg-amber-400/[0.03]",
    badge: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-400/10 dark:border-amber-400/20 dark:text-amber-400",
  },
  high: {
    label: "High concern",
    sublabel: "a student could likely delegate this entirely to an AI",
    dot: "bg-rose-500 dark:bg-rose-400",
    bar: "bg-rose-500 dark:bg-rose-400",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-400/15",
    bg: "bg-rose-50/60 dark:bg-rose-400/[0.03]",
    badge: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-400/10 dark:border-rose-400/20 dark:text-rose-400",
  },
};

const dimensionMeta: Record<string, { question: string; subhead: string }> = {
  context_specificity: {
    question: "Could AI do this without your course?",
    subhead: "Does completing this assignment require things only a student in your class would know?",
  },
  task_openness: {
    question: "Does this have one obvious answer?",
    subhead: "Or does it demand something genuinely original that couldn't be templated?",
  },
  process_visibility: {
    question: "Can you see how they got there?",
    subhead: "Caution: real fieldwork doesn't answer this. The risk is in the gap between what they experienced and what they submitted. That's where cognitive offloading happens.",
  },
  output_type: {
    question: "Easy to fake?",
    subhead: "How readily could a student hand this to an AI and submit what comes back?",
  },
  verification_surface: {
    question: "Any other ways to know it's really their work?",
    subhead: "Can you cross-check this submission against anything else you know about this student?",
  },
};

export default function DimensionCard({ dimensionKey, dim, index, forceExpanded }: DimensionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const category = scoreCategory(dim.score);
  const cfg = categoryConfig[category];
  const meta = dimensionMeta[dimensionKey];

  useEffect(() => {
    if (forceExpanded) setExpanded(true);
  }, [forceExpanded]);

  return (
    <div
      id={`dim-${dimensionKey}`}
      className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-all duration-200 animate-slide-up`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />

        <span className="flex-1 min-w-0">
          {meta ? (
            <span className="flex flex-col">
              <span className="text-sm font-bold text-neutral-800 dark:text-white/85 leading-snug">
                {meta.question}{" "}
                <span className="font-normal text-neutral-400 dark:text-white/30 text-xs">
                  ({dimensionKey.replace(/_/g, " ")})
                </span>
              </span>
              {!expanded && (
                <span className="text-xs text-neutral-500 dark:text-white/30 leading-snug mt-0.5 hidden sm:block">
                  {meta.subhead}
                </span>
              )}
            </span>
          ) : (
            <span className="text-sm font-semibold text-neutral-800 dark:text-white/80">{dimensionKey}</span>
          )}
        </span>

        <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
          <span className="font-mono tabular-nums">{dim.score}</span>
          <span className="opacity-50">/10</span>
        </span>

        <span className="flex-shrink-0 text-neutral-400 dark:text-white/20 transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-neutral-200 dark:border-white/5">
          {meta && (
            <p className="text-xs text-neutral-500 dark:text-white/35 mt-3 mb-4 leading-relaxed">{meta.subhead}</p>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
              <span className="text-xs text-neutral-400 dark:text-white/25 italic">{cfg.sublabel}</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                style={{ width: `${dim.score * 10}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-400 dark:text-white/15 font-mono">1</span>
              <span className={`text-xs font-mono font-bold ${cfg.text}`}>{dim.score}</span>
              <span className="text-xs text-neutral-400 dark:text-white/15 font-mono">10</span>
            </div>
          </div>

          <p className={`text-base font-bold mb-2 ${cfg.text}`}>{dim.headline}</p>
          <p className="text-sm text-neutral-600 dark:text-white/55 leading-relaxed mb-4">{dim.analysis}</p>

          {dim.signals && dim.signals.length > 0 && (
            <div>
              <span className="text-xs text-neutral-400 dark:text-white/25 font-mono uppercase tracking-wider">Signals</span>
              <ul className="mt-2 space-y-1.5">
                {dim.signals.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-neutral-500 dark:text-white/45 leading-relaxed">
                    <span className="flex-shrink-0 mt-0.5 text-neutral-400 dark:text-white/20">—</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
