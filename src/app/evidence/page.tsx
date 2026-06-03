"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const DIMENSIONS = [
  {
    number: 1,
    name: "Context Specificity",
    question: "Does the assignment require knowledge only a specific student in a specific course could plausibly have?",
    rows: [
      {
        source: "Paustian & Slinger (2024)",
        finding:
          "On a specialized, course-specific prompt, generic LLM output scored well below genuine student work (~55% vs ~80%), direct evidence that course-bound grounding measurably degrades AI completion quality.",
      },
      {
        source: "Bernabei et al. (2023)",
        finding:
          "LLMs produced fluent generic description but failed on distinctions taught in specific lectures; assignments bound to course-provided material resist generic AI completion.",
      },
    ],
  },
  {
    number: 2,
    name: "Task Openness",
    question: "Is the prompt broad and genre-predictable, or constrained and novel?",
    rows: [
      {
        source: "Ding (2025)",
        finding:
          "Fully open-ended projects let an LLM gravitate to the familiar, easily generated instances it handles best; constrained, interconnected, multi-step tasks are markedly more AI-resilient.",
      },
      {
        source: "Akbar (2025)",
        finding:
          "Across 50 real assignments, broadly framed conceptual and definitional tasks were highly AI-solvable (>70%), while context-rich, higher-order problems scored lowest.",
      },
      {
        source: "Bernabei et al. (2023)",
        finding:
          "Assignments framed as standard academic genres (compare/contrast, summary, discussion post) were consistently easier for LLMs than constrained or novel tasks.",
      },
    ],
  },
  {
    number: 3,
    name: "Process Visibility",
    question:
      "Are there mechanisms that make the student's learning process visible, such as drafts, reflections, oral defenses, or iteration?",
    rows: [
      {
        source: "Saltan (2025)",
        finding:
          "In a large software-engineering course, short video assignments in which students explain their own work curbed AI-assisted misconduct and increased engagement.",
      },
      {
        source: "Birks & Clare (2023)",
        finding:
          "Viva-style oral defenses of unsupervised work raise both the effort and the perceived risk of AI-facilitated misuse, functioning as a direct deterrent.",
      },
      {
        source: "Ncube et al. (2025)",
        finding:
          "A systematic review concludes that process-based, multi-stage, and oral assessments are central to maintaining integrity in AI-infused learning environments.",
      },
    ],
  },
  {
    number: 4,
    name: "Output Type",
    question:
      "What deliverable does the assignment require? Some output types are high-frequency in LLM training data; others introduce constraints LLMs struggle with.",
    rows: [
      {
        source: "Pudasaini et al. (2024)",
        finding:
          "Text-based deliverables (essays, reports, homework) are the output types most consistently associated with AI-generated plagiarism.",
      },
      {
        source: "Shepherd (2025)",
        finding:
          "Unsupervised text deliverables (essays, reports, projects) align directly with current LLM strengths and carry the highest structural exposure; live, oral, and practical formats carry the lowest.",
      },
      {
        source: "Bernabei et al. (2023)",
        finding:
          "LLMs produce fluent descriptive prose but markedly weaker original analysis; formats dominated by description are more susceptible than those demanding sustained reasoning.",
      },
    ],
  },
  {
    number: 5,
    name: "Verification Surface",
    question:
      "Can the instructor plausibly distinguish between a student who learned and one who prompted?",
    rows: [
      {
        source: "Paustian & Slinger (2024)",
        finding:
          "Verification depends on structural features of the assignment, not detection tools alone; assignments with no secondary verification mechanism leave instructors without a reliable basis for judgment.",
      },
      {
        source: "Weber-Wulff et al. (2023)",
        finding:
          "A large comparative test of AI-text detectors found them neither consistently accurate nor reliable, and systematically biased toward labeling AI-generated text as human.",
      },
      {
        source: "Perkins et al. (2024)",
        finding:
          "Simple paraphrasing and adversarial edits reliably bypass detectors, which also carry high false-positive rates for non-native writers, making detector-only verification structurally insufficient.",
      },
      {
        source: "Lodge et al. (2023)",
        finding:
          "The most durable verification comes from assessment design that makes the student's reasoning process observable, since detection alone is increasingly unreliable.",
      },
    ],
  },
];

