# First Light — TODOS

## Active

### Cost / abuse protection — DEFAULT-ALIVE

- [ ] **Set an Anthropic spend alert.** Console → Settings → Usage limits. Suggested: $10/day cap with email at 80%, $100/month upper bound. This is the must-have backstop. Without Upstash, this is the only thing standing between you and a runaway bill if someone abuses `/api/analyze`. **Do this before sharing the URL with anyone you don't know.**

- [ ] **Provision Upstash Redis when EITHER trigger fires:**
  - **Traffic trigger:** Vercel Analytics shows >30 distinct visitors in any single day.
  - **Signal trigger:** Anyone shares `firstlight.solutions` on LinkedIn, X, Bluesky, or a public Slack/Discord. EOD that same day.

  Setup: ~5 min. Vercel project → Storage → Create → Upstash for Redis (free tier). Vercel wires the env vars automatically. Code is already in place at [src/lib/ratelimit.ts](src/lib/ratelimit.ts) — fails open without env vars, kicks in the moment they're set. No redeploy needed beyond the env-var-triggered rebuild.

### Validation

- [ ] **Watch one tester use First Light unguided.** 30 min, no coaching, no nudging. Validates the cognitive-dissonance / policy-vacuum / whack-a-mole pattern in a faculty user who is not the founder. Design doc Premise 5 names this as the load-bearing N=1 risk on emotional shape.

## Pre–first paid contract

- [ ] **Cost model per institution.** Compute expected per-institution annual API cost at usage tiers (10, 50, 200 analyses/month) using Haiku pricing. Compare against the $1,500–$5,000 contract band the design doc targets. Write to `docs/cost-model.md`.
- [ ] **Eval suite for the system prompt.** 6–8 frozen tester-validated inputs at `evals/cases/*.txt`, runner at `evals/run.ts` calling `/api/analyze` with assertions on score bands, banned language, recommendation specificity. Run on every prompt change.
- [ ] **Playwright happy-path test.** Single E2E: load `/`, paste example, mock `/api/analyze`, assert results page renders and Print button works.
- [ ] **CLAUDE.md Testing section.** Document the test framework, command, file conventions so `/qa` / `/review` / future skill runs can find it.

## If procurement asks (re-engage Anthropic only at this point)

- [ ] **Apply for an Anthropic DPA / ZDR agreement** *only* when a named institutional contract has it on the procurement spec in writing. Use the contact-sales form with the specific contract as the forcing function. The default 7-day retention + no-training is sufficient for pilot conversations on its own.

## Post-pilot signals to watch for

- [ ] **Shareable result URLs (`/share/[id]`).** Only build when a pilot CTL says "I'd pay more if I could forward a link instead of a PDF." Persist the analysis JSON only, never the assignment text; 30-day expiry; consent screen.
- [ ] **Version history / draft → revise → re-analyze loop.** Tester 3 explicitly asked for this. Blocks on account model. Revisit after first paid pilot signal.
- [ ] **Google Workspace upgrade** when you want replies to come from `@firstlight.solutions` instead of Gmail. Only needed once a CTL pushes back on the from-address. $6–12/mo per inbox.
- [ ] **About / Team page** that names you with PhD credentials. Right home for the personal byline that was removed from /evidence. Not urgent until someone asks "who's behind this?" or you bring on a collaborator.

## Shipped

- [x] Single-assignment scope (drop syllabus support across prompt, UI, schema)
- [x] Extract types to `src/lib/types.ts`, dimension helpers to `src/lib/dimensions.ts`
- [x] `/institutions` landing page (free summer pilot CTA)
- [x] `/data-practices` page with accurate Anthropic 7-day retention disclosure
- [x] Rate limiter code (fails open without env vars; awaits provisioning per trigger above)
- [x] Safer JSON extractor (balanced-brace scanner, ignores braces inside strings)
- [x] Removed unused Gemini + Groq SDKs
- [x] Homepage copy updated: subhead, placeholder, retention claim, "For institutions" nav link
- [x] UX nudge against pasting student work
- [x] Custom domain `firstlight.solutions` live with valid SSL
- [x] 308 redirects: www → apex, old kappa Vercel URL → apex
- [x] Cloudflare Email Routing: `john@firstlight.solutions` + catch-all → personal Gmail
- [x] Copyright switched to First Light Technology, Inc. across all pages
- [x] Founder byline + LinkedIn removed from `/evidence` (corporate attribution)
- [x] Footer line-break split: legal/copyright on line one, nav links on line two
