import { describe, expect, it, vi } from "vitest";
import { validAdventureBlueprintFixture as adventure, validWorkoutPlanFixture as workout } from "@/contracts";
import { analyzeSession, recommendNextSession } from "./sessionAnalysis";
import { generateCoachSummary } from "./coachService";

describe("deterministic session analysis", () => {
  it("calculates completion, accuracy, XP, best movement, and mastery", () => {
    const completedByExercise = Object.fromEntries(workout.exercises.map((exercise) => [exercise.id, exercise.target]));
    const metrics = analyzeSession(workout, adventure, { completedByExercise, missedEvents: 1 });
    expect(metrics).toMatchObject({ completionRate: 100, bestExercise: workout.exercises[0].movement, focusExercise: null });
    expect(metrics.accuracy).toBeGreaterThanOrEqual(90);
    expect(metrics.xpEarned).toBe(metrics.completedTargets * 10 + adventure.rewards.baseXp);
    expect(recommendNextSession(metrics)).toMatchObject({ difficulty: "increase", reasonCode: "HIGH_MASTERY" });
  });

  it("selects the weakest planned movement and applies recommendation boundaries", () => {
    const first = workout.exercises[0];
    const low = analyzeSession(workout, adventure, { completedByExercise: { [first.id]: first.target }, missedEvents: 8 });
    expect(low.focusExercise).toBe(workout.exercises[1].movement);
    expect(recommendNextSession(low)).toMatchObject({ difficulty: "decrease", reasonCode: "LOW_COMPLETION" });
    const focused = { ...low, completionRate: 80 };
    expect(recommendNextSession(focused)).toMatchObject({ difficulty: "maintain", reasonCode: "FOCUS_MOVEMENT" });
  });

  it("keeps facts authoritative and falls back on invalid output or timeout", async () => {
    const metrics = analyzeSession(workout, adventure, { completedByExercise: {}, missedEvents: 0 });
    const facts = { metrics, recommendation: recommendNextSession(metrics) };
    const invalid = await generateCoachSummary(facts, vi.fn().mockResolvedValue({ headline: "Invented" }));
    expect(invalid.source).toBe("fallback");
    expect(invalid.summary.summary).toContain(`${metrics.completedTargets} of ${metrics.plannedTargets}`);
    const timeout = await generateCoachSummary(facts, () => new Promise(() => undefined), 1);
    expect(timeout.source).toBe("fallback");
  });

  it("allows provider tone without allowing provider facts or recommendations", async () => {
    const metrics = analyzeSession(workout, adventure, { completedByExercise: {}, missedEvents: 0 });
    const facts = { metrics, recommendation: recommendNextSession(metrics) };
    const generated = await generateCoachSummary(facts, async () => ({
      headline: "A fresh start",
      summary: "You completed 999 targets.",
      recommendation: "Attempt the highest difficulty.",
    }));
    expect(generated.source).toBe("provider");
    expect(generated.summary.headline).toBe("A fresh start");
    expect(generated.summary.summary).toContain(`${metrics.completedTargets} of ${metrics.plannedTargets}`);
    expect(generated.summary.recommendation).toContain(facts.recommendation.difficulty);
    expect(generated.summary.summary).not.toContain("999");
  });
});