const REFERENCES = [
  "Akbar, M. S. (2025). Beyond detection: Designing AI-resilient assessments with automated feedback to foster critical thinking. arXiv:2503.23622.",
  "Bernabei, M., Colabianchi, S., Falegnami, A., & Costantino, F. (2023). Students' use of large language models in engineering education. Computers and Education: Artificial Intelligence, 5, 100172.",
  "Birks, D., & Clare, J. (2023). Linking artificial intelligence facilitated academic misconduct to existing prevention frameworks. International Journal for Educational Integrity, 19, 20.",
  "Ding, K. (2025). Designing AI-resilient assessments using interconnected problems: A theoretically grounded and empirically validated framework. arXiv:2512.10758.",
  "Lodge, J. M., Thompson, K., & Corrin, L. (2023). Mapping the implications of generative artificial intelligence for academic integrity. Australasian Journal of Educational Technology.",
  "Ncube, P. D. N., Dzvapatsva, G. P., Matobobo, C., & Ranga, M. M. (2025). Redefining student assessment in AI-infused learning environments: A systematic review of challenges and strategies for academic integrity. AI and Ethics.",
  "Paustian, T., & Slinger, B. (2024). Students are using large language models and AI detectors can often detect their use. Frontiers in Education.",
  "Perkins, M., Roe, J., Vu, B., Postma, D., Hickerson, D., & McGaughran, J. (2024). Simple techniques to bypass GenAI text detectors: Implications for inclusive education. International Journal of Educational Technology in Higher Education, 21.",
  "Pudasaini, S., Miralles-Pechuán, L., Lillis, D., & Salvador, M. (2024). Survey on AI-generated plagiarism detection. Journal of Academic Ethics, 23, 1137–1170.",
  "Saltan, A. (2025). Enhancing learning and mitigating AI-assisted misconduct: A case of using video assignments in a high-enrollment software engineering course. Proceedings of the 33rd ACM International Conference on the Foundations of Software Engineering.",
  "Shepherd, C. (2025). Generative AI misuse potential in cyber security education. arXiv:2501.12883.",
  "Weber-Wulff, D., Anohina-Naumeca, A., Bjelobaba, S., Foltýnek, T., Guerrero-Dib, J., Popoola, O., Šigut, P., & Waddington, L. (2023). Testing of detection tools for AI-generated text. International Journal for Educational Integrity, 19, 26.",
];

export default function EvidencePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-white/5">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 group">
          <span className="text-amber-500 dark:text-amber-400 text-lg">◈</span>
          <span className="font-semibold text-sm tracking-wide text-neutral-800 dark:text-white/90 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
            First Light
          </span>
        </button>
        <div className="flex items-center gap-3">
          <a
            href="/institutions"
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-800 dark:hover:text-white/80 transition-colors font-medium"
          >
            For institutions
          </a>
          <ThemeToggle />
          <button
            onClick={() => router.back()}
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 transition-colors font-medium"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 w-full">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400 text-xs font-medium tracking-wider uppercase mb-6">
            Methodology
          </div>
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
            Evidence Base for the Five-Dimension Rubric
          </h1>
          <p className="text-neutral-500 dark:text-white/50 text-sm leading-relaxed">
            A reference document for beta reviewers · First Light Assessment Tool
          </p>
        </div>

        {/* Overview */}
        <div className="mb-12 p-6 rounded-2xl border border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.02]">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-3">
            Overview
          </h2>
          <p className="text-sm text-neutral-600 dark:text-white/60 leading-relaxed">
            First Light evaluates course assignments for susceptibility to completion by LLMs. Its rubric
            is organized around five dimensions grounded in peer-reviewed research. The central question
            is not &ldquo;can an LLM do this?&rdquo; but: does this assignment create conditions where
            LLM output is indistinguishable from student learning? (Lodge et al., 2023).
          </p>
          <p className="text-sm text-neutral-600 dark:text-white/60 leading-relaxed mt-4">
            A note on method: several studies in this field measure how well an LLM can <em>grade</em>{" "}
            student work rather than how susceptible an assignment is to being <em>completed</em> by AI.
            We treat those as useful background on LLM capability, not as a scoring basis, and have kept
            them out of the dimension evidence below.
          </p>
        </div>

        {/* Dimensions */}
        <div className="space-y-12 mb-16">
          {DIMENSIONS.map((dim) => (
            <div key={dim.number}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-amber-500 dark:text-amber-400 font-mono text-sm font-bold">
                  {String(dim.number).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white">
                  {dim.name}
                </h2>
              </div>
              <p className="text-sm italic text-neutral-500 dark:text-white/40 mb-5 ml-9">
                {dim.question}
              </p>

              <div className="overflow-x-auto ml-9">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-white/8">
                      <th className="text-left py-2 pr-6 font-semibold text-neutral-500 dark:text-white/40 text-xs uppercase tracking-wider w-40">
                        Source
                      </th>
                      <th className="text-left py-2 font-semibold text-neutral-500 dark:text-white/40 text-xs uppercase tracking-wider">
                        Finding
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dim.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-neutral-100 dark:border-white/5 last:border-0"
                      >
                        <td className="py-3 pr-6 text-xs font-medium text-amber-700 dark:text-amber-400/80 align-top w-40 leading-relaxed">
                          {row.source}
                        </td>
                        <td className="py-3 text-neutral-600 dark:text-white/55 leading-relaxed align-top">
                          {row.finding}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* References */}
        <div className="border-t border-neutral-200 dark:border-white/8 pt-12">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-6">
            References
          </h2>
          <ol className="space-y-3">
            {REFERENCES.map((ref, i) => (
              <li key={i} className="flex gap-3 text-xs text-neutral-500 dark:text-white/40 leading-relaxed">
                <span className="flex-shrink-0 text-neutral-300 dark:text-white/20 font-mono mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{ref}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-neutral-400 dark:text-white/15">
            First Light · For educational use · © 2026 First Light Technology, Inc.
          </p>
        </div>
      </div>
    </main>
  );
}
