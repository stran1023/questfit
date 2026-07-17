# AI Fitness Escape --- Direction 2 (AI Workout → Game)

## Vision

An AI-powered fitness adventure where **AI generates a personalized
workout and transforms it into a playable game level**. The player's
body is the controller, and each completed exercise progresses the
story.

------------------------------------------------------------------------

# Core Concept

Instead of mapping exercises directly to character actions, the game
maps exercises to **gameplay challenges**.

Example:

-   Squats → Open a stone gate
-   Jumps → Cross broken platforms
-   High Knees → Escape a lava wave
-   Plank → Hold a collapsing bridge
-   Push-ups → Break a barrier
-   Punches → Defeat enemies

The character only needs a small animation set (run, jump, slide,
attack, victory), while the environment gives each exercise meaning.

------------------------------------------------------------------------

# System Architecture

    User
       ↓
    Workout Planner AI
       ↓
    Workout JSON
       ↓
    Level Compiler
       ↓
    Level Blueprint JSON
       ↓
    Game Runtime (Phaser)
       ↑
    Pose Engine (MediaPipe)
       ↓
    Performance Metrics
       ↓
    AI Coach

## A. Workout Planner AI

### Inputs

-   User fitness level
-   Recent performance
-   Session length
-   Goal
-   Target difficulty

### Output

Structured Workout JSON

-   Warm-up
-   Main workout
-   Cool-down
-   Exercise mix
-   Intensity
-   Estimated duration

------------------------------------------------------------------------

## B. Level Compiler

Converts the workout into gameplay.

### Input

Workout JSON

### Output

Level Blueprint JSON

Contains:

-   Theme
-   Story
-   Challenge sequence
-   Exercise mapping
-   Rewards
-   Difficulty pacing

Example:

-   Volcano Escape
-   Space Station
-   Ancient Temple
-   Frozen Mountain

Each workout can become a completely different adventure.

------------------------------------------------------------------------

## C. Pose & Movement Engine

Technology:

-   MediaPipe Pose

Outputs:

-   Exercise detected
-   Rep completed
-   Hold timer
-   Confidence score
-   Incorrect movement detection

Runs entirely in the browser.

------------------------------------------------------------------------

## D. Game Runtime

Technology:

-   Phaser

Responsibilities:

-   Render game
-   Read Level Blueprint
-   Spawn challenges
-   Handle animations
-   Score system
-   Combo system
-   Dynamic difficulty
-   Reward player

------------------------------------------------------------------------

## E. AI Coach

Analyzes:

-   Workout completion
-   Form confidence
-   Missed exercises
-   Accuracy
-   Consistency

Generates:

-   Workout summary
-   Personalized advice
-   Next workout recommendation

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS

## Game

-   Phaser

## Pose Detection

-   MediaPipe Pose

## Backend

-   Supabase

### Services

-   Authentication
-   PostgreSQL
-   Row Level Security
-   Realtime (optional)
-   Storage

------------------------------------------------------------------------

# Database

Core tables

-   profiles
-   workout_sessions
-   game_scores
-   daily_activity
-   user_progress

Features:

-   Weekly leaderboard
-   Personal best
-   XP
-   Daily streak
-   Workout history

------------------------------------------------------------------------

# Authentication

MVP

-   Google Sign-in
-   Guest Mode

Guest users can play immediately.

After the first workout, encourage account creation to save:

-   Progress
-   XP
-   Streak
-   Leaderboard ranking

------------------------------------------------------------------------

# Gameplay Flow

1.  Login / Guest
2.  AI generates workout
3.  Level Compiler creates adventure
4.  Calibration
5.  Play workout
6.  Pose Engine validates movements
7.  Complete level
8.  AI Coach summarizes session
9.  Save progress to Supabase

------------------------------------------------------------------------

# Why This Direction

Instead of:

"Temple Run controlled by your body"

The project becomes:

**An AI platform that converts personalized workouts into interactive
game adventures.**

This highlights multiple AI components working together while keeping
gameplay simple and scalable.

------------------------------------------------------------------------

# Future Roadmap

-   Multiple themes and worlds
-   Boss battles
-   More exercise support
-   Seasonal events
-   Achievements
-   Friends leaderboard
-   AI posture correction
-   Adaptive workout generation
-   Multiplayer challenges
