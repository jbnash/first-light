# First Light

Assignment-quality advisor that helps faculty redesign assignments to be harder for AI to complete. Pasted prompt → five-dimension analysis + specific revision recommendations. Built for university Centers for Teaching & Learning.

**Live:** [firstlight.solutions](https://firstlight.solutions)
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3 · Anthropic SDK (Claude Haiku 4.5)
**Entity:** First Light Technology, Inc. (Kentucky C-Corp)

---

## ⚠ Production Checklist

**Read this before sharing the URL with anyone you don't personally know.** Status as of last edit:

| | Item | Status |
|---|---|---|
| 🔒 | **Anthropic spend alert set** ([console.anthropic.com](https://console.anthropic.com) → Settings → Usage limits, $10/day suggested) | ⏳ TODO |
| 🚦 | **Upstash Redis provisioned** for rate limiter (env vars `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Vercel) | ⏳ Deferred — install when trigger fires (see below) |
| 📧 | **Cloudflare Email Routing** active (`john@firstlight.solutions` + catch-all → personal inbox) | ✅ |
| 🌐 | **Custom domain live** (`firstlight.solutions` apex canonical, www + old vercel.app URL both 308 to apex) | ✅ |
| 📜 | **Data practices page** at [/data-practices](https://firstlight.solutions/data-practices) accurately describes Anthropic 7-day retention | ✅ |
| 🏛 | **Copyright reflects entity ownership** (First Light Technology, Inc. — IP transferred from founder) | ✅ |

### When to install Upstash

Pull the trigger if EITHER condition fires:

- **Traffic trigger:** Vercel Analytics shows >30 distinct visitors in any single day.
- **Signal trigger:** Anyone shares `firstlight.solutions` on LinkedIn, X, Bluesky, or a public Slack/Discord. Install before EOD that same day.

The rate-limiter code already lives at [src/lib/ratelimit.ts](src/lib/ratelimit.ts) and fails open until the env vars are set. Setup takes ~5 minutes in the Vercel dashboard → Storage → Create → Upstash for Redis.

---

## Project layout

```
src/
├── app/
│   ├── api/analyze/route.ts    # Anthropic call + system prompt + rate-limit check
│   ├── page.tsx                # Homepage (paste + analyze)
│   ├── results/page.tsx        # Five-dimension scorecard + punch list
│   ├── print/page.tsx          # Printable PDF report
│   ├── institutions/page.tsx   # CTL-targeted landing page
│   ├── data-practices/page.tsx # Data handling disclosure
│   └── evidence/page.tsx       # Research basis for the rubric
├── components/                 # DimensionCard, ScoreBars, PunchList, etc.
└── lib/
    ├── types.ts                # AnalysisResult, DimensionResult, Recommendation
    ├── dimensions.ts           # DIMENSION_ORDER, labels, scoreLabel, difficultyLabel
    └── ratelimit.ts            # Upstash-backed per-IP limiter (fails open)
```

## Local dev

```bash
npm install
cp .env.local.example .env.local      # then add your ANTHROPIC_API_KEY
npm run dev                            # http://localhost:3000
```

## Deploy

Pushes to `main` auto-deploy via Vercel. Production env vars are managed in the Vercel project dashboard, not in this repo.

## See also

- [TODOS.md](TODOS.md) — backlog and ship-state
- Design doc: `~/.gstack/projects/first-light/jbnash-main-design-20260429-officeHours.md`
- Eng review: same directory, files prefixed with `jbnash-main-eng-review-*`
