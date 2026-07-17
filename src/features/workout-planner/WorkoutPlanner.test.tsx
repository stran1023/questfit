// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { validAdventureBlueprintFixture, validWorkoutPlanFixture } from "@/contracts";
import WorkoutPlanner from "./WorkoutPlanner";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const planningResponse = {
  source: "personalized" as const,
  workout: validWorkoutPlanFixture,
  adventure: validAdventureBlueprintFixture,
  notice: null,
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function successfulFetch() {
  return vi.fn<typeof fetch>(async () =>
    new Response(JSON.stringify(planningResponse), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

describe("WorkoutPlanner", () => {
  it("exposes the complete form through keyboard focus", async () => {
    const user = userEvent.setup();
    render(<WorkoutPlanner />);

    await user.tab();
    expect(screen.getByRole("link", { name: "AI Fitness Escape" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("combobox", { name: "Goal" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("radio", { name: "10 min" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "15 min" })).toBeChecked();
  });

  it("submits selected preferences and renders an understandable briefing", async () => {
    const fetchMock = successfulFetch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<WorkoutPlanner />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Goal" }), "strength");
    await user.click(screen.getByRole("radio", { name: "15 min" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Fitness level" }), "intermediate");
    await user.click(screen.getByRole("button", { name: "Generate my adventure" }));

    expect(await screen.findByRole("heading", { name: planningResponse.adventure.title })).toBeVisible();
    for (const objective of [
      /Jumping jacks × 4/,
      /Squats × 5/,
      /Left punches × 3/,
      /Right punches × 3/,
      /High knees × 6/,
      /Jumps × 3/,
    ]) {
      expect(screen.getByText(objective)).toBeVisible();
    }

    const submitted = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(submitted).toEqual({ goal: "strength", durationMinutes: 15, fitnessLevel: "intermediate" });
  });

  it("announces a request failure and retries without losing preferences", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("Network unavailable. Please retry."))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(planningResponse), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<WorkoutPlanner />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Goal" }), "cardio");
    await user.click(screen.getByRole("button", { name: "Generate my adventure" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Network unavailable");

    await user.click(screen.getByRole("button", { name: "Retry planning" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("heading", { name: planningResponse.adventure.title })).toBeVisible();
    const retryBody = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));
    expect(retryBody.goal).toBe("cardio");
  });

  it("does not navigate when browser storage rejects a generated mission", async () => {
    vi.stubGlobal("fetch", successfulFetch());
    vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    const user = userEvent.setup();
    render(<WorkoutPlanner />);
    await user.click(screen.getByRole("button", { name: "Generate my adventure" }));
    await user.click(await screen.findByRole("button", { name: "Prepare for mission" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not save the mission");
  });
});
