"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function DataPracticesPage() {
  const router = useRouter();

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
          <a
            href="/institutions"
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-800 dark:hover:text-white/80 transition-colors font-medium"
          >
            For institutions
          </a>
          <ThemeToggle />
          <button
            onClick={() => router.push("/")}
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 transition-colors font-medium"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-white/30 mb-3">
          Data Practices
        </p>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-3 leading-tight">
          What happens to the text you paste
        </h1>
        <p className="text-sm text-neutral-500 dark:text-white/40 mb-12">
          Plain English. Updated May 2026.
        </p>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-white/80 uppercase tracking-wide mb-3">
            What we send to Anthropic
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            First Light uses Anthropic&rsquo;s Claude model to perform the analysis.
            When you click Analyze, the text you pasted is sent to Anthropic&rsquo;s API
            along with the instructions that tell Claude how to score it.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-white/80 uppercase tracking-wide mb-3">
            What Anthropic does with it
          </h2>
          <ul className="space-y-3 text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                Your text is sent to Anthropic&rsquo;s API for analysis (not to
                any other AI vendor). The result returns to your browser.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                As of September 2025, Anthropic automatically deletes API inputs
                and outputs after <strong>7 days</strong>. They are retained only
                for abuse monitoring during that window.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                Anthropic does <strong>not</strong> use API inputs or outputs to
                train their models.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                Anthropic&rsquo;s current policy:{" "}
                <a
                  href="https://platform.claude.com/docs/en/build-with-claude/api-and-data-retention"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-neutral-800 dark:hover:text-white/80 transition-colors"
                >
                  API and data retention
                </a>
                .
              </span>
            </li>
          </ul>
          <p className="text-sm text-neutral-500 dark:text-white/40 leading-relaxed mt-4">
            We update this page when Anthropic&rsquo;s policy changes. The
            &ldquo;Updated&rdquo; date at the top reflects the last review.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-white/80 uppercase tracking-wide mb-3">
            What First Light keeps
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed mb-3">
            No content on our servers. First Light has no database; the
            assignment text you paste and the analysis you get back are never
            stored or logged. The result is held in your browser session so the
            Results and Print pages can render it. When you close the tab, it
            is gone.
          </p>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            Standard hosting-level analytics (anonymous page visits, load
            times) are collected by Vercel as the website host. This is
            operational data only and is not associated with the content you
            analyze.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-white/80 uppercase tracking-wide mb-3">
            Please don&rsquo;t paste student work
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed mb-3">
            First Light is designed to analyze <em>assignment prompts</em> —
            the instructions you give your students. It is not designed to
            analyze student submissions, drafts, or anything else that could
            identify a specific student.
          </p>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed mb-3">
            We can&rsquo;t technically prevent you from pasting student work;
            the tool sees text without knowing its origin. The workflow is
            built around faculty self-discipline and the analysis surface:
            prompts go in, prompt feedback comes out. A reminder appears at
            paste time on the homepage.
          </p>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            If you have a hypothetical example to test against, that&rsquo;s
            fine. Real student work belongs in your LMS, not a third-party
            tool. This is true of First Light and any other AI tool you might
            be considering.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-white/80 uppercase tracking-wide mb-3">
            For institutional buyers
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            If your Center for Teaching &amp; Learning, IT, or procurement
            office needs additional documentation &mdash; DPA, security
            questionnaire response, FERPA stance for your specific use case
            &mdash; email{" "}
            <a
              href="mailto:john@firstlight.solutions"
              className="underline underline-offset-2 hover:text-neutral-800 dark:hover:text-white/80 transition-colors"
            >
              john@firstlight.solutions
            </a>
            . Most pilots have proceeded without formal documentation; if
            yours requires it, we&rsquo;ll prepare what&rsquo;s needed.
          </p>
        </section>

        <div className="mt-16 pt-6 border-t border-neutral-200 dark:border-white/10">
          <p className="text-center text-xs text-neutral-400 dark:text-white/20">
            First Light · For educational use · © 2026 First Light Technology, Inc.
          </p>
          <p className="text-center text-xs text-neutral-400 dark:text-white/20 mt-2">
            <a
              href="/evidence"
              className="underline underline-offset-2 hover:text-neutral-500 dark:hover:text-white/30 transition-colors"
            >
              Research basis
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
