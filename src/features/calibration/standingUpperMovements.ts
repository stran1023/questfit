import { z } from "zod";
import { movementEventSchema, type MovementEvent } from "@/contracts";
import type { LandmarkFrame } from "./calibrationDomain";

export const standingUpperThresholdsSchema = z.strictObject({
  jackFootSpreadRatio: z.number().finite().min(1.2).max(5),
  punchExtensionRatio: z.number().finite().min(0.8).max(4),
  sideReachLeanRatio: z.number().finite().min(0.12).max(1.5),
});
export type StandingUpperThresholds = z.infer<typeof standingUpperThresholdsSchema>;

export const defaultStandingUpperThresholds: StandingUpperThresholds = {
  jackFootSpreadRatio: 2,
  punchExtensionRatio: 1.35,
  sideReachLeanRatio: 0.32,
};

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function torsoWidth(frame: LandmarkFrame) {
  return distance(frame[11]?.x ?? NaN, frame[11]?.y ?? NaN, frame[12]?.x ?? NaN, frame[12]?.y ?? NaN);
}

function torsoHeight(frame: LandmarkFrame) {
  const shoulderY = ((frame[11]?.y ?? NaN) + (frame[12]?.y ?? NaN)) / 2;
  const hipY = ((frame[23]?.y ?? NaN) + (frame[24]?.y ?? NaN)) / 2;
  return Math.abs(hipY - shoulderY);
}

function jackOpen(frame: LandmarkFrame, threshold: number) {
  const width = torsoWidth(frame);
  const feet = Math.abs((frame[27]?.x ?? NaN) - (frame[28]?.x ?? NaN));
  const armsUp = (frame[15]?.y ?? Infinity) < (frame[11]?.y ?? -Infinity) && (frame[16]?.y ?? Infinity) < (frame[12]?.y ?? -Infinity);
  return Number.isFinite(width) && width > 0 && armsUp && feet / width >= threshold;
}

function punchSide(frame: LandmarkFrame, threshold: number): "left" | "right" | null {
  const width = torsoWidth(frame);
  if (!Number.isFinite(width) || width <= 0) return null;
  const left = Math.abs((frame[15]?.x ?? NaN) - (frame[11]?.x ?? NaN)) / width;
  const right = Math.abs((frame[16]?.x ?? NaN) - (frame[12]?.x ?? NaN)) / width;
  if (left >= threshold && left > right) return "left";
  if (right >= threshold && right > left) return "right";
  return null;
}

function reachSide(frame: LandmarkFrame, threshold: number): "left" | "right" | null {
  const height = torsoHeight(frame);
  if (!Number.isFinite(height) || height <= 0) return null;
  const shoulderX = ((frame[11]?.x ?? NaN) + (frame[12]?.x ?? NaN)) / 2;
  const hipX = ((frame[23]?.x ?? NaN) + (frame[24]?.x ?? NaN)) / 2;
  const lean = (shoulderX - hipX) / height;
  if (lean <= -threshold) return "left";
  if (lean >= threshold) return "right";
  return null;
}

export function deriveStandingUpperThresholds(jack: LandmarkFrame[], punches: LandmarkFrame[], reaches: LandmarkFrame[]) {
  const jackRatios = jack.map((frame) => Math.abs((frame[27]?.x ?? NaN) - (frame[28]?.x ?? NaN)) / torsoWidth(frame)).filter(Number.isFinite);
  const punchRatios = punches.flatMap((frame) => {
    const width = torsoWidth(frame);
    return [Math.abs((frame[15]?.x ?? NaN) - (frame[11]?.x ?? NaN)) / width, Math.abs((frame[16]?.x ?? NaN) - (frame[12]?.x ?? NaN)) / width].filter(Number.isFinite);
  });
  const reachRatios = reaches.map((frame) => {
    const shoulderX = ((frame[11]?.x ?? NaN) + (frame[12]?.x ?? NaN)) / 2;
    const hipX = ((frame[23]?.x ?? NaN) + (frame[24]?.x ?? NaN)) / 2;
    return Math.abs(shoulderX - hipX) / torsoHeight(frame);
  }).filter(Number.isFinite);
  if (jackRatios.length < 2 || punchRatios.length < 2 || reachRatios.length < 2) throw new Error("Clear jumping-jack, punch, and side-reach samples are required.");
  return standingUpperThresholdsSchema.parse({
    jackFootSpreadRatio: Math.max(1.2, Math.min(5, Math.max(...jackRatios) * 0.72)),
    punchExtensionRatio: Math.max(0.8, Math.min(4, Math.max(...punchRatios) * 0.7)),
    sideReachLeanRatio: Math.max(0.12, Math.min(1.5, Math.max(...reachRatios) * 0.7)),
  });
}

export function createStandingUpperMovementEmitter(raw: StandingUpperThresholds = defaultStandingUpperThresholds, now: () => number = () => Date.now()) {
  const thresholds = standingUpperThresholdsSchema.parse(raw);
  let jackFrames = 0;
  let jackActive = false;
  let punch: "left" | "right" | null = null;
  let reachCandidate: "left" | "right" | null = null;
  let reachFrames = 0;
  let activeReach: "left" | "right" | null = null;
  const emit = (movement: "jumping-jack" | "punch-left" | "punch-right" | "side-reach-left" | "side-reach-right", phase: "started" | "completed", confidence: number): MovementEvent => movementEventSchema.parse({ movement, phase, confidence, occurredAtMs: now() });

  return {
    push(frame: LandmarkFrame, confidence = 1): MovementEvent | null {
      if (jackOpen(frame, thresholds.jackFootSpreadRatio)) {
        jackFrames += 1;
        if (jackFrames >= 2) jackActive = true;
        return null;
      }
      if (jackActive) {
        jackActive = false;
        jackFrames = 0;
        return emit("jumping-jack", "completed", confidence);
      }
      jackFrames = 0;

      const nextPunch = punchSide(frame, thresholds.punchExtensionRatio);
      if (nextPunch) {
        if (nextPunch === punch) return null;
        punch = nextPunch;
        return emit(nextPunch === "left" ? "punch-left" : "punch-right", "completed", confidence);
      }
      punch = null;

      const nextReach = reachSide(frame, thresholds.sideReachLeanRatio);
      if (activeReach) {
        if (!nextReach) {
          const completed = activeReach;
          activeReach = null;
          reachCandidate = null;
          reachFrames = 0;
          return emit(completed === "left" ? "side-reach-left" : "side-reach-right", "completed", confidence);
        }
        return null;
      }
      if (nextReach) {
        if (nextReach === reachCandidate) reachFrames += 1;
        else { reachCandidate = nextReach; reachFrames = 1; }
        if (reachFrames >= 2) {
          activeReach = nextReach;
          return emit(nextReach === "left" ? "side-reach-left" : "side-reach-right", "started", confidence);
        }
      } else { reachCandidate = null; reachFrames = 0; }
      return null;
    },
    reset() { jackFrames = 0; jackActive = false; punch = null; reachCandidate = null; reachFrames = 0; activeReach = null; },
  };
}
