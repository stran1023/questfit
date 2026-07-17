# AI Fitness Escape --- UI Build Plan (Direction 2)

## Purpose

Design a browser-first experience where **AI generates a personalized
workout and transforms it into a playable adventure**. The UI should
make users feel they are starting a mission---not simply launching an
endless runner.

------------------------------------------------------------------------

# Design Principles

1.  **AI First** -- Make the Workout Planner AI and AI Coach visible.
2.  **Adventure First** -- Every workout feels like a mission.
3.  **Movement First** -- Exercise feedback must remain readable from
    several feet away.
4.  **Minimal HUD** -- Show only essential gameplay information.
5.  **Reward Progress** -- XP, streaks, levels and achievements motivate
    return visits.

------------------------------------------------------------------------

# User Journey

``` text
Home
 ↓
AI Workout Generator
 ↓
Adventure Briefing
 ↓
Calibration
 ↓
Gameplay
 ↓
Mission Complete
 ↓
AI Coach
 ↓
Leaderboard / Profile
```

------------------------------------------------------------------------

# Visual Identity

## Global Theme (AI Layer)

Background: Deep Navy (#0F172A)

Surface: Slate (#1E293B)

Primary: Blue (#3B82F6)

Success: Emerald (#10B981)

Reward: Gold (#F59E0B)

Danger: Red (#EF4444)

Text: White (#F8FAFC)

Muted: Slate Gray (#94A3B8)

Use this theme for: - Home - Profile - Leaderboard - Workout Generator -
AI Coach

## Adventure Themes

The generated level controls the environment palette.

### Volcano Escape

-   Lava Orange
-   Ember Red
-   Charcoal
-   Gold

### Frozen Mountain

-   Ice Blue
-   White
-   Cyan

### Ancient Temple

-   Sandstone
-   Emerald
-   Gold

### Space Station

-   Indigo
-   Purple
-   Neon Blue

The application remains visually consistent while each mission feels
unique.

------------------------------------------------------------------------

# Screen Specifications

## 1. Home

Shows

-   Daily streak
-   Current level
-   XP
-   Weekly ranking
-   Continue mission
-   Start new adventure

Primary CTA

**Generate Today's Adventure**

------------------------------------------------------------------------

## 2. AI Workout Generator

Inputs

-   Goal
-   Available time
-   Fitness level

Loading animation

``` text
Analyzing performance...
Planning workout...
Building adventure...
```

This screen should visually emphasize AI thinking.

------------------------------------------------------------------------

## 3. Adventure Briefing

Display as a collectible Adventure Card.

Includes

-   Mission artwork
-   Theme
-   Estimated duration
-   Difficulty
-   Exercise objectives
-   Rewards
-   Begin Mission button

Example objectives

-   Squat ×12
-   Jump ×8
-   High Knees ×20 sec

------------------------------------------------------------------------

## 4. Calibration

Keep existing calibration flow.

Rename to

**Prepare for Mission**

Requirements

-   Camera permission
-   Body framing
-   Exercise calibration
-   Local processing notice

------------------------------------------------------------------------

## 5. Gameplay

Desktop layout

35% Pose Panel

65% Game

HUD

-   Mission progress
-   Current objective
-   Combo
-   XP
-   Danger indicator

Bottom objective panel

``` text
Next Objective

Open Stone Gate

Squats

8 / 12
```

The environment---not the character animation---communicates exercise
meaning.

------------------------------------------------------------------------

## 6. Mission Complete

Replace Game Over with

Mission Complete

Display

-   Mission success
-   XP earned
-   Accuracy
-   Completion rate
-   Rewards
-   Continue button

------------------------------------------------------------------------

## 7. AI Coach

Summarize

-   Strengths
-   Weakest exercise
-   Workout consistency
-   AI recommendation

CTA

Start Tomorrow's Adventure

------------------------------------------------------------------------

## 8. Leaderboard

Tabs

-   Weekly
-   Personal Best
-   Friends (Future)

Display

Avatar

Level

XP

Current Streak

------------------------------------------------------------------------

## 9. Profile

Statistics

-   Current level
-   Total XP
-   Longest streak
-   Completed adventures
-   Accuracy
-   Workout history

------------------------------------------------------------------------

# Component Library

Navigation

-   Sidebar
-   Top navigation
-   Adventure card
-   Progress card

Gameplay

-   Pose panel
-   HUD
-   Objective card
-   Combo badge
-   Reward popup

Profile

-   Statistic card
-   Achievement badge
-   Leaderboard row

------------------------------------------------------------------------

# Animation Guidelines

AI

-   Blue glow
-   Soft particles
-   Progress pulse

Gameplay

-   Camera shake
-   Hit flash
-   Motion trails
-   Reward burst

Rewards

-   Gold sparkle
-   XP animation
-   Level-up celebration

------------------------------------------------------------------------

# Responsive Strategy

Desktop

-   Sidebar + content
-   35/65 gameplay split

Tablet

-   Compact sidebar
-   Stacked gameplay

Mobile

-   Vertical layout
-   Camera above game
-   Simplified HUD

------------------------------------------------------------------------

# Asset Strategy

Use Phaser sprite sheets.

Create reusable assets for

-   Character
-   Monsters
-   Adventure environments
-   Obstacles
-   Effects
-   UI icons

Keep art style consistent across all adventures.

------------------------------------------------------------------------

# MVP Build Order

1.  Design System
2.  Home
3.  Authentication
4.  AI Workout Generator
5.  Adventure Briefing
6.  Calibration
7.  Gameplay
8.  Mission Complete
9.  AI Coach
10. Leaderboard
11. Profile
12. Polish

------------------------------------------------------------------------

# Future UI

-   Seasonal themes
-   Daily missions
-   Equipment
-   Achievement gallery
-   Battle pass
-   Multiplayer lobby
-   Guilds
-   Social challenges

The UI should always communicate one message:

> AI creates your next fitness adventure, while your body brings it to
> life.
