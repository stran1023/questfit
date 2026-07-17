# AGENTS.md

## Project

AI Fitness Escape is a browser-based fitness adventure where AI
generates personalized workouts and converts them into playable
missions.

## Tech Stack

-   Next.js 15
-   React
-   TypeScript
-   Tailwind CSS
-   Phaser 3
-   MediaPipe Pose
-   Supabase
-   Zustand
-   Zod
-   Vitest
-   Playwright

## Required Reading Order

1.  docs/PRD.md
2.  docs/SYSTEM_DESIGN.md
3.  docs/UI_BUILD_PLAN.md
4.  docs/ENGINEERING_BLUEPRINT.md
5.  docs/DATA_CONTRACTS.md
6.  docs/DATABASE_SCHEMA.md
7.  TASKS.md

## Architecture Rules

-   React manages UI.
-   Phaser owns rendering and game loop.
-   MediaPipe runs independently.
-   Never store raw pose landmarks in global React state.
-   Metrics Analyzer and Recommendation Engine are deterministic.
-   LLMs only generate workout plans, level blueprints and coaching
    text.

## Done Criteria

-   Lint passes
-   Typecheck passes
-   Tests pass
-   Build succeeds
