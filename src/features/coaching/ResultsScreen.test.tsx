// @vitest-environment happy-dom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { validAdventureBlueprintFixture as adventure, validWorkoutPlanFixture as workout } from "@/contracts";
import ResultsScreen from "./ResultsScreen";
import { loadSessionResult, saveSessionResult } from "./sessionResultRepository";

afterEach(() => { cleanup(); sessionStorage.clear(); vi.restoreAllMocks(); });

describe("session results", () => {
  it("rejects corrupt stored results", () => {
    sessionStorage.setItem("ai-fitness-escape:latest-result:v1", "{}");
    expect(loadSessionResult()).toBeNull();
  });

  it("renders authoritative metrics and clearly labels fallback coaching", async () => {
    const completedByExercise = Object.fromEntries(workout.exercises.map((exercise) => [exercise.id, exercise.target]));
    const result = saveSessionResult(workout, adventure, { completedByExercise, missedEvents: 1 });
    render(<ResultsScreen />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Mission complete" })).toBeInTheDocument());
    expect(screen.getByText(`${result.metrics.completedTargets}/${result.metrics.plannedTargets}`)).toBeInTheDocument();
    expect(screen.getByText(`${result.metrics.accuracy}%`)).toBeInTheDocument();
    expect(screen.getByText("Coach recap · deterministic fallback")).toBeInTheDocument();
  });

  it("keeps completed results in memory and explains the limitation when storage fails", async () => {
    vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    const completedByExercise = Object.fromEntries(workout.exercises.map((exercise) => [exercise.id, exercise.target]));
    const result = saveSessionResult(workout, adventure, { completedByExercise, missedEvents: 0 });
    expect(result.persistence).toBe("memory");
    render(<ResultsScreen />);
    expect(await screen.findByRole("status")).toHaveTextContent("results last only until this page is closed");
    expect(screen.getByText(`${result.metrics.completedTargets}/${result.metrics.plannedTargets}`)).toBeVisible();
  });
});
