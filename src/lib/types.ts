export interface DimensionResult {
  score: number;
  headline: string;
  analysis: string;
  signals: string[];
}

export interface Recommendation {
  dimension: string;
  title: string;
  action: string;
  difficulty: "easy" | "moderate" | "significant";
}

export interface AssignmentProfile {
  genre: string;
  purpose: string;
  inferred_stakes: string;
  sound_for_purpose: string;
}

export interface AnalysisResult {
  assignment_title: string;
  assignment_profile?: AssignmentProfile;
  dimensions: {
    context_specificity: DimensionResult;
    task_openness: DimensionResult;
    process_visibility: DimensionResult;
    output_type: DimensionResult;
    verification_surface: DimensionResult;
  };
  overall_score: number;
  overall_headline: string;
  overall_analysis: string;
  overall_bullets: string[];
  recommendations: Recommendation[];
}
