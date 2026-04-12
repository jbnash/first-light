"use client";

const DIMENSIONS = [
  { key: "context_specificity", label: "Context Specificity" },
  { key: "task_openness", label: "Task Openness" },
  { key: "process_visibility", label: "Process Visibility" },
  { key: "output_type", label: "Output Type" },
  { key: "verification_surface", label: "Verification Surface" },
];

function scoreColor(score: number) {
  if (score <= 3) return { bar: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400" };
  if (score <= 7) return { bar: "bg-amber-500 dark:bg-amber-400", text: "text-amber-600 dark:text-amber-400" };
  return { bar: "bg-rose-500 dark:bg-rose-400", text: "text-rose-600 dark:text-rose-400" };
}

interface ScoreBarsProps {
  scores: number[];
  onDimensionClick?: (index: number) => void;
}

export default function ScoreBars({ scores, onDimensionClick }: ScoreBarsProps) {
  return (
    <div className="space-y-2.5">
      {DIMENSIONS.map((dim, i) => {
        const score = scores[i];
        const { bar, text } = scoreColor(score);
        const pct = `${(score / 10) * 100}%`;
        return (
          <button
            key={dim.key}
            onClick={() => onDimensionClick?.(i)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-neutral-500 dark:text-white/45 group-hover:text-neutral-700 dark:group-hover:text-white/70 transition-colors">
                {dim.label}
              </span>
              <span className={`text-xs font-bold tabular-nums ${text}`}>
                {score.toFixed(1)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${bar} transition-all`}
                style={{ width: pct }}
              />
            </div>
          </button>
        );
      })}
      <p className="text-xs text-neutral-400 dark:text-white/25 pt-1">
        Click any row to jump to detail · <span className="text-emerald-600 dark:text-emerald-400 font-medium">Lower is better</span>
      </p>
    </div>
  );
}
