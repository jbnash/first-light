interface OverallBadgeProps {
  score: number;
}

function scoreCategory(score: number): "low" | "medium" | "high" {
  if (score <= 3) return "low";
  if (score <= 7) return "medium";
  return "high";
}

const config = {
  low: {
    label: "Low Concern",
    className: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  },
  medium: {
    label: "Worth a Look",
    className: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-400/10 dark:border-amber-400/20",
  },
  high: {
    label: "High Concern",
    className: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 border-rose-200 dark:bg-rose-400/10 dark:border-rose-400/20",
  },
};

export default function OverallBadge({ score }: OverallBadgeProps) {
  const c = config[scoreCategory(score)];
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-lg border text-2xl font-black ml-1 ${c.bg} ${c.className}`}
    >
      {c.label}
    </span>
  );
}
