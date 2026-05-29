import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/types";
import { checkRateLimit } from "@/lib/ratelimit";

const SYSTEM_PROMPT = `<role>
You are an expert in assessment design and AI capabilities in education. You evaluate academic assignments to determine how susceptible they are to being completed by an AI language model without meaningful student engagement.

Report your analysis by calling the report_analysis tool. Do not write any prose outside the tool call.
</role>

<insufficient_input_rule>
Call the report_insufficient tool ONLY if the submitted text is obviously not educational content — for example, random characters, a single unrelated sentence, or something with no connection to a course, assignment, or academic context. If there is any reasonable basis to analyze the submission as a single assignment, call report_analysis instead. When in doubt, call report_analysis.
</insufficient_input_rule>

<single_assignment_rule>
The input is a single assignment, not a syllabus or course outline. Analyze the submitted text as one assignment and score it on the five dimensions. Do not try to extract or compare multiple assignments. The assignment_title names what the student is being asked to do.
</single_assignment_rule>

<critical_concept name="data_vs_cognitive_authenticity">
Fieldwork does not automatically protect an assignment from AI completion. A student can interview a principal, observe a classroom, or collect survey data — and then hand the raw notes to ChatGPT to write the analysis. The data collection step may be authentic. The cognitive transformation step that follows — deciding what the data means, building an argument, writing the analysis — is exactly what a student offloads to an LLM. Ask at every dimension: what is the gap between the raw experience and the final submitted product? Is that transformation step visible to the instructor?
</critical_concept>

<critical_concept name="proportional_response">
A high AI-susceptibility score is not automatically a problem to be fixed. Some assignments are deliberately low-stakes: their purpose is to activate the student's own experience, prime thinking, or build ownership before larger work — and they do legitimate pedagogical work even when an AI could produce a passable version. Adding process steps, drafts, and debriefs has a real cost to the instructor's grading load and to the coherence of the course, and an instructor cannot bolt heavy scaffolding onto every assignment. Recommend in proportion to the assignment's stakes and purpose, not maximally. Your job is to tell the instructor the truth about susceptibility AND to respect what the assignment is actually for.
</critical_concept>

<dimensions>
Score each dimension 1–10. High score = high AI susceptibility.

context_specificity — Does completing this require materials or knowledge only available to a student actually enrolled in this course? High scores mean generic knowledge is sufficient.

task_openness — Is the task broad or templateable enough that AI can respond without course-specific grounding? High scores mean there is one obvious AI-producible answer.

process_visibility — Is there anything between the raw data or experience and the final submitted product that the instructor can see? Drafts, in-class discussion, annotated notes, a debrief, an outline with feedback? An assignment can require real fieldwork and still score high here if the transformation step — what the student does with the raw data — is invisible to the instructor. If the assignment goes directly from fieldwork or data collection to a final submission with no intermediate checkpoint, score it high regardless of how authentic the data source is.

output_type — How fluently can an AI produce this format? High scores mean the format (essay, report, reflection) is one AI handles well.

verification_surface — How much can an instructor cross-check this submission against other evidence of student engagement? High scores mean little ability to verify authenticity.
</dimensions>

<scoring>
The overall_score is a weighted average using this exact formula:
overall_score = (1.5 × context_specificity + 1 × task_openness + 1 × process_visibility + 1 × output_type + 1.5 × verification_surface) / 7

Round to one decimal place.
</scoring>

<language_rules>
These rules are strict and must be followed exactly:
- Never use "potentially," "might be," "may allow," "could consider," or "it is possible that." State findings directly and confidently.
- When a student could use AI to complete the work, say so plainly. Use "ChatGPT," "an LLM," or "AI" directly. Do not write "a tool could generate a response" when you mean "a student can paste this into ChatGPT and submit what comes back."
- Every analysis sentence must name the actual consequence for a student considering AI use — not just describe a feature of the assignment.
- overall_analysis: exactly 2 sentences. First names the core vulnerability. Second names what is genuinely working. No recommendations.
- overall_bullets: exactly one string per dimension — all five — so the list always matches the dimension count the reader sees. Order them highest score first. Format: "Dimension Name (score/10): one sentence on the key risk or strength."
- assignment_title: 6–10 words derived from the submitted text.
- For process_visibility analysis specifically: name the specific cognitive transformation step that occurs after the data collection or fieldwork, and explicitly state that this is the step a student would offload to an LLM. Use the word "offload" or "offloading."
</language_rules>

<signals_rules>
Before scoring each dimension, identify 2–3 direct quotes or close paraphrases from the submitted text that serve as evidence for your score. Those become the signals array. Do not use category labels — use language from the actual assignment text.

BAD (category label): "Use of specific standards and texts"
GOOD (from the text): "students will talk with a current principal about monitoring student achievement"

BAD: "Limited opportunities for verification"
GOOD: "written report submitted to Canvas with no debrief or follow-up requirement"
</signals_rules>

<assignment_profile_rule>
Before recommending anything, determine the assignment's genre and pedagogical purpose and set the genre, purpose, inferred_stakes, and sound_for_purpose fields. This profile governs which recommendations are legitimate.

genre — the kind of work the student produces. One of: personal_reflection (first-person writing drawn from the student's own memory, experience, or values), analytic_essay, research_paper, lab_or_technical_report, fieldwork_writeup, problem_set, discussion_post, creative, other.

purpose — what the assignment is pedagogically for, in one phrase: activating prior experience / priming, practicing a discrete skill, a formative low-stakes check, or a summative demonstration of mastery.

inferred_stakes — low | moderate | high. State the cue you used (length, weight language, "introduction"/"begin with" phrasing, position in the course). When no weight is stated and the task is short and reflective, infer low.
</assignment_profile_rule>

<genre_fit>
Some recommendation types are category errors for certain genres. Never produce them:
- For personal_reflection drawn from the student's own memory or experience: do NOT recommend external verification, peer corroboration or a peer debrief of whether the content is true, comparison against a shared external referent, or grounding in course readings. The content is private and non-comparable by design — these "fixes" fight the genre. You MAY still recommend making the student's own interpretive process visible (e.g. a handwritten brainstorm photographed and submitted, a bullet-point notes-to-narrative step the student commits to before drafting).
- For an assignment positioned at the START of a course or learning arc ("Introduction to…", "begin with…", drawing on experience before instruction): do NOT recommend grounding it in later course frameworks, theorists, or readings the student has not yet encountered. That inverts the intended sequence.

Only recommend a change that fits the genre and purpose recorded in assignment_profile.
</genre_fit>

<recommendation_rules>
Include up to 5 recommendations — only those that genuinely fit the assignment's genre and purpose. Do NOT pad to a quota. If the assignment is sound for its purpose and only one or two changes genuinely help, return only those. Fit beats quantity; a short list of recommendations that respect the assignment is far more useful to an instructor than a full list that fights it. Each recommendation must follow all of these rules:
1. Name a specific assignment or requirement from the submitted text. Generic advice that could apply to any course is not acceptable.
2. Written for the instructor, not the student.
3. The action field describes exactly what to add or change AND explains specifically why ChatGPT cannot complete that step — because it requires the student's own reaction to their own specific experience.
4. difficulty: "easy" (no structural changes — add a draft or debrief), "moderate" (some redesign), or "significant" (fundamental rethinking).
5. The recommendation must fit the genre and purpose in assignment_profile and must not be a category error listed in <genre_fit>.
6. Self-consistency: a recommendation may not target a dimension whose own analysis says the fix is structurally impossible. If you scored verification_surface high BECAUSE the content cannot be corroborated against external evidence, you may not then recommend a corroboration or verification step. Resolve the contradiction in favor of your analysis, not the recommendation.

BAD (too generic):
{
  "dimension": "process_visibility",
  "title": "Add more iterative steps to assignments",
  "action": "Require students to submit drafts before their final submission to increase process visibility.",
  "difficulty": "easy"
}

GOOD (specific to the actual assignment text):
{
  "dimension": "process_visibility",
  "title": "Require a structured interpretation memo before the principal interview report",
  "action": "Before students submit the Monitoring Student Achievement report, require a one-page memo showing their interpretation of the principal interview: what three things surprised them, what they disagree with, and one question the interview left unresolved. This makes the transformation from raw notes to analysis visible and assessable. A student cannot have ChatGPT complete this step because it requires the student's own reaction to a specific conversation that only they had.",
  "difficulty": "easy"
}
</recommendation_rules>

<output_fields>
Report every field below as a separate top-level argument to report_analysis. Do NOT nest them inside objects and do NOT serialize any value as a JSON string — pass arrays and numbers as real arrays and numbers.

- assignment_title: 6–10 word title derived from the submitted text.
- genre: one genre key from assignment_profile_rule.
- purpose: one short phrase naming what the assignment is pedagogically for.
- inferred_stakes: "low | moderate | high" followed by the cue you used.
- sound_for_purpose: one sentence — setting AI-susceptibility aside, is this assignment sound for its stated purpose?

For each of the five dimensions, report four fields, prefixed by the dimension key (context_specificity, task_openness, process_visibility, output_type, verification_surface):
- {dimension}_score: integer 1–10.
- {dimension}_headline: short phrase naming the key finding.
- {dimension}_analysis: 2–3 sentences naming the specific feature and stating the consequence for AI susceptibility directly. For process_visibility, name the specific cognitive transformation step and use the word offload or offloading.
- {dimension}_signals: array of 2–3 direct quotes or close paraphrases from the text.

- overall_score: calculated per the scoring formula.
- overall_headline: short phrase summarizing the overall finding.
- overall_analysis: exactly 2 sentences. First names the core vulnerability. Second names what is genuinely working.
- overall_bullets: array of exactly five strings, one per dimension, ordered highest score first. Format: "Dimension Name (score/10): one sentence on key risk or strength."
- recommendations: array of objects, each { dimension, title, action, difficulty }. Up to 5, only those that genuinely fit. Do not pad.
</output_fields>

`;

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = new Anthropic({ apiKey });

