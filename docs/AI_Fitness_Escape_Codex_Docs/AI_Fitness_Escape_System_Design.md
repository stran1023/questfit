# AI Fitness Escape --- System Design Document

## 1. High-Level Architecture

``` text
Frontend (Next.js)
        |
        v
Workout Planner AI
        |
Workout JSON
        |
Level Compiler
        |
Blueprint JSON
        |
Phaser Game Runtime <------ MediaPipe Pose Engine
        |
Session Metrics
        |
Supabase Backend
        |
AI Coach
```

## 2. Components

### Frontend

-   Next.js
-   Tailwind CSS
-   Zustand
-   Authentication UI
-   Dashboard

### Game Runtime

-   Phaser
-   Reads blueprint JSON
-   Executes challenges
-   Handles scoring and rewards

### Pose Engine

-   MediaPipe Pose
-   Detects exercises
-   Emits movement events
-   Calculates confidence

### Backend (Supabase)

-   Auth
-   PostgreSQL
-   Storage
-   Optional Realtime
-   Row-Level Security

## 3. Data Flow

1.  User requests workout.
2.  Workout Planner AI returns Workout JSON.
3.  Level Compiler converts it into Blueprint JSON.
4.  Phaser loads blueprint.
5.  Pose Engine validates player movements.
6.  Runtime updates score.
7.  Session metrics are sent to Supabase.
8.  AI Coach generates recap.

## 4. Core Database Tables

-   profiles
-   workout_sessions
-   game_scores
-   user_progress
-   daily_activity

## 5. API Contracts

### Workout Planner Output

``` json
{
  "goal":"strength",
  "duration":20,
  "exercises":[
    {"name":"Squat","reps":10},
    {"name":"Jump","reps":8}
  ]
}
```

### Level Compiler Output

``` json
{
  "theme":"Volcano Escape",
  "segments":[
    {
      "exercise":"Squat",
      "challenge":"Open Stone Gate",
      "targetReps":10
    }
  ]
}
```

### Movement Event

``` json
{
  "exercise":"Squat",
  "status":"completed",
  "confidence":0.94,
  "timestamp":123456789
}
```

## 6. Security

-   Server-side score validation
-   Row-Level Security
-   Guest data isolated
-   Webcam processed locally

## 7. Deployment

-   Frontend: Vercel
-   Backend: Supabase
-   Pose detection: Browser
-   CDN for assets

## 8. Future Architecture

-   Multiplayer
-   Daily AI-generated adventures
-   Seasonal leaderboards
-   AI form correction
-   Wearable integration
