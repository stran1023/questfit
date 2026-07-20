# QuestFit

**Your body. Your adventure.**

QuestFit turns a personalized workout into a browser-based adventure. An AI planner creates a structured workout, a level compiler maps it to game challenges, MediaPipe recognizes movement locally, Phaser runs the mission, and a deterministic analysis pipeline feeds an AI-written coaching recap.

The target is a hackathon MVP: one complete, privacy-preserving vertical slice on a documented Chromium reference setup, with deterministic/local fallbacks keeping the demo playable when AI or Supabase credentials are unavailable.

Presenter flow: [`docs/DEMO_RUNBOOK.md`](docs/DEMO_RUNBOOK.md)

The movement library includes squat, jump, lunge, jumping jack, high knees, push-up, plank, left/right punches, and left/right side reaches. Proven squat/jump calibration and classification behavior is integrated behind the extensible movement registry rather than maintained as a separate application.

## Start Here

```bash
./init.sh
npm run dev
```

Read [AGENTS.md](AGENTS.md) for the agent workflow and [docs/PRODUCT.md](docs/PRODUCT.md) for the target MVP. The active migration sequence is indexed in [docs/PLANS.md](docs/PLANS.md).

## Current Baseline

- Runtime: Next.js 15 App Router, React 19, TypeScript 5.9
- Product routes: guest onboarding, planning, automatic preparation, Phaser mission, and factual results
- Implemented boundaries: executable Zod contracts, deterministic goal/profile-aware 5–7 stage planning with validated rationale, responsive briefing, typed pose/calibration adapters, and Vitest coverage
- Implemented runtime: polished Phaser 3 Volcano Escape missions, eleven on-device MediaPipe movements, deterministic coaching, procedural action sound, and Playwright desktop/narrow hardening checks
- Demo boundary: complete guest-local happy path; Supabase account/progress sync is deferred until after the hackathon walkthrough
- Standard verification: `npm run verify`

The routed Next.js product and its current feature boundaries are authoritative.
