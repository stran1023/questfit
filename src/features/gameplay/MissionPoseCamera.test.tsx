// @vitest-environment happy-dom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MissionPoseCamera from "./MissionPoseCamera";

const {
  startWebcamMock,
  stopWebcamMock,
  initPoseEngineMock,
  detectPoseMock,
  closePoseEngineMock,
  loadCalibrationThresholdsMock,
} = vi.hoisted(() => ({
  startWebcamMock: vi.fn(),
  stopWebcamMock: vi.fn(),
  initPoseEngineMock: vi.fn(),
  detectPoseMock: vi.fn(),
  closePoseEngineMock: vi.fn(),
  loadCalibrationThresholdsMock: vi.fn(),
}));

vi.mock("@/pose/captureWebcam.js", () => ({
  startWebcam: startWebcamMock,
  stopWebcam: stopWebcamMock,
}));

vi.mock("@/pose/poseEngine.js", () => ({
  initPoseEngine: initPoseEngineMock,
  detectPose: detectPoseMock,
  closePoseEngine: closePoseEngineMock,
}));

vi.mock("@/features/calibration/missionSession", () => ({
  loadCalibrationThresholds: loadCalibrationThresholdsMock,
}));

vi.mock("@/features/calibration/poseOverlay", () => ({
  drawPoseOverlay: vi.fn(),
  clearPoseOverlay: vi.fn(),
}));

const track = new EventTarget();
const stream = {
  getVideoTracks: () => [track],
  getTracks: () => [track],
} as unknown as MediaStream;

beforeEach(() => {
  startWebcamMock.mockReset().mockResolvedValue(stream);
  stopWebcamMock.mockReset();
  initPoseEngineMock.mockReset().mockResolvedValue({});
  detectPoseMock.mockReset().mockReturnValue([]);
  closePoseEngineMock.mockReset();
  loadCalibrationThresholdsMock.mockReset().mockReturnValue({
    jumpDeltaPx: 0.08,
    squatHipKneeRatio: 1.1,
    standingHipY: 0.5,
    standingHipKneeRatio: 0.7,
  });
});

afterEach(() => cleanup());

describe("MissionPoseCamera lifecycle", () => {
  it("pauses on device loss, retries without a page reload, and disposes resources", async () => {
    const onDeviceLoss = vi.fn();
    const onRetry = vi.fn();
    const view = render(
      <MissionPoseCamera
        target="jump"
        paused={false}
        onDeviceLoss={onDeviceLoss}
        onRetry={onRetry}
        onGuidanceChange={vi.fn()}
      />,
    );

    await waitFor(() => expect(initPoseEngineMock).toHaveBeenCalledTimes(1));
    track.dispatchEvent(new Event("ended"));
    expect(await screen.findByRole("button", { name: "Retry tracking" })).toBeVisible();
    expect(onDeviceLoss).toHaveBeenCalledWith(
      "Camera disconnected. Reconnect it, then resume.",
    );

    await userEvent.click(screen.getByRole("button", { name: "Retry tracking" }));
    await waitFor(() => expect(startWebcamMock).toHaveBeenCalledTimes(2));
    expect(onRetry).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(stopWebcamMock).toHaveBeenCalledWith(stream);
    expect(closePoseEngineMock).toHaveBeenCalled();
  });

  it("offers an in-place retry when camera permission is denied", async () => {
    startWebcamMock
      .mockRejectedValueOnce(new DOMException("denied", "NotAllowedError"))
      .mockResolvedValueOnce(stream);

    render(
      <MissionPoseCamera
        target="squat"
        paused={false}
        onDeviceLoss={vi.fn()}
        onRetry={vi.fn()}
        onGuidanceChange={vi.fn()}
      />,
    );

    expect(await screen.findByRole("button", { name: "Retry tracking" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Retry tracking" }));
    await waitFor(() => expect(startWebcamMock).toHaveBeenCalledTimes(2));
  });
});
