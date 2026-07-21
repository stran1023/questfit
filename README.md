# QuestFit

### Your body. Your adventure.

[![Version](https://img.shields.io/badge/version-0.1.0-ff6b35)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-110%20passing-31c48d)](#quality-and-verification)
[![License](https://img.shields.io/badge/license-TODO-lightgrey)](#license)

QuestFit turns a home workout into a body-controlled fantasy adventure. It builds a goal-aware exercise plan, compiles each movement into a game challenge, recognizes completed movements locally through the webcam, and rewards the player with deterministic results and coaching.

The current hackathon experience is a complete guest journey through **Volcano Escape**: prepare with Scout, follow a warm-up-to-peak workout, attack and dodge the Ash Titan, escape through the Storm Gate, cool down, and review the session—all in the browser.

> [!IMPORTANT]
> Webcam video and raw pose landmarks stay on the device. QuestFit stores only derived calibration thresholds and session data required for local continuity.

## ✨ Key features

- **Personalized workout adventures** — goal, duration, fitness level, activity frequency, and movement considerations shape every plan.
- **Progressive workout structure** — five to seven stages move through warm-up, build, surge, and peak before a guided, non-scored cooldown.
- **Visible AI-to-action pipeline** — the briefing explains how profile choices become validated movements, encounters, and rewards.
- **Body-controlled gameplay** — MediaPipe recognizes 11 supported movements; verified actions drive Phaser encounters and the Ash Titan battle.
- **Privacy-first calibration** — touch-free setup runs locally and saves only versioned, derived thresholds.
- **Deterministic scoring** — mission progress, accuracy, combo, XP, and recommendations come from application rules rather than model-generated estimates.
- **Reliable fallbacks** — planning and coaching remain usable when an external provider is unavailable or returns invalid output.
- **Accessible presentation** — responsive desktop/narrow layouts, keyboard navigation, reduced-motion support, spoken cues, and independent audio controls.
- **Recurring trail guide** — Scout provides concise guidance and celebrations throughout the journey.

## 📸 Screenshots and demo

| Plan your route | Battle the Ash Titan | Review your run |
| --- | --- | --- |
| _TODO: Add planner screenshot_ | _TODO: Add mission screenshot_ | _TODO: Add results screenshot_ |

For the complete presenter sequence, expected behavior, recovery paths, and claim boundaries, see the [demo runbook](docs/DEMO_RUNBOOK.md).

> [!NOTE]
> A hosted demo URL and permanent screenshot gallery have not been published yet. Add them here when release assets are available.

## Technology stack

| Area | Technology | Role |
| --- | --- | --- |
| Application | Next.js 15 App Router, React 19 | Routes, UI, lifecycle, and server API |
| Language | TypeScript 5.9 (strict mode), JavaScript | Product code and tested pose/calibration foundations |
| Game runtime | Phaser 3.90 | Mission world, effects, encounters, and animation |
| Pose tracking | MediaPipe Tasks Vision | On-device body landmark inference |
| Validation | Zod 4 | Runtime validation for plans, blueprints, sessions, and handoffs |
| Styling | Global CSS | Sport/fantasy design system and responsive presentation |
| Testing | Node test runner, Vitest, Testing Library, Playwright | Core, unit, component, and browser verification |
| Quality | ESLint 9, TypeScript, Next.js build | Static analysis and production validation |

## Project architecture

QuestFit separates planning, pose inference, gameplay, and scoring so each system has one clear authority:

```text
Profile → Workout policy → Validated plan → Game blueprint
                                               │
Webcam → MediaPipe → Movement events ──────────┤
                                               ▼
                                      Mission controller
                                        │            │
                                        ▼            ▼
                                  Phaser visuals   Results + coaching
```

- **React** owns application routes, controls, accessibility state, and coarse mission snapshots.
- **MediaPipe** runs independently and emits validated movement events; raw frames and landmarks never enter global React state.
- **The mission controller** owns objectives, progress, misses, combo, XP, and completion.
- **Phaser** renders the world from authoritative snapshots but cannot award credit or calculate results.
- **Zod contracts** validate data crossing route, planning, blueprint, mission, and result boundaries.

Read [the architecture guide](docs/ARCHITECTURE.md) for domain ownership, invariants, and design decisions.

## Installation

### Requirements

| Requirement | Notes |
| --- | --- |
| Node.js | The repository does not yet pin a minimum version; the current verified environment uses Node.js 24.16.0. |
| npm | Included with Node.js; the current verified environment uses npm 11.13.0. |
| Browser | A current desktop Chromium browser with webcam access; automated journeys use Google Chrome. |
| Webcam | Required for calibration and body-controlled missions. |

> [!TIP]
> If you only need repository verification, the automated browser suite uses controlled test inputs and does not require a physical workout.

Clone and bootstrap the project:

```bash
git clone https://github.com/stran1023/questfit.git
cd questfit
./init.sh
```

On PowerShell:

```powershell
git clone https://github.com/stran1023/questfit.git
Set-Location questfit
./init.ps1
```

The bootstrap script installs dependencies and runs the complete verification gate.

## Running the project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome and allow camera access when preparation begins.

Build and run the production server locally:

```bash
npm run build
npm start
```

### Quality and verification

```bash
npm run verify       # lint + typecheck + core/unit tests + Playwright + build
npm test             # core and Vitest suites
npm run test:e2e     # desktop and narrow Chrome journeys
npm run lint
npm run typecheck
npm run build
```

The verified baseline currently includes 6 core pose/calibration tests, 94 Vitest tests, and 10 Playwright journeys.

## Configuration and environment variables

No environment variables are required for the current guest-local hackathon build. Workout generation is handled by the application-owned deterministic planner, and local fallbacks keep the journey playable without AI or Supabase credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CAPTURE_VISUAL_EVIDENCE` | No | Set to `1` when running Playwright to save selected visual evidence in test output. |

Example:

```bash
CAPTURE_VISUAL_EVIDENCE=1 npm run test:e2e
```

> [!WARNING]
> Do not expose future AI provider or Supabase service credentials to browser code. Server-only secrets must stay outside version control, and remote user data must be protected by tested row-level security.

## Usage guide

1. **Continue as a guest** and create a local fitness profile.
2. **Choose a goal and duration** on the planning screen. QuestFit supports general fitness, cardio, strength, and mobility plans lasting 10, 15, or 20 minutes.
3. Tap **Generate My Adventure**. The AI to Action screen builds and validates the route before opening the briefing automatically.
4. **Scan the Adventure Briefing** for intensity, stages, checkpoints, movement encounters, and rewards. Expand mission details for the full rationale and compilation pipeline.
5. Select **Start Adventure**, grant camera permission, clear your movement space, and follow the hands-free calibration/countdown.
6. **Move to play**. Complete the displayed exercise to attack, block, dodge, or overcome the current obstacle.
7. Finish the guided cooldown, then review completion, accuracy, XP, strongest movement, and the next-session recommendation.

QuestFit currently supports squat, jump, lunge, jumping jack, high knees, push-up, plank, left/right punches, and left/right side reaches.

## Project structure

```text
questfit/
├── src/
│   ├── app/                  # Next.js pages, API route, metadata, and global styles
│   ├── calibration/          # Core calibration math and regression tests
│   ├── contracts/            # Zod schemas, movement registry, and shared contracts
│   ├── features/
│   │   ├── calibration/      # Automatic setup and movement-event adapters
│   │   ├── coaching/         # Deterministic analysis and coaching presentation
│   │   ├── gameplay/         # Mission controller, Phaser scene, audio, and cooldown
│   │   ├── guide/            # Scout companion component
│   │   ├── identity/         # Guest onboarding and local profile persistence
│   │   └── workout-planner/  # Planning policy, generation journey, and briefing
│   └── pose/                 # Webcam and MediaPipe lifecycle foundations
├── public/game/              # Project-owned mission and character artwork
├── tests/e2e/                # Desktop and narrow Playwright journeys
├── docs/                     # Product, architecture, API, safety, and runbook docs
└── feature_list.json         # Dependency-ordered feature status and evidence
```

## AI features

QuestFit is designed as an **AI-assisted, validated compilation system**, not an unconstrained text generator:

1. A deterministic policy selects safe, goal-aware movements, order, intensity, targets, and recovery.
2. Structured plan and blueprint data pass through Zod validation before they can become a mission.
3. The level mapping turns exercises into compatible game encounters—for example, squats become collapsing lava steps.
4. MediaPipe observes movement locally, while deterministic application logic calculates verified repetitions and rewards.
5. Coaching language is constrained to calculated session facts and has a deterministic fallback.

The current server route uses deterministic planning. External model-backed plan phrasing or blueprint generation is an extension point, not a live-provider claim in this build. See the [API reference](docs/API.md) for the validated request and failure boundary.

## Roadmap

- Complete two clean-profile, real-camera hackathon rehearsals and record physical usability evidence.
- Add optional server-side AI provider adapters behind the existing validation and fallback boundary.
- Add Supabase authentication, guest conversion, synchronized progress, history, and leaderboard with tested row-level security.
- Expand adventure themes, mission environments, and movement-aware encounters.
- Broaden device/browser performance testing and physical camera-loss recovery evidence.
- Publish a hosted demo, screenshots, contribution guidelines, and release automation.

## Known limitations

- The release target is a desktop-first hackathon MVP verified primarily in current Google Chrome; broad browser and mobile-device support is not yet claimed.
- Accounts, remote synchronization, history, and leaderboard are intentionally unavailable; guest profile, calibration, and latest-session continuity are local.
- The current planner is deterministic. No external AI provider is configured or presented as live.
- Camera recognition quality depends on lighting, full-body framing, available movement space, and device performance.
- Browser and device audio policies may block automatic music; the mission exposes an explicit play/mute control when needed.
- Automated camera denial, loss, retry, and cleanup paths pass, but a physical unplug/revoke-and-retry observation remains deferred.
- The current dependency audit reports two moderate-severity findings.

## Contributors

QuestFit is currently maintained in the [stran1023/questfit](https://github.com/stran1023/questfit) repository.

Contributions are welcome once the project publishes its contribution process.

> **TODO:** Add `CONTRIBUTING.md`, a code of conduct, issue templates, and a maintained contributor list.

## License

No license has been selected or added to the repository yet. All rights remain with the project owner unless stated otherwise.

> **TODO:** Choose an open-source license and add a root `LICENSE` file before distributing or accepting external contributions.
