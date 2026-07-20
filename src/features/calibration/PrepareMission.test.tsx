// @vitest-environment happy-dom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validAdventureBlueprintFixture, validWorkoutPlanFixture } from "@/contracts";
import { saveCalibrationThresholds, saveMissionSession } from "./missionSession";
import PrepareMission from "./PrepareMission";

const {
  startWebcamMock,
  stopWebcamMock,
  initPoseEngineMock,
  detectPoseMock,
  closePoseEngineMock,
  routerPushMock,
} = vi.hoisted(() => ({
  startWebcamMock: vi.fn(),
  stopWebcamMock: vi.fn(),
  initPoseEngineMock: vi.fn(),
  detectPoseMock: vi.fn(),
  closePoseEngineMock: vi.fn(),
  routerPushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: routerPushMock }) }));

const stream = { getTracks: () => [{ stop: vi.fn() }] } as unknown as MediaStream;

vi.mock("@/pose/captureWebcam.js", () => ({
  startWebcam: startWebcamMock,
  stopWebcam: stopWebcamMock,
}));

vi.mock("@/pose/poseEngine.js", () => ({
  initPoseEngine: initPoseEngineMock,
  detectPose: detectPoseMock,
  closePoseEngine: closePoseEngineMock,
}));

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  startWebcamMock.mockReset().mockResolvedValue(stream);
  stopWebcamMock.mockReset();
  initPoseEngineMock.mockReset().mockResolvedValue({});
  detectPoseMock.mockReset().mockReturnValue([]);
  closePoseEngineMock.mockReset();
  routerPushMock.mockReset();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("PrepareMission camera lifecycle", () => {
  it("does not request camera access without a validated mission", async () => {
    render(<PrepareMission />);
    expect(await screen.findByRole("heading", { name: "Generate a mission first." })).toBeVisible();
    expect(startWebcamMock).not.toHaveBeenCalled();
  });

  it("starts the camera for a mission and disposes every resource on unmount", async () => {
    saveMissionSession({ workout: validWorkoutPlanFixture, adventure: validAdventureBlueprintFixture });
    const view = render(<PrepareMission />);
    await waitFor(() => expect(initPoseEngineMock).toHaveBeenCalledTimes(1));
    view.unmount();
    expect(stopWebcamMock).toHaveBeenCalledWith(stream);
    expect(closePoseEngineMock).toHaveBeenCalledTimes(1);
  });

  it("shows actionable denied-camera copy and retries without reloading", async () => {
    startWebcamMock
      .mockRejectedValueOnce(new DOMException("denied", "NotAllowedError"))
      .mockResolvedValueOnce(stream);
    saveMissionSession({ workout: validWorkoutPlanFixture, adventure: validAdventureBlueprintFixture });
    const user = userEvent.setup();
    render(<PrepareMission />);

    expect(await screen.findByText(/Camera permission is blocked/)).toBeVisible();
    expect(screen.getByText("Needs attention")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Retry camera" }));
    await waitFor(() => expect(startWebcamMock).toHaveBeenCalledTimes(2));
  });

  it("validates stable framing and launches automatically when saved setup is compatible", async () => {
    vi.useFakeTimers();
    saveMissionSession({ workout: validWorkoutPlanFixture, adventure: validAdventureBlueprintFixture });
    saveCalibrationThresholds({
      jumpDeltaPx: 0.06,
      squatHipKneeRatio: 0.45,
      standingHipY: 0.55,
      standingHipKneeRatio: 0.8,
    });
    detectPoseMock.mockReturnValue(Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 1 })));

    render(<PrepareMission />);
    await vi.advanceTimersByTimeAsync(700);

    expect(screen.getByRole("heading", { name: "Mission ready" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "All systems ready" })).toBeVisible();
    expect(screen.getByText(`${validWorkoutPlanFixture.exercises.length} stages loaded`)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Begin mission" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Mission launch countdown")).toBeVisible();
    expect(screen.getByText("3")).toBeVisible();

    await vi.advanceTimersByTimeAsync(3_200);
    expect(screen.getByText("GO!")).toBeVisible();
    expect(routerPushMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(500);
    expect(routerPushMock).toHaveBeenCalledWith("/mission");
  });
});
