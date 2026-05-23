"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const CONTACT_EMAIL = "john@firstlight.solutions";

const PILOT_EMAIL_SUBJECT = "First Light pilot — interested";
const PILOT_EMAIL_BODY = `Hi John,

I'd like to talk about a First Light pilot at our institution. A few quick details:

  Institution:
  My role:
  Why this is interesting right now:

Best time for a 20-30 minute call:

Thanks.`;

function buildMailto(subject: string, body: string): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export default function InstitutionsPage() {
  const router = useRouter();
  const mailtoHref = buildMailto(PILOT_EMAIL_SUBJECT, PILOT_EMAIL_BODY);

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
          <ThemeToggle />
          <button
            onClick={() => router.push("/")}
            className="text-xs text-neutral-500 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 transition-colors font-medium"
          >
            Try the tool →
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400 text-xs font-medium tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse-slow"></span>
          For Institutions
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white max-w-2xl leading-[1.05] text-balance mb-5">
          Something concrete to show your provost{" "}
          <span className="text-amber-500 dark:text-amber-400">this fall.</span>
        </h1>

        <p className="text-lg text-neutral-500 dark:text-white/50 max-w-xl leading-relaxed text-balance mb-10">
          Most universities have not set an AI policy. Faculty are improvising in private and getting it wrong in public. First Light is the defensible institutional response your CTL can put in faculty hands now, while the policy work catches up.
        </p>

        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm bg-amber-500 dark:bg-amber-400 text-white dark:text-black hover:bg-amber-400 dark:hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-amber-500/20 dark:shadow-amber-400/20 mb-3"
        >
          Talk about a pilot
          <span className="opacity-60">→</span>
        </a>
        <p className="text-xs text-neutral-400 dark:text-white/30">
          Opens an email. Three quick questions, no form to fill out.
        </p>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-20">

        <section className="mb-14">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-4">
            What faculty get
          </h2>
          <ul className="space-y-3 text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                Paste an assignment prompt. Receive a five-dimension analysis
                across context specificity, task openness, process visibility,
                output type, and verification surface. Each dimension scored
                1–10 with the actual language from the assignment as evidence.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                A specific punch list of revisions. Not generic advice. Each
                recommendation names a part of the assignment by phrase and
                explains exactly why ChatGPT cannot do the proposed step.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1">◈</span>
              <span>
                A printable PDF report faculty can take to a department chair,
                a CTL conversation, or a syllabus committee.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-4">
            Pilot terms
          </h2>
          <div className="rounded-2xl border border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.02] p-6">
            <ul className="space-y-4 text-base text-neutral-600 dark:text-white/60 leading-relaxed">
              <li>
                <strong className="text-neutral-800 dark:text-white/80">Free for the summer.</strong>{" "}
                May through August 2026. Unlimited use by your institution&rsquo;s faculty.
              </li>
              <li>
                <strong className="text-neutral-800 dark:text-white/80">A 30-minute kickoff call</strong>{" "}
                to share with your CTL team how it works and what we&rsquo;ve seen so far.
              </li>
              <li>
                <strong className="text-neutral-800 dark:text-white/80">A 30-minute check-in</strong>{" "}
                mid-summer. What faculty are using it for. What&rsquo;s landing. What&rsquo;s confusing.
              </li>
              <li>
                <strong className="text-neutral-800 dark:text-white/80">A conversion conversation in late August.</strong>{" "}
                Honest discussion about whether this is worth budget for fall, and on what terms. No pressure to convert.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-4">
            Why now
          </h2>
          <div className="space-y-4 text-base text-neutral-600 dark:text-white/60 leading-relaxed">
            <p>
              Three things are converging on CTL directors right now. Faculty
              are losing trust in their own assignments and asking for help.
              AI-detector tools have collapsed as a defense — the false
              positives are damaging student relationships. And provosts are
              asking what the institution is doing about AI in coursework, but
              the formal policy work is months or years out.
            </p>
            <p>
              First Light fills the gap. It lets faculty redesign their own
              assignments now, in private, with a specific advisor in their
              pocket. It is not a detector. It does not surveil students. It
              does not require an LMS integration. It is something a CTL can
              roll out this summer and point to in fall.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-xs font-semibold text-neutral-400 dark:text-white/30 tracking-widest uppercase mb-4">
            Data practices in one paragraph
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed mb-3">
            Assignment text is sent to Anthropic&rsquo;s API for analysis.
            Anthropic deletes API inputs and outputs after seven days and does
            not use them for model training. First Light keeps no copies on
            our servers. Faculty are explicitly asked not to paste student
            work.
          </p>
          <a
            href="/data-practices"
            className="text-sm text-amber-600 dark:text-amber-400/80 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
          >
            Full data practices →
          </a>
        </section>

        <p className="text-sm italic text-neutral-500 dark:text-white/40 leading-relaxed text-balance mb-12 max-w-xl">
          This pilot cohort is higher-education-focused. K&ndash;12 and independent schools &mdash; especially those running on Canvas or other major LMS infrastructure &mdash; are welcome to use the homepage tool, and institutional conversations with secondary schools will follow.
        </p>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-8 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            One email starts the conversation.
          </h2>
          <p className="text-base text-neutral-600 dark:text-white/60 leading-relaxed mb-5">
            If your CTL is wrestling with AI in coursework right now, write three sentences and we&rsquo;ll find time. Pilots are first-come.
          </p>
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 dark:bg-amber-400 text-white dark:text-black hover:bg-amber-400 dark:hover:bg-amber-300 transition-all duration-200 shadow-md"
          >
            Talk about a pilot
            <span className="opacity-60">→</span>
          </a>
        </section>

        <p className="text-center text-xs text-neutral-400 dark:text-white/20">
          First Light · For educational use · © 2026 First Light Technology, Inc.
        </p>
        <p className="text-center text-xs text-neutral-400 dark:text-white/20 mt-2">
          <a href="/data-practices" className="underline underline-offset-2 hover:text-neutral-500 dark:hover:text-white/30 transition-colors">Data practices</a>
          {" · "}
          <a href="/evidence" className="underline underline-offset-2 hover:text-neutral-500 dark:hover:text-white/30 transition-colors">Research basis</a>
        </p>
      </div>
    </main>
  );
}
