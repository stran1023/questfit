import {
  recommendationSchema,
  sessionMetricsSchema,
  type AdventureBlueprint,
  type Recommendation,
  type SessionMetrics,
  type WorkoutPlan,
} from "@/contracts";

export type SessionPerformance = {
  completedByExercise: Readonly<Record<string, number>>;
  missedEvents: number;
};

export function analyzeSession(
  workout: WorkoutPlan,
  adventure: AdventureBlueprint,
  performance: SessionPerformance,
): SessionMetrics {
  const plannedTargets = workout.exercises.reduce((sum, exercise) => sum + exercise.target, 0);
  const completedTargets = workout.exercises.reduce(
    (sum, exercise) => sum + Math.min(exercise.target, performance.completedByExercise[exercise.id] ?? 0),
    0,
  );
  const completionRate = plannedTargets ? Math.round((completedTargets / plannedTargets) * 100) : 0;
  const attempts = completedTargets + performance.missedEvents;
  const accuracy = attempts ? Math.round((completedTargets / attempts) * 100) : 0;
  const ranked = workout.exercises.map((exercise, index) => ({
    index,
    movement: exercise.movement,
    rate: exercise.target ? (performance.completedByExercise[exercise.id] ?? 0) / exercise.target : 0,
  }));
  const best = [...ranked].sort((a, b) => b.rate - a.rate || a.index - b.index)[0];
  const focus = [...ranked].sort((a, b) => a.rate - b.rate || a.index - b.index)[0];
  const baseXp = completedTargets * 10;
  const completionBonus = completionRate === 100 ? adventure.rewards.baseXp : 0;

  return sessionMetricsSchema.parse({
    plannedTargets,
    completedTargets,
    completionRate,
    accuracy,
    bestExercise: completedTargets ? best?.movement ?? null : null,
    focusExercise: focus && focus.rate < 1 ? focus.movement : null,
    xpEarned: baseXp + completionBonus,
  });
}

export function recommendNextSession(metrics: SessionMetrics): Recommendation {
  if (metrics.completionRate < 70) {
    return recommendationSchema.parse({ difficulty: "decrease", focusExercise: metrics.focusExercise, reasonCode: "LOW_COMPLETION" });
  }
  if (metrics.focusExercise) {
    return recommendationSchema.parse({ difficulty: "maintain", focusExercise: metrics.focusExercise, reasonCode: "FOCUS_MOVEMENT" });
  }
  if (metrics.completionRate >= 95 && metrics.accuracy >= 90) {
    return recommendationSchema.parse({ difficulty: "increase", focusExercise: null, reasonCode: "HIGH_MASTERY" });
  }
  return recommendationSchema.parse({ difficulty: "maintain", focusExercise: null, reasonCode: "STEADY_PROGRESS" });
}
