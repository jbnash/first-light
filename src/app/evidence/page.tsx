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
        source: "Impey et al. (2024)",
        finding:
          "Context-specific and visual tasks remain harder for LLMs; assignments with low requirements for personal data or local context were consistently more susceptible.",
      },
      {
        source: "Fagbohun et al. (2024)",
        finding:
          "Required originality is a key vulnerability factor — when assignments don't demand personal data or context, LLMs complete them at passing quality with minimal effort.",
      },
      {
        source: "Shepherd (2025)",
        finding:
          "LLMs perform poorly when tasks require nuanced, course-specific knowledge; assignments relying on shallow or generic content are most easily completed.",
      },
    ],
  },
  {
    number: 2,
    name: "Task Openness",
    question: "Is the prompt broad and genre-predictable, or constrained and novel?",
    rows: [
      {
        source: "Paustian & Slinger (2024)",
        finding:
          "Broad, generic assignment types are among those most commonly completed by LLMs, with text-based homework and standard reports showing the highest rates of AI-generated content.",
      },
      {
        source: "Bernabei et al. (2023)",
        finding:
          "Assignments framed as standard academic genres (compare/contrast, summary, discussion post) were consistently easier for LLMs than constrained or novel tasks.",
      },
      {
        source: "Impey et al. (2024)",
        finding:
          "Generic, content-based questions are easier for LLMs than tasks requiring discipline-specific reasoning.",
      },
    ],
  },
  {
    number: 3,
    name: "Process Visibility",
    question:
      "Are there mechanisms that make the student's learning process visible — drafts, reflections, oral defenses, iteration?",
    rows: [
      {
        source: "Policar et al. (2025)",
        finding:
          "Process artifacts and multi-stage submission structures are key features of LLM-resistant assessment design.",
      },
      {
        source: "Gooch et al. (2024)",
        finding:
          "LLM-resistant assignments consistently incorporated process artifacts such as drafts and reflections; assignments lacking these were disproportionately flagged for AI-generated content.",
      },
      {
        source: "Fagbohun et al. (2024)",
        finding:
          "Oral defenses and tasks requiring local data or tools function as reliable process visibility mechanisms regardless of content difficulty.",
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
        source: "Gooch et al. (2024) / Impey et al. (2024)",
        finding:
          "Generic written outputs and content-based question formats were the most susceptible; visual, local, or discipline-specific outputs showed lower risk.",
      },
      {
        source: "Bernik et al. (2025)",
        finding:
          "Standard programming assignments without runtime verification are effectively indistinguishable from LLM output.",
      },
      {
        source: "Chiang et al. (2024)",
        finding:
          "LLMs can evaluate and generate responses to typical assignment formats at a level comparable to human graders.",
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
        source: "Bernabei et al. (2023) / Policar et al. (2025)",
        finding:
          "Verification burden — the difficulty instructors face in checking whether work reflects genuine learning — is a primary driver of LLM misuse risk, independent of content difficulty.",
      },
      {
        source: "Pudasaini et al. (2024) / Gooch et al. (2024) / Nikolovski et al. (2025)",
        finding:
          "AI detection tools carry non-trivial error rates (~88% accuracy at best), making detector-only verification structurally insufficient.",
      },
      {
        source: "Lodge et al. (2023)",
        finding:
          "Assessment design should incorporate \"epistemic transparency\" — mechanisms that make the student's reasoning process observable — as the most durable form of verification.",
      },
    ],
  },
];

const REFERENCES = [
  "Bernabei, M., Colabianchi, S., Falegnami, A., & Costantino, F. (2023). Students' use of large language models in engineering education. Computers and Education: Artificial Intelligence, 5, 100172.",
  "Bernik, A., Radošević, D., & Čep, A. (2025). A comparative study of large language models in programming education. Applied Sciences.",
  "Chiang, C., Chen, W., Kuan, C., Yang, C., & Lee, H. (2024). Large language model as an assignment evaluator. arXiv.",
  "Fagbohun, O., Iduwe, N., Abdullahi, M., Ifaturoti, A., & Nwanna, O. (2024). Beyond traditional assessment: Exploring the impact of large language models on grading practices. Journal of Artificial Intelligence, Machine Learning and Data Science.",
  "Gooch, D., Waugh, K., Richards, M., Slaymaker, M., & Woodthorpe, J. (2024). Exploring the profile of university assessments flagged as containing AI-generated material. ACM Inroads, 15, 39–47.",
  "Impey, C., Wenger, M., Garuda, N., Golchin, S., & Stamer, S. (2024). Using large language models for automated grading of student writing about science. International Journal of Artificial Intelligence in Education, 35, 1825–1859.",
  "Lodge, J. M., Thompson, K., & Corrin, L. (2023). Mapping the implications of generative artificial intelligence for academic integrity. Australasian Journal of Educational Technology.",
  "Nikolovski, V., Trajanov, D., & Chorbev, I. (2025). Advancing AI in higher education. Algorithms, 18, 144.",
  "Paustian, T., & Slinger, B. (2024). Students are using large language models and AI detectors can often detect their use. Frontiers in Education.",
  "Policar, P., Špendl, M., Curk, T., & Zupan, B. (2025). Automated assignment grading with large language models. Bioinformatics, 41, i21–i29.",
  "Pudasaini, S., Miralles-Pechuán, L., Lillis, D., & Salvador, M. (2024). Survey on AI-generated plagiarism detection. Journal of Academic Ethics, 23, 1137–1170.",
  "Shepherd, C. (2025). Generative AI misuse potential in cyber security education. ArXiv.",
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
            A reference document for beta reviewers · First Light Assessment Tool · John Nash
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

        <p className="text-center text-xs text-neutral-400 dark:text-white/15 mt-12">
          First Light · For educational use · © 2026 John Nash
        </p>
      </div>
    </main>
  );
}
