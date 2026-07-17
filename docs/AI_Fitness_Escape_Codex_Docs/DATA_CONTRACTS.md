# Data Contracts

## WorkoutPlan

``` ts
id:string
goal:string
durationMinutes:number
difficulty:number
exercises:[]
```

## AdventureBlueprint

``` ts
theme:string
missions:[]
rewards:[]
```

## SessionMetrics

``` ts
completionRate:number
accuracy:number
bestExercise:string
weakestExercise:string
xp:number
```

## CoachSummary

``` ts
headline:string
summary:string
recommendation:string
```

All AI outputs must validate with Zod before use.
