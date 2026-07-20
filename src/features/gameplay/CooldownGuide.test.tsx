// @vitest-environment happy-dom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import CooldownGuide from "./CooldownGuide";

afterEach(cleanup);

describe("CooldownGuide", () => {
  it("presents an unscored recovery and can finish early", async () => {
    const onComplete = vi.fn();
    render(<CooldownGuide plan={{ durationSeconds: 15, steps: ["Slow march", "Release shoulders", "Three calm breaths"] }} onComplete={onComplete} />);
    expect(screen.getByRole("heading", { name: "Cool down. Mission secured." })).toBeVisible();
    expect(screen.getByText(/Camera tracking is paused/)).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Finish cooldown" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
