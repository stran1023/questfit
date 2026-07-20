# AGENTS.md

This repository contains QuestFit: a personalized workout-to-adventure product. Keep this file as a routing layer; durable product and engineering detail belongs in `docs/`.

## Startup Workflow

Before changing code:

1. Confirm the repository root with `pwd`.
2. Read `progress.md`, `session-handoff.md`, and `feature_list.json`.
3. Read `docs/ARCHITECTURE.md` and the active plan linked from `docs/PLANS.md`.
4. Read only the product, frontend, data, security, or reliability docs relevant to the active feature.
5. Run `./init.sh` on Bash or `./init.ps1` on PowerShell. Repair or record a failing baseline before adding scope.
6. Work on the single dependency-ready feature marked `in_progress`.

## Routing Map

- `docs/PRODUCT.md`: product promise, MVP scope, user journey, acceptance outcomes
- `docs/ARCHITECTURE.md`: target system map, ownership, dependency rules, migration boundaries
- `docs/FRONTEND.md`: screens, design system, responsive and accessibility rules
- `docs/DATA_MODEL.md`: validated contracts, persistence model, privacy boundaries
- `docs/API.md`: application-owned HTTP boundaries and fallback behavior
- `docs/PLANS.md`: plan policy and active-plan index
- `docs/QUALITY_SCORE.md`: current domain health and known gaps
- `docs/RELIABILITY.md`: bootstrap, verification, runtime targets, golden journeys
- `docs/SECURITY.md`: secrets, AI input, auth, database, and webcam safety

## Working Contract

### One Feature at a Time

- Preserve reusable code, components, utilities, and proven boundaries unless the active plan justifies replacement.
- Use one active feature. Do not start a dependency until its prerequisites are `passing`.
- React owns application UI; Phaser owns the game loop and world rendering; MediaPipe inference runs independently from both.
- Data flows through validated contracts. AI output is untrusted until it passes Zod validation.
- Objective metrics and recommendations are deterministic. LLMs generate plans, blueprints, and coaching language; they do not calculate authoritative scores.
- Never put raw pose landmarks or per-frame game state in global React state.
- Webcam frames and landmarks stay on-device. Do not upload them.
- UI code must call domain actions rather than mutating game, session, or persistence state directly.
- Record architectural decisions in the active plan; update `docs/ARCHITECTURE.md` when an accepted boundary changes.

## Definition of Done

A feature is `passing` only when its observable acceptance criteria are met, every listed verification command has run, evidence is recorded in `feature_list.json`, affected docs are current, and the standard verification path succeeds. Placeholders and inspection-only claims are not passing evidence.

Standard commands: `npm run verify` for the full gate, `npm test` for focused unit regression, `npm run lint`, `npm run typecheck`, and `npm run build`.

## End of Session

Before stopping, update the active plan, `feature_list.json`, `progress.md`, and `session-handoff.md` with actual commands, evidence, blockers, files changed, and one recommended next action. Update `docs/QUALITY_SCORE.md` when domain health changes. Leave the repository restartable.
