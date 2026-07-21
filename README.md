# QuestFit

### Your body. Your adventure.

[![Version](https://img.shields.io/badge/version-0.1.0-ff6b35)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-110%20passing-31c48d)](#quality-and-verification)
[![License](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)

QuestFit turns a home workout into a body-controlled fantasy adventure. It builds a goal-aware exercise plan, compiles each movement into a game challenge, recognizes completed movements locally through the webcam, and rewards the player with deterministic results and coaching.

The current hackathon experience is a complete guest journey through **Volcano Escape**: prepare with Scout, follow a warm-up-to-peak workout, attack and dodge the Ash Titan, escape through the Storm Gate, cool down, and review the session—all in the browser.

The development team collaborated with **GPT-5.6** for product exploration and technical decision support, and used **Codex** as a repository-aware engineering accelerator. The team retained ownership of the product direction, architecture, safety boundaries, acceptance criteria, and every final implementation decision.

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

**[Launch the live QuestFit demo](https://questfit-adventure.vercel.app)**

For the complete presenter sequence, expected behavior, recovery paths, and claim boundaries, see the [demo runbook](docs/DEMO_RUNBOOK.md).

> [!NOTE]
> The live demo uses HTTPS so supported browsers can request webcam access. A permanent screenshot gallery has not been published yet.

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

## AI Development Workflow

QuestFit was developed through a deliberate collaboration between the development team, GPT-5.6, and Codex. AI shortened the distance between an idea and a testable implementation, but it did not replace engineering judgment or make unsupervised product decisions.

### From inspiration to a focused concept

We used **GPT-5.6** as a product and design thought partner while evolving the original endless-runner prototype into QuestFit. It helped us:

- Compare possible hackathon directions and focus on a personalized workout-to-adventure experience.
- Refine the core pitch from “pose detection attached to a game” into a visible **profile → policy → validated plan → game blueprint → pose events → deterministic results** pipeline.
- Explore the hybrid visual direction: a modern fitness interface outside missions and a cinematic fantasy world during play.
- Design the warm-up, build, surge, peak, and cooldown journey instead of presenting a flat list of exercises.
- Turn exercise counting into direct story actions, including attacking, blocking, and dodging the Ash Titan.
- Reduce the Adventure Briefing into a ten-second visual scan and introduce Scout as a recurring guide.
- Review trade-offs, challenge assumptions, improve submission language, and keep the value proposition understandable to non-technical judges.

These conversations produced options and critiques. The team selected the final concept, decided what fit the hackathon scope, and rejected ideas that weakened reliability, privacy, or demo clarity.

### Where Codex accelerated implementation

We used **Codex** as a repository-aware coding collaborator throughout implementation. It inspected the existing code and architecture, proposed scoped changes, edited the project, ran verification, and iterated on failures. Concrete contributions included:

- Migrating the prototype into a typed Next.js App Router application while preserving proven calibration and movement logic.
- Generating route and component boilerplate for onboarding, planning, AI to Action, briefing, preparation, mission, cooldown, and results.
- Building Zod contracts and validation paths for workout plans, adventure blueprints, route handoffs, movement events, sessions, and coaching summaries.
- Refactoring the planning experience from an inline result into the explicit `/plan` → `/ai-to-action` → `/briefing` flow with retry and fail-closed session handoff.
- Implementing and refining movement detectors, the mission controller, Phaser presentation adapters, Scout, the Ash Titan encounter, procedural audio, and responsive UI states.
- Creating regression tests and expanding the verification gate to cover core pose logic, unit and component behavior, desktop/narrow Playwright journeys, strict type checking, linting, and production builds.
- Diagnosing integration defects, including early camera-loss event ordering, in-flight MediaPipe initialization cleanup, stale voice cues, mission-to-results teardown, and encounter transition ordering.
- Refactoring repeated encounter language into shared contracts so the planner, briefing, voice assistant, React HUD, and Phaser scene remain consistent.
- Synchronizing product, architecture, safety, runbook, handoff, and public documentation with verified behavior.

Codex made iteration faster because it could move from repository inspection to implementation and verification in one workflow. For example, the team could evaluate a scannable briefing concept, implement its responsive cards and progressive disclosure, add focused tests, run the full browser journey, and refine the result within the same development cycle.

### Key decisions and why we made them

| Decision | Alternative considered | Why the team chose it |
| --- | --- | --- |
| Deterministic workout policy with validated AI boundaries | Let an LLM freely select exercises, targets, and intensity | Exercise eligibility, progression, limitations, and recovery need predictable and testable rules. AI can assist with generation and language but cannot override safety policy. |
| On-device MediaPipe inference | Upload webcam frames for server-side analysis | Local processing improves responsiveness and keeps video frames and raw landmarks off the network. |
| Independent React, MediaPipe, mission-controller, and Phaser responsibilities | Put pose input, rendering, and scoring into one game loop | Separation prevents presentation code from awarding repetitions, keeps React out of per-frame updates, and makes gameplay facts reproducible. |
| Zod validation at every AI and route boundary | Trust generated JSON or browser storage | Model output and stored session data are untrusted until their shape and compatibility are verified. |
| Guest-local hackathon journey | Rush unfinished authentication and cloud persistence into the demo | A reliable complete mission offered more value than partially working breadth. Supabase remains a post-demo feature requiring tested row-level security. |
| Explicit Plan → AI to Action → Briefing routes | Generate and display everything on one crowded page | The separated flow makes AI work visible, improves error recovery, and lets users scan the final mission before camera preparation. |
| Deterministic metrics and recommendations | Ask an LLM to calculate accuracy, XP, or fitness conclusions | Scores must be repeatable and grounded in verified movement events; generated wording cannot alter authoritative facts. |
| Procedural Web Audio with an honest fallback control | Depend on a streamed soundtrack or assume autoplay | Procedural audio avoids network and licensing risk, while the play/mute control respects browser and device policy. |

GPT-5.6 helped us examine these alternatives and articulate their trade-offs. Codex helped encode the selected decisions into contracts, tests, components, and documentation. **The development team made and approved each decision.**

### Human ownership, review, and safety

AI served as an accelerator—not an autonomous developer. The team remained responsible for:

- Defining product goals and deciding which ideas entered the judged experience.
- Approving architecture, dependency boundaries, and data ownership.
- Protecting webcam privacy and rejecting raw-frame or landmark uploads.
- Defining deterministic scoring, safety rules, and non-medical claim boundaries.
- Reviewing generated changes and resolving implementation trade-offs.
- Testing real movement behavior and deciding whether evidence was sufficient.
- Keeping unsupported AI, authentication, persistence, or device claims out of the demo.
- Running the complete verification gate before accepting changes.

This workflow taught us that AI development is most effective when suggestions are constrained by explicit architecture, observable acceptance criteria, and automated checks. GPT-5.6 increased the breadth and speed of exploration; Codex increased implementation and testing velocity; human review kept the result coherent, safe, and honest.

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
- Publish permanent screenshots and expand release automation.
- Continue using GPT-5.6 for evaluated product experiments and Codex for test-backed implementation, while retaining human approval for architecture, safety, and release decisions.

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

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request, follow the [Code of Conduct](CODE_OF_CONDUCT.md), and see [CONTRIBUTORS.md](CONTRIBUTORS.md) for project recognition.

Use the structured [bug report](https://github.com/stran1023/questfit/issues/new?template=bug_report.yml) and [feature request](https://github.com/stran1023/questfit/issues/new?template=feature_request.yml) forms when opening an issue.

## License

QuestFit is available under the [MIT License](LICENSE).
