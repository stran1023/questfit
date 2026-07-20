// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validAdventureBlueprintFixture, validWorkoutPlanFixture } from "@/contracts";
import AdventureBriefing from "./AdventureBriefing";
import { savePlanningRequest, savePlanningResult } from "./planningJourney";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const request = { goal: "general" as const, durationMinutes: 10 as const, fitnessLevel: "beginner" as const, activityFrequency: "weekly" as const, movementLimitations: "" };
const result = { source: "personalized" as const, workout: validWorkoutPlanFixture, adventure: validAdventureBlueprintFixture, rationale: { summary: "A balanced standing route.", intensity: "moderate" as const, reasons: ["Goal-aware stages.", "Movement-safe route."], phases: validWorkoutPlanFixture.exercises.map((exercise,index) => ({ exerciseId: exercise.id, phase: (index===0?"warm-up":index===validWorkoutPlanFixture.exercises.length-1?"peak":"build") as "warm-up"|"build"|"peak" })), cooldown: { durationSeconds: 15, steps: ["Slow march","Release shoulders","Three calm breaths"] } }, notice: null };

describe("AdventureBriefing", () => {
  beforeEach(() => { sessionStorage.clear(); savePlanningRequest(sessionStorage,request); savePlanningResult(sessionStorage,result); });
  afterEach(cleanup);

  it("shows a scannable overview, one primary action, and optional details", async () => {
    const user = userEvent.setup();
    render(<AdventureBriefing />);
    expect(await screen.findByRole("heading", { name: result.adventure.title })).toBeVisible();
    expect(screen.getAllByText("Duration").length).toBeGreaterThan(0);
    expect(screen.getByText("Difficulty")).toBeVisible();
    expect(screen.getByText("Reward")).toBeVisible();
    expect(screen.getAllByText("Ash Titan").length).toBeGreaterThan(0);
    expect(screen.getByText("Storm Gate")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Start Adventure" })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "How your mission was built" })).not.toBeVisible();
    expect(screen.getByRole("heading", { name: "Why this plan fits" })).toBeVisible();
    expect(screen.getAllByText("10 min").length).toBeGreaterThan(0);
    expect(screen.getByText("beginner")).toBeVisible();
    await user.click(screen.getByText("Mission details"));
    await waitFor(() => expect(screen.getByRole("heading", { name: "How your mission was built" })).toBeVisible());
  });
});
