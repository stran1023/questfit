// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from "vitest";
import { validAdventureBlueprintFixture, validWorkoutPlanFixture } from "@/contracts";
import { loadPlanningRequest, loadPlanningResult, savePlanningRequest, savePlanningResult } from "./planningJourney";

const request = { goal: "general" as const, durationMinutes: 10 as const, fitnessLevel: "beginner" as const, activityFrequency: "weekly" as const, movementLimitations: "" };
const result = { source: "personalized" as const, workout: validWorkoutPlanFixture, adventure: validAdventureBlueprintFixture, rationale: { summary: "A balanced route.", intensity: "moderate" as const, reasons: ["Goal-aware stages.", "Movement-safe route."], phases: validWorkoutPlanFixture.exercises.map((exercise,index) => ({ exerciseId: exercise.id, phase: (index===0?"warm-up":index===validWorkoutPlanFixture.exercises.length-1?"peak":"build") as "warm-up"|"build"|"peak" })), cooldown: { durationSeconds: 15, steps: ["Slow march","Release shoulders","Three calm breaths"] } }, notice: null };

describe("planning journey storage", () => {
  beforeEach(() => sessionStorage.clear());
  it("round-trips validated request and generated result", () => { savePlanningRequest(sessionStorage,request); savePlanningResult(sessionStorage,result); expect(loadPlanningRequest(sessionStorage)).toEqual(request); expect(loadPlanningResult(sessionStorage)).toEqual(result); });
  it("fails closed for corrupt or cross-matched route data", () => { sessionStorage.setItem("ai-fitness-escape:planning-request-v1","not-json"); expect(loadPlanningRequest(sessionStorage)).toBeNull(); expect(() => savePlanningResult(sessionStorage,{...result,adventure:{...result.adventure,workoutPlanId:"other"}})).toThrow(); });
});
