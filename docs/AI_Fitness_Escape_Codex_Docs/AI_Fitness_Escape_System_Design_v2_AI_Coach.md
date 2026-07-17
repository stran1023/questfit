# AI Fitness Escape --- System Design v2 (Updated AI Coach Architecture)

## Overview

This document updates the AI Coach architecture to separate
**analytics**, **decision making**, and **language generation**. The
goal is to build a reliable, explainable MVP while still showcasing AI.

------------------------------------------------------------------------

# High-Level Architecture

``` text
                User
                  │
                  ▼
        Workout Planner AI
                  │
          Workout JSON
                  │
                  ▼
          Level Compiler AI
                  │
        Adventure Blueprint
                  │
                  ▼
        Phaser Game Runtime
                  │
      Pose Engine (MediaPipe)
                  │
        Session Metrics
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
 Metrics Analyzer    Supabase Storage
        │
        ▼
 Recommendation Engine
        │
        ▼
      LLM Coach
        │
        ▼
 Personalized Session Recap
```

------------------------------------------------------------------------

# AI Systems

## AI System 1 --- Workout Planner

### Inputs

-   Fitness level
-   Goal
-   Available session length
-   Recent performance
-   Target difficulty

### Output

Structured Workout JSON

Responsibilities:

-   Select exercises
-   Balance intensity
-   Estimate duration
-   Generate warm-up and cool-down

------------------------------------------------------------------------

## AI System 2 --- Level Compiler

Converts a workout into a playable adventure.

### Input

Workout JSON

### Output

Adventure Blueprint JSON

Responsibilities

-   Choose world/theme
-   Map exercises to gameplay templates
-   Generate mission flow
-   Pace rewards and difficulty

------------------------------------------------------------------------

## Pose Engine (Not AI Planning)

Technology

-   MediaPipe Pose

Responsibilities

-   Detect exercises
-   Count repetitions
-   Track holds
-   Estimate confidence
-   Emit movement events

Output example

``` json
{
  "exercise":"Squat",
  "status":"completed",
  "confidence":0.93,
  "timestamp":1720000000
}
```

------------------------------------------------------------------------

# AI Coach Architecture

The AI Coach is intentionally split into three components.

## 1. Metrics Analyzer

**Technology:** TypeScript (deterministic logic)

Input

-   Workout plan
-   Session metrics
-   Pose confidence
-   Historical sessions

Responsibilities

-   Completion rate
-   Accuracy
-   XP calculation
-   Streak calculation
-   Best exercise
-   Weakest exercise
-   Performance comparison

Output

``` json
{
  "completionRate":92,
  "accuracy":95,
  "bestExercise":"Jump",
  "weakestExercise":"Squat",
  "improved":true
}
```

No LLM is used here.

------------------------------------------------------------------------

## 2. Recommendation Engine

**Technology:** TypeScript rule engine

Responsibilities

-   Decide next workout difficulty
-   Adjust exercise volume
-   Recommend focus areas

Example rules

``` text
Completion < 60%
→ Reduce difficulty

Completion > 90% AND Accuracy > 90%
→ Increase challenge

Low squat accuracy
→ Schedule more squat practice
```

Output

``` json
{
  "difficulty":"same",
  "focus":"Lower Body",
  "recommendation":"Increase squat volume slightly"
}
```

Again, no LLM is required.

------------------------------------------------------------------------

## 3. LLM Coach

The LLM does **not** calculate metrics.

Instead, it receives structured facts and converts them into a friendly
coaching message.

Input

``` json
{
  "completionRate":92,
  "accuracy":95,
  "bestExercise":"Jump",
  "weakestExercise":"Squat",
  "recommendation":"Maintain current difficulty and add more squats."
}
```

Output

``` text
Great work today!

You completed almost every challenge and showed excellent consistency on jumps.
Squats were the most challenging exercise, so tomorrow's adventure will include a few more lower-body challenges while keeping the overall difficulty similar.
```

Responsibilities

-   Natural-language recap
-   Motivation
-   Positive reinforcement
-   Explain recommendations

------------------------------------------------------------------------

# Why This Architecture?

  Component               Technology   Purpose
  ----------------------- ------------ ---------------------------------
  Workout Planner         LLM          Generate workout plan
  Level Compiler          LLM          Convert workout into adventure
  Pose Engine             MediaPipe    Detect movements
  Metrics Analyzer        TypeScript   Calculate objective metrics
  Recommendation Engine   TypeScript   Make deterministic decisions
  LLM Coach               LLM          Communicate insights naturally
  Supabase                PostgreSQL   Store progress, scores, streaks

------------------------------------------------------------------------

# Why Not Use an LLM for Everything?

Advantages of the hybrid approach:

-   Objective metrics remain accurate.
-   Easier to test and debug.
-   Lower inference cost.
-   Faster responses.
-   Less risk of hallucinated fitness advice.
-   AI is focused where it adds the most value: planning and
    communication.

------------------------------------------------------------------------

# MVP AI Flow

``` text
Workout Planner AI
        │
Workout
        │
Level Compiler
        │
Adventure
        │
Gameplay
        │
Session Metrics
        │
Metrics Analyzer
        │
Recommendation Engine
        │
LLM Coach
        │
Session Summary
        │
Supabase
```

This architecture keeps the MVP simple while making every AI component
clearly explainable to hackathon judges.
