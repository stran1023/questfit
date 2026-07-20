// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalProfileRepository } from "@/features/identity/profileRepository";
import WorkoutPlanner from "./WorkoutPlanner";
import { loadPlanningRequest } from "./planningJourney";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); push.mockClear(); });

describe("WorkoutPlanner", () => {
  it("loads goal, level, activity, and movement considerations from the guest profile", async () => {
    createLocalProfileRepository(localStorage).save({
      heightCm: 170,
      weightKg: 65,
      activityFrequency: "regular",
      fitnessLevel: "intermediate",
      goal: "mobility",
      movementLimitations: "Limited floor space",
    });
    render(<WorkoutPlanner />);
    await waitFor(() => expect(screen.getByRole("combobox", { name: "Goal" })).toHaveValue("mobility"));
    expect(screen.getByRole("combobox", { name: "Fitness level" })).toHaveValue("intermediate");
    expect(screen.getByRole("combobox", { name: "Activity frequency" })).toHaveValue("regular");
    expect(screen.getByRole("textbox", { name: /Movement considerations/ })).toHaveValue("Limited floor space");
  });

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

  it("validates and carries selected preferences to AI to Action", async () => {
    const user = userEvent.setup();
    render(<WorkoutPlanner />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Goal" }), "strength");
    await user.click(screen.getByRole("radio", { name: "15 min" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Fitness level" }), "intermediate");
    await user.selectOptions(screen.getByRole("combobox", { name: "Activity frequency" }), "regular");
    await user.type(screen.getByRole("textbox", { name: /Movement considerations/ }), "Avoid jumping");
    await user.click(screen.getByRole("button", { name: "Generate my adventure" }));

    expect(loadPlanningRequest(sessionStorage)).toEqual({ goal: "strength", durationMinutes: 15, fitnessLevel: "intermediate", activityFrequency: "regular", movementLimitations: "Avoid jumping" });
    expect(push).toHaveBeenCalledWith("/ai-to-action");
  });

  it("announces when browser storage blocks the route handoff", async () => {
    vi.spyOn(window.sessionStorage, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    const user = userEvent.setup();
    render(<WorkoutPlanner />);

    await user.click(screen.getByRole("button", { name: "Generate my adventure" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not start planning");
    expect(push).not.toHaveBeenCalled();
  });
});