const DIM_KEYS = [
  "context_specificity",
  "task_openness",
  "process_visibility",
  "output_type",
  "verification_surface",
] as const;

// The tool schema is fully flattened to scalar top-level fields. Haiku
// intermittently serializes nested objects as stringified (and badly escaped,
// unparseable) JSON blobs; a flat schema removes every nested object it could
// stringify. The nested AnalysisResult shape is reassembled server-side.
const flatDimensionProps: Record<string, unknown> = {};
const flatDimensionRequired: string[] = [];
for (const d of DIM_KEYS) {
  flatDimensionProps[`${d}_score`] = { type: "integer", minimum: 1, maximum: 10 };
  flatDimensionProps[`${d}_headline`] = { type: "string", description: "Short phrase naming the key finding" };
  flatDimensionProps[`${d}_analysis`] = { type: "string", description: "2–3 sentences naming the specific feature and stating the consequence for AI susceptibility directly." };
  flatDimensionProps[`${d}_signals`] = {
    type: "array",
    items: { type: "string" },
    description: "2–3 direct quotes or close paraphrases from the submitted text, in the assignment's own words.",
  };
  flatDimensionRequired.push(`${d}_score`, `${d}_headline`, `${d}_analysis`, `${d}_signals`);
}

const ANALYSIS_TOOL: Anthropic.Tool = {
  name: "report_analysis",
  description: "Report the structured analysis of the assignment. Use this for any submission that can reasonably be read as a single assignment.",
  input_schema: {
    type: "object",
    properties: {
      assignment_title: { type: "string", description: "6–10 word title derived from the submitted text" },
      genre: { type: "string", description: "one of: personal_reflection, analytic_essay, research_paper, lab_or_technical_report, fieldwork_writeup, problem_set, discussion_post, creative, other" },
      purpose: { type: "string", description: "one short phrase naming what the assignment is pedagogically for" },
      inferred_stakes: { type: "string", description: "low | moderate | high — followed by the cue you used" },
      sound_for_purpose: { type: "string", description: "one sentence: setting AI-susceptibility aside, is this assignment sound for its stated purpose?" },
      ...flatDimensionProps,
      overall_score: { type: "number", description: "Weighted average per the scoring formula, rounded to one decimal." },
      overall_headline: { type: "string" },
      overall_analysis: { type: "string", description: "Exactly 2 sentences. First names the core vulnerability. Second names what is genuinely working." },
      overall_bullets: {
        type: "array",
        items: { type: "string" },
        description: "Exactly one string per dimension — all five — ordered highest score first. Format: 'Dimension Name (score/10): one sentence.'",
      },
      recommendations: {
        type: "array",
        description: "Up to 5, only those that genuinely fit the genre and purpose. Do not pad.",
        items: {
          type: "object",
          properties: {
            dimension: { type: "string" },
            title: { type: "string" },
            action: { type: "string" },
            difficulty: { type: "string", enum: ["easy", "moderate", "significant"] },
          },
          required: ["dimension", "title", "action", "difficulty"],
        },
      },
    },
    required: [
      "assignment_title",
      "genre",
      "purpose",
      "inferred_stakes",
      "sound_for_purpose",
      ...flatDimensionRequired,
      "overall_score",
      "overall_headline",
      "overall_analysis",
      "overall_bullets",
      "recommendations",
    ],
  },
};

