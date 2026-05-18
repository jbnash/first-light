export const DIMENSION_ORDER = [
  "context_specificity",
  "task_openness",
  "process_visibility",
  "output_type",
  "verification_surface",
] as const;

export type DimensionKey = (typeof DIMENSION_ORDER)[number];

export const DIMENSION_LABELS: Record<string, string> = {
  context_specificity: "Context Specificity",
  task_openness: "Task Openness",
  process_visibility: "Process Visibility",
  output_type: "Output Type",
  verification_surface: "Verification Surface",
};

export function scoreLabel(score: number): { label: string; color: string } {
  if (score <= 3) return { label: "Low Concern", color: "text-emerald-700" };
  if (score <= 7) return { label: "Worth a Look", color: "text-amber-700" };
  return { label: "High Concern", color: "text-rose-700" };
}

export function difficultyLabel(d: string): string {
  if (d === "easy") return "Easy win";
  if (d === "moderate") return "Some effort";
  return "Significant redesign";
}
