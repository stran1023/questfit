# Database Schema

## profiles

-   id
-   display_name
-   level
-   xp
-   streak

## workout_sessions

-   id
-   profile_id
-   workout_plan_id
-   duration
-   completion_rate
-   accuracy
-   xp_earned

## workout_plans

-   id
-   goal
-   difficulty
-   duration

## coach_summaries

-   id
-   session_id
-   summary

Use Row Level Security for all user-owned tables.
