# Engineering Blueprint

## Repository Structure

``` text
src/
 app/
 components/
 features/
   workout-planner/
   calibration/
   gameplay/
   coaching/
 game/
   scenes/
   entities/
   systems/
 lib/
 stores/
 types/
```

## Core Modules

-   Workout Planner AI
-   Level Compiler
-   Pose Engine
-   Metrics Analyzer
-   Recommendation Engine
-   LLM Coach

## API Routes

-   POST /api/workout/generate
-   POST /api/level/compile
-   POST /api/coach/summary

## State

Zustand stores: - auth - session - gameplay - profile

## Deployment

Frontend: Vercel Database/Auth: Supabase
