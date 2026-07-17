import { createFallbackAdventureBlueprint, createFallbackWorkoutPlan } from "./fallbacks";

export const validWorkoutPlanFixture = createFallbackWorkoutPlan("workout-fixture-v1");
export const validAdventureBlueprintFixture = createFallbackAdventureBlueprint(
  validWorkoutPlanFixture,
  "adventure-fixture-v1",
);
