import { describe, expect, it, vi } from "vitest";
import { calibrationCountdownMs, calibrationSampleMs, createAutomaticCalibration } from "./automaticCalibration";
import type { LandmarkFrame } from "./calibrationDomain";

function frame({ shoulder = 0.3, hip = 0.55, knee = 0.75, ankle = 0.95, visibility = 1 } = {}): LandmarkFrame {
  const points = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility }));
  for (const index of [11, 12]) points[index].y = shoulder;
  for (const index of [23, 24]) points[index].y = hip;
  for (const index of [25, 26]) points[index].y = knee;
  for (const index of [27, 28]) points[index].y = ankle;
  return points;
}

describe("automatic calibration coordinator", () => {
  it("advances without touch input and emits derived thresholds", () => {
    const phases: string[] = [];
    const complete = vi.fn();
    const controller = createAutomaticCalibration({ onPhase: (phase) => phases.push(phase), onError: vi.fn(), onComplete: complete });
    for (let index = 0; index < 12; index += 1) controller.push(frame(), index * 40);
    expect(controller.getPhase()).toBe("jump-countdown");
    controller.push(frame({ hip: 0.48 }), 500 + calibrationCountdownMs);
    for (let elapsed = 0; elapsed <= calibrationSampleMs; elapsed += 100) {
      controller.push(frame({ hip: elapsed < 1_000 ? 0.44 : 0.55, ankle: 0.88 }), 500 + calibrationCountdownMs + elapsed);
    }
    expect(controller.getPhase()).toBe("squat-countdown");
    const squatStart = 500 + calibrationCountdownMs + calibrationSampleMs + calibrationCountdownMs;
    controller.push(frame({ hip: 0.62 }), squatStart);
    for (let elapsed = 0; elapsed <= calibrationSampleMs; elapsed += 100) {
      controller.push(frame({ hip: 0.68 }), squatStart + elapsed);
    }
    expect(controller.getPhase()).toBe("ready");
    expect(complete).toHaveBeenCalledTimes(1);
    expect(phases).toEqual(["jump-countdown", "jump-sampling", "squat-countdown", "squat-sampling", "ready"]);
  });

  it("requires stable visible framing and automatically retries weak movement", () => {
    const errors: string[] = [];
    const controller = createAutomaticCalibration({ onPhase: vi.fn(), onError: (message) => message && errors.push(message), onComplete: vi.fn() });
    for (let index = 0; index < 20; index += 1) controller.push(frame({ visibility: 0.2 }), index * 40);
    expect(controller.getPhase()).toBe("framing");
    for (let index = 0; index < 12; index += 1) controller.push(frame(), 1_000 + index * 40);
    controller.push(frame(), 1_500 + calibrationCountdownMs);
    for (let elapsed = 0; elapsed <= calibrationSampleMs; elapsed += 100) controller.push(frame(), 1_500 + calibrationCountdownMs + elapsed);
    expect(controller.getPhase()).toBe("jump-countdown");
    expect(errors.at(-1)).toMatch(/jump higher|valid jump|too small/i);
  });
});
