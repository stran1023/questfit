import { z } from "zod";
import { movementEventSchema, type MovementEvent } from "@/contracts";
import type { Landmark, LandmarkFrame } from "./calibrationDomain";

export const lowerBodyThresholdsSchema = z.strictObject({
  lungeBentKneeDegrees: z.number().finite().min(70).max(130),
  lungeStraightKneeDegrees: z.number().finite().min(120).max(175),
  highKneeLiftRatio: z.number().finite().min(0.05).max(0.8),
});

export type LowerBodyThresholds = z.infer<typeof lowerBodyThresholdsSchema>;

export const defaultLowerBodyThresholds: LowerBodyThresholds = {
  lungeBentKneeDegrees: 112,
  lungeStraightKneeDegrees: 138,
  highKneeLiftRatio: 0.28,
};

type Side = "left" | "right";

function angle(a: Landmark | undefined, b: Landmark | undefined, c: Landmark | undefined) {
  if (!a || !b || !c) return Number.NaN;
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const denominator = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);
  if (!denominator) return Number.NaN;
  const cosine = Math.max(-1, Math.min(1, (ab.x * cb.x + ab.y * cb.y) / denominator));
  return Math.acos(cosine) * (180 / Math.PI);
}

function kneeAngles(frame: LandmarkFrame) {
  return {
    left: angle(frame[23], frame[25], frame[27]),
    right: angle(frame[24], frame[26], frame[28]),
  };
}

function bodyScale(frame: LandmarkFrame) {
  const shoulderY = ((frame[11]?.y ?? Number.NaN) + (frame[12]?.y ?? Number.NaN)) / 2;
  const hipY = ((frame[23]?.y ?? Number.NaN) + (frame[24]?.y ?? Number.NaN)) / 2;
  return Math.abs(hipY - shoulderY);
}

function liftedKnee(frame: LandmarkFrame, threshold: number): Side | null {
  const scale = bodyScale(frame);
  if (!Number.isFinite(scale) || scale <= 0) return null;
  const leftLift = ((frame[23]?.y ?? Number.NaN) - (frame[25]?.y ?? Number.NaN)) / scale;
  const rightLift = ((frame[24]?.y ?? Number.NaN) - (frame[26]?.y ?? Number.NaN)) / scale;
  if (leftLift >= threshold && leftLift > rightLift) return "left";
  if (rightLift >= threshold && rightLift > leftLift) return "right";
  return null;
}

function lungeSide(frame: LandmarkFrame, thresholds: LowerBodyThresholds): Side | null {
  const knees = kneeAngles(frame);
  if (![knees.left, knees.right].every(Number.isFinite)) return null;
  if (knees.left <= thresholds.lungeBentKneeDegrees && knees.right >= thresholds.lungeStraightKneeDegrees) return "left";
  if (knees.right <= thresholds.lungeBentKneeDegrees && knees.left >= thresholds.lungeStraightKneeDegrees) return "right";
  return null;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function deriveLowerBodyThresholds(
  lungeFrames: LandmarkFrame[],
  highKneeFrames: LandmarkFrame[],
): LowerBodyThresholds {
  const lungeSamples = lungeFrames.flatMap((frame) => {
    const knees = kneeAngles(frame);
    return [knees.left, knees.right].filter(Number.isFinite);
  });
  const highKneeSamples = highKneeFrames.flatMap((frame) => {
    const scale = bodyScale(frame);
    if (!Number.isFinite(scale) || scale <= 0) return [];
    return [
      ((frame[23]?.y ?? Number.NaN) - (frame[25]?.y ?? Number.NaN)) / scale,
      ((frame[24]?.y ?? Number.NaN) - (frame[26]?.y ?? Number.NaN)) / scale,
    ].filter((value) => Number.isFinite(value) && value > 0);
  });
  if (lungeSamples.length < 6 || highKneeSamples.length < 2) {
    throw new Error("Clear lunge and high-knee samples are required.");
  }
  const sortedAngles = [...lungeSamples].sort((left, right) => left - right);
  const bent = sortedAngles[Math.floor(sortedAngles.length * 0.25)];
  const straight = sortedAngles[Math.floor(sortedAngles.length * 0.75)];
  const peakKneeLift = Math.max(...highKneeSamples);
  if (straight - bent < 15 || peakKneeLift < 0.08) {
    throw new Error("Move through a clearer lunge and lift each knee higher.");
  }
  return lowerBodyThresholdsSchema.parse({
    lungeBentKneeDegrees: clamp(bent + 10, 70, 130),
    lungeStraightKneeDegrees: clamp(straight - 8, 120, 175),
    highKneeLiftRatio: clamp(peakKneeLift * 0.65, 0.05, 0.8),
  });
}

export function createLowerBodyMovementEmitter(
  rawThresholds: LowerBodyThresholds = defaultLowerBodyThresholds,
  now: () => number = () => Date.now(),
) {
  const thresholds = lowerBodyThresholdsSchema.parse(rawThresholds);
  let lungeCandidate: Side | null = null;
  let lungeFrames = 0;
  let activeLunge: Side | null = null;
  let highKneeSide: Side | null = null;

  function event(movement: "lunge" | "high-knees", phase: "started" | "completed", confidence: number): MovementEvent {
    return movementEventSchema.parse({ movement, phase, confidence, occurredAtMs: now() });
  }

  return {
    push(frame: LandmarkFrame, confidence = 1): MovementEvent | null {
      const nextHighKnee = liftedKnee(frame, thresholds.highKneeLiftRatio);
      if (nextHighKnee) {
        lungeCandidate = null;
        lungeFrames = 0;
        if (nextHighKnee === highKneeSide) return null;
        highKneeSide = nextHighKnee;
        return event("high-knees", "completed", confidence);
      }
      highKneeSide = null;

      const nextLunge = lungeSide(frame, thresholds);
      if (activeLunge) {
        if (!nextLunge) {
          activeLunge = null;
          lungeCandidate = null;
          lungeFrames = 0;
          return event("lunge", "completed", confidence);
        }
        return null;
      }
      if (nextLunge) {
        if (nextLunge === lungeCandidate) lungeFrames += 1;
        else {
          lungeCandidate = nextLunge;
          lungeFrames = 1;
        }
        if (lungeFrames >= 3) {
          activeLunge = nextLunge;
          return event("lunge", "started", confidence);
        }
        return null;
      }
      lungeCandidate = null;
      lungeFrames = 0;

      return null;
    },
    reset() {
      lungeCandidate = null;
      lungeFrames = 0;
      activeLunge = null;
      highKneeSide = null;
    },
  };
}
