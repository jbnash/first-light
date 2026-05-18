# First Light — TODOS

## Pre-show / pre-go-live

- **Replace the placeholder contact email.** `hello@firstlight.app` appears in [src/app/data-practices/page.tsx](src/app/data-practices/page.tsx) (`CONTACT_EMAIL` not extracted yet) and [src/app/institutions/page.tsx](src/app/institutions/page.tsx) (`CONTACT_EMAIL` constant at top of file). Swap to whatever inbox actually routes to you before the influential-group show.
- **Provision Upstash Redis** and set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Vercel project env. Without these the rate limiter fails open — fine for local dev, dangerous in production once the URL is shared. ~5 min in Upstash console + Vercel dashboard.
- **Domain + Vercel setup.** Point the custom domain at the Vercel deployment, verify HTTPS, double-check that `/data-practices` and `/institutions` resolve on the live URL before the show.
- **Watch one tester use First Light unguided.** 30 min, no coaching, no nudging. Validates the cognitive-dissonance / policy-vacuum / whack-a-mole pattern in a faculty user who is not the founder. Design doc Premise 5 names this as N=1 risk on emotional shape.

## Pre–first paid contract

- **Cost model per institution.** Compute expected per-institution annual API cost at usage tiers (10, 50, 200 analyses/month) using Haiku pricing. Compare against the $1,500–$5,000 contract band the design doc targets. Write to `docs/cost-model.md`.
- **Eval suite for the system prompt.** 6–8 frozen tester-validated inputs at `evals/cases/*.txt`, runner at `evals/run.ts` calling `/api/analyze` with assertions on score bands, banned language, recommendation specificity. Run on every prompt change.
- **Playwright happy-path test.** Single E2E: load `/`, paste example, mock `/api/analyze`, assert results page renders and Print button works.
- **CLAUDE.md Testing section.** Document the test framework, command, file conventions so `/qa` / `/review` / future skill runs can find it.

## If procurement asks (re-engage Anthropic only at this point)

- **Apply for an Anthropic DPA / ZDR agreement** *only* when a named institutional contract has it on the procurement spec in writing. Use the contact-sales form with the specific contract as the forcing function. The default 7-day retention + no-training is sufficient for pilot conversations on its own.

## Post-pilot signals to watch for

- **Shareable result URLs (`/share/[id]`).** Only build when a pilot CTL says "I'd pay more if I could forward a link instead of a PDF." Persist the analysis JSON only, never the assignment text; 30-day expiry; consent screen.
- **Version history / draft → revise → re-analyze loop.** Tester 3 explicitly asked for this. Blocks on account model. Revisit after first paid pilot signal.

## P2 cleanup

- **Decide on the dead `multi_assignment_rule` / `source_note` schema references after a few weeks of single-assignment use.** They're gone from code now; this is just to confirm nothing leaks back in via prompt drift.
