import { describe, expect, it } from "vitest";
import type { LandmarkFrame } from "./calibrationDomain";
import { createLowerBodyMovementEmitter, deriveLowerBodyThresholds } from "./lowerBodyMovements";

function standingFrame(): LandmarkFrame {
  const points = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 1 }));
  Object.assign(points[11], { x: 0.43, y: 0.28 });
  Object.assign(points[12], { x: 0.57, y: 0.28 });
  Object.assign(points[23], { x: 0.45, y: 0.5 });
  Object.assign(points[24], { x: 0.55, y: 0.5 });
  Object.assign(points[25], { x: 0.45, y: 0.72 });
  Object.assign(points[26], { x: 0.55, y: 0.72 });
  Object.assign(points[27], { x: 0.45, y: 0.94 });
  Object.assign(points[28], { x: 0.55, y: 0.94 });
  return points;
}

function leftLungeFrame() {
  const points = standingFrame();
  Object.assign(points[25], { x: 0.36, y: 0.66 });
  Object.assign(points[27], { x: 0.48, y: 0.78 });
  return points;
}

function highKneeFrame(side: "left" | "right") {
  const points = standingFrame();
  Object.assign(points[side === "left" ? 25 : 26], { x: side === "left" ? 0.43 : 0.57, y: 0.4 });
  return points;
}

describe("lower-body movement events", () => {
  it("derives bounded personal thresholds from clear samples", () => {
    const thresholds = deriveLowerBodyThresholds(
      [leftLungeFrame(), leftLungeFrame(), leftLungeFrame()],
      [highKneeFrame("left"), highKneeFrame("right")],
    );
    expect(thresholds.lungeBentKneeDegrees).toBeLessThan(thresholds.lungeStraightKneeDegrees);
    expect(thresholds.highKneeLiftRatio).toBeGreaterThan(0);
    expect(() => deriveLowerBodyThresholds([], [])).toThrow(/samples/);
  });

  it("requires a stable lunge and completes once on neutral rearm", () => {
    const emitter = createLowerBodyMovementEmitter();
    expect(emitter.push(leftLungeFrame())).toBeNull();
    expect(emitter.push(standingFrame())).toBeNull();
    expect(emitter.push(leftLungeFrame())).toBeNull();
    expect(emitter.push(leftLungeFrame())).toBeNull();
    expect(emitter.push(leftLungeFrame())).toMatchObject({ movement: "lunge", phase: "started" });
    expect(emitter.push(leftLungeFrame())).toBeNull();
    expect(emitter.push(standingFrame())).toMatchObject({ movement: "lunge", phase: "completed" });
    expect(emitter.push(standingFrame())).toBeNull();
  });

  it("counts alternating high knees without duplicate held-side credit", () => {
    const emitter = createLowerBodyMovementEmitter();
    expect(emitter.push(highKneeFrame("left"))).toMatchObject({ movement: "high-knees", phase: "completed" });
    expect(emitter.push(highKneeFrame("left"))).toBeNull();
    expect(emitter.push(highKneeFrame("right"))).toMatchObject({ movement: "high-knees", phase: "completed" });
    expect(emitter.push(highKneeFrame("right"))).toBeNull();
  });

  it("ignores incomplete range and validates confidence", () => {
    const emitter = createLowerBodyMovementEmitter();
    expect(emitter.push(standingFrame())).toBeNull();
    expect(() => emitter.push(highKneeFrame("left"), 2)).toThrow();
  });
});
