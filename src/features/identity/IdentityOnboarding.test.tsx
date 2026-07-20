// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import IdentityOnboarding from "./IdentityOnboarding";
import { FITNESS_PROFILE_STORAGE_KEY } from "./profileRepository";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeEach(() => {
  window.localStorage.clear();
  push.mockClear();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("IdentityOnboarding", () => {
  it("presents one obvious guest entry without unfinished account actions", () => {
    render(<IdentityOnboarding />);
    expect(screen.getByRole("button", { name: "Start as guest" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create account" })).not.toBeInTheDocument();
    expect(screen.getByText(/No account or cloud setup is required/)).toBeVisible();
  });

  it("validates, saves, reloads, and edits a local guest profile", async () => {
    const user = userEvent.setup();
    const view = render(<IdentityOnboarding />);
    await user.click(screen.getByRole("button", { name: "Start as guest" }));
    const height = screen.getByRole("spinbutton", { name: "Height (cm)" });
    await user.clear(height);
    await user.type(height, "80");
    await user.click(screen.getByRole("button", { name: "Save and continue" }));
    expect(await screen.findByText("Enter 100–230 cm.")).toBeVisible();
    await user.clear(height);
    await user.type(height, "181");
    await user.selectOptions(screen.getByRole("combobox", { name: "Activity frequency" }), "regular");
    await user.click(screen.getByRole("button", { name: "Save and continue" }));
    expect(await screen.findByRole("heading", { name: "Your next adventure is ready." })).toBeVisible();
    expect(window.localStorage.getItem(FITNESS_PROFILE_STORAGE_KEY)).toContain('"heightCm":181');

    view.unmount();
    render(<IdentityOnboarding />);
    expect(await screen.findByText(/181 cm/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("spinbutton", { name: "Height (cm)" })).toHaveValue(181);
  });

  it("continues a saved guest to planning", async () => {
    window.localStorage.setItem(
      FITNESS_PROFILE_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, guestId: "guest-valid-id", heightCm: 170, weightKg: 65, activityFrequency: "weekly", fitnessLevel: "beginner", goal: "general", movementLimitations: "", updatedAt: new Date().toISOString() }),
    );
    const user = userEvent.setup();
    render(<IdentityOnboarding />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Continue adventure" })).toBeVisible());
    await user.click(screen.getByRole("button", { name: "Continue adventure" }));
    expect(push).toHaveBeenCalledWith("/plan");
  });

  it("keeps the profile form recoverable when browser storage rejects the save", async () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    const user = userEvent.setup();
    render(<IdentityOnboarding />);
    await user.click(screen.getByRole("button", { name: "Start as guest" }));
    await user.click(screen.getByRole("button", { name: "Save and continue" }));
    expect(await screen.findByRole("status")).toHaveTextContent("could not save your profile");
    expect(screen.getByRole("heading", { name: "Tell us how you move." })).toBeVisible();
  });
});
