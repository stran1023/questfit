import { describe, expect, it } from "vitest";
import {
  createCalibrationSession,
  finalizeThresholds,
  recordJumpSample,
  recordSquatSample,
  recordStandingSample,
  type LandmarkFrame,
} from "./calibrationDomain";
import { createMovementEventEmitter } from "./movementEvents";

function frame({ shoulder = 0.3, hip = 0.55, knee = 0.75, ankle = 0.95 } = {}): LandmarkFrame {
  const points = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 1 }));
  for (const index of [11, 12]) points[index].y = shoulder;
  for (const index of [23, 24]) points[index].y = hip;
  for (const index of [25, 26]) points[index].y = knee;
  for (const index of [27, 28]) points[index].y = ankle;
  return points;
}

const thresholds = {
  standingHipY: 0.55,
  standingHipKneeRatio: 0.8,
  jumpDeltaPx: 0.06,
  squatHipKneeRatio: 0.45,
};

describe("typed calibration adapter", () => {
  it("preserves per-user threshold derivation", () => {
    const session = createCalibrationSession();
    recordStandingSample(session, Array.from({ length: 5 }, () => frame()));
    recordJumpSample(session, [frame(), frame({ hip: 0.48 }), frame({ hip: 0.44 }), frame()]);
    recordSquatSample(session, [frame(), frame({ hip: 0.62 }), frame({ hip: 0.68 }), frame()]);
    const result = finalizeThresholds(session);
    expect(Object.values(result).every(Number.isFinite)).toBe(true);
    expect(result.jumpDeltaPx).toBeGreaterThan(0);
    expect(result.squatHipKneeRatio).toBeLessThan(result.standingHipKneeRatio);
  });

  it("rejects incomplete and weak samples", () => {
    expect(() => finalizeThresholds(createCalibrationSession())).toThrow(/incomplete/);
    const session = createCalibrationSession();
    recordStandingSample(session, Array.from({ length: 5 }, () => frame()));
    recordJumpSample(session, Array.from({ length: 5 }, () => frame({ hip: 0.545 })));
    recordSquatSample(session, Array.from({ length: 5 }, () => frame({ hip: 0.56 })));
    expect(() => finalizeThresholds(session)).toThrow(/too small/);
  });
});

describe("typed edge-triggered movement events", () => {
  it("emits one jump until movement returns to neutral", () => {
    let timestamp = 1_000;
    const emitter = createMovementEventEmitter(thresholds, () => timestamp++);
    expect(emitter.push(frame())).toBeNull();
    expect(emitter.push(frame({ hip: 0.5, ankle: 0.9 }))).toBeNull();
    expect(emitter.push(frame({ hip: 0.46, ankle: 0.84 }))).toMatchObject({
      movement: "jump",
      phase: "completed",
    });
    expect(emitter.push(frame({ hip: 0.45, ankle: 0.83 }))).toBeNull();
    for (let index = 0; index < 6; index += 1) expect(emitter.push(frame())).toBeNull();
    expect(emitter.push(frame({ hip: 0.5, ankle: 0.9 }))).toBeNull();
    expect(emitter.push(frame({ hip: 0.46, ankle: 0.84 }))).toMatchObject({ movement: "jump" });
  });

  it("requires a held squat and completes only on release", () => {
    const emitter = createMovementEventEmitter(thresholds);
    expect(emitter.push(frame({ hip: 0.66 }))).toBeNull();
    expect(emitter.push(frame({ hip: 0.67 }))).toBeNull();
    expect(emitter.push(frame({ hip: 0.68 }))).toMatchObject({ movement: "squat", phase: "started" });
    expect(emitter.push(frame({ hip: 0.68 }))).toBeNull();
    expect(emitter.push(frame())).toMatchObject({ movement: "squat", phase: "completed" });
    expect(emitter.push(frame())).toBeNull();
  });

  it("ignores a single noisy squat frame", () => {
    const emitter = createMovementEventEmitter(thresholds);
    expect(emitter.push(frame())).toBeNull();
    expect(emitter.push(frame({ hip: 0.68 }))).toBeNull();
    expect(emitter.push(frame())).toBeNull();
  });
});