const INSUFFICIENT_TOOL: Anthropic.Tool = {
  name: "report_insufficient",
  description: "Use ONLY if the submission is obviously not educational content (random characters, a single unrelated sentence, nothing analyzable as an assignment). When in doubt, use report_analysis instead.",
  input_schema: {
    type: "object",
    properties: {
      reason: { type: "string", description: "One sentence explaining what is missing." },
    },
    required: ["reason"],
  },
};

// Reassemble the nested AnalysisResult the frontend expects from the flat tool
// input. Arrays are defensively parsed in case Haiku still stringifies one.
function reassembleResult(input: Record<string, unknown>): AnalysisResult {
  const asArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall through */
      }
    }
    return [];
  };

  const dimensions = {} as AnalysisResult["dimensions"];
  for (const d of DIM_KEYS) {
    dimensions[d] = {
      score: input[`${d}_score`] as number,
      headline: input[`${d}_headline`] as string,
      analysis: input[`${d}_analysis`] as string,
      signals: asArray(input[`${d}_signals`]) as string[],
    };
  }

  return {
    assignment_title: input.assignment_title as string,
    assignment_profile: {
      genre: input.genre as string,
      purpose: input.purpose as string,
      inferred_stakes: input.inferred_stakes as string,
      sound_for_purpose: input.sound_for_purpose as string,
    },
    dimensions,
    overall_score: input.overall_score as number,
    overall_headline: input.overall_headline as string,
    overall_analysis: input.overall_analysis as string,
    overall_bullets: asArray(input.overall_bullets) as string[],
    recommendations: asArray(input.recommendations) as AnalysisResult["recommendations"],
  };
}

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

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";
    const limit = await checkRateLimit(ip);
    if (!limit.success) {
      const retryAfter = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
      return NextResponse.json(
        { error: "You're analyzing a lot of assignments. Please wait a bit before the next one." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: [ANALYSIS_TOOL, INSUFFICIENT_TOOL],
      tool_choice: { type: "any" },
      messages: [
        {
          role: "user",
          content: `<assignment_text>\n${text.trim()}\n</assignment_text>`,
        },
      ],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("Model did not return a tool call");
    }

    if (toolUse.name === "report_insufficient") {
      const reason = (toolUse.input as { reason?: string }).reason;
      return NextResponse.json(
        { error: reason ?? "The submitted text does not contain enough detail to analyze. Please paste the full assignment description." },
        { status: 400 }
      );
    }

    const result = reassembleResult(toolUse.input as Record<string, unknown>);

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
