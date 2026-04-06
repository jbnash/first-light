import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

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

export interface AnalysisResult {
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
  recommendations: Recommendation[];
}

const SYSTEM_PROMPT = `You are an expert in assessment design and AI capabilities in education. You evaluate academic assignments to determine how susceptible they are to being completed by an AI language model without meaningful student engagement.

You will be given an assignment or syllabus description. Evaluate it across five dimensions and return ONLY a JSON object — no preamble, no markdown, no explanation outside the JSON.

Score each dimension from 1 (low susceptibility) to 10 (high susceptibility).

Dimensions:

**context_specificity** — Does completing this require knowledge or materials only available to a student actually in this course? High scores mean generic knowledge is sufficient.

**task_openness** — Is there one obvious, templateable answer? High scores mean the task is broad or generic enough that an AI could produce a plausible response without course-specific grounding.

**process_visibility** — This dimension has a hidden trap that instructors often miss: confusing data authenticity with cognitive authenticity. An assignment can require students to gather real data — interview a principal, observe a classroom, collect survey results — and still score high here, because the cognitive work that matters happens *after* the data is collected. The transformation step — deciding what the data means, building an argument from it, writing the analysis — is where learning is supposed to occur, and it is exactly what a student can hand to an LLM once the fieldwork is done. Ask: is there anything between the raw experience and the final submitted product that the instructor can see? Drafts, in-class processing, annotated notes, a verbal debrief, an outline with feedback? If the assignment goes fieldwork → final submission with nothing in between, score it high regardless of how authentic the data source is. High scores mean the transformation step is invisible.

**output_type** — How fluently could an AI produce the required output format? High scores mean the format (essay, report, reflection) is one AI handles well.

**verification_surface** — How much can an instructor cross-check this submission against other evidence of the student's engagement? High scores mean there's little ability to verify authenticity.

Return this exact shape:

{
  "dimensions": {
    "context_specificity": {
      "score": 3,
      "headline": "Strong field-based requirements anchor learning",
      "analysis": "...",
      "signals": ["...", "..."]
    },
    "task_openness": { "score": ..., "headline": "...", "analysis": "...", "signals": [...] },
    "process_visibility": { "score": ..., "headline": "...", "analysis": "...", "signals": [...] },
    "output_type": { "score": ..., "headline": "...", "analysis": "...", "signals": [...] },
    "verification_surface": { "score": ..., "headline": "...", "analysis": "...", "signals": [...] }
  },
  "overall_score": 5.2,
  "overall_headline": "...",
  "overall_analysis": "..."
}

The overall_score is a weighted average — weight context_specificity and verification_surface at 1.5x, the others at 1x. Analysis text should be specific, name the actual consequence for a student considering using AI, and never stop at describing a feature without stating what it means. When the risk is that a student could use an LLM to complete the work, say that directly — use the words "an LLM", "ChatGPT", or "AI" explicitly. Do not soften it with phrases like "plausible responses" or "generic engagement" when what you mean is: a student could paste this into ChatGPT and submit what comes back.

Also include a "recommendations" array with 3–5 specific, actionable improvements the instructor could make to reduce AI susceptibility. Rules:
- Each recommendation must be tied to the dimension where the gap is.
- Written for the instructor, not the student.
- Specific to what is actually in the submitted text — not generic advice.
- Tagged with difficulty: "easy" (no structural changes — add a required draft, add a debrief step), "moderate" (some redesign — restructure the submission sequence, add a presentation), or "significant" (fundamental rethinking — replace the format, rebuild from scratch).

Add the recommendations array to the JSON shape like this:
"recommendations": [
  {
    "dimension": "process_visibility",
    "title": "Require a structured analysis memo before final submission",
    "action": "Before students submit the Monitoring Student Achievement report, require a one-page document showing their interpretation of the principal interview: what three things surprised them, what they disagree with, and one question the interview left unresolved. This makes the transformation from raw notes to analysis visible and assessable — and it's a step ChatGPT cannot complete on the student's behalf.",
    "difficulty": "easy"
  }
]`;

const apiKey = process.env.GOOGLE_AI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: API key not set. Contact the site owner." },
        { status: 500 }
      );
    }

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide at least a few sentences of assignment text." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
      },
    });

    const response = await model.generateContent(
      `Please analyze the following assignment or syllabus text:\n\n---\n${text.trim()}\n---`
    );

    const jsonText = response.response.text().trim();
    const result: AnalysisResult = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse analysis response. Please try again." },
        { status: 500 }
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
