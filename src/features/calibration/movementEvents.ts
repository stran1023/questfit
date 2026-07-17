import { movementEventSchema, type MovementEvent } from "@/contracts";
import {
  classifyMovement,
  createLandmarkBuffer,
  pushLandmarks,
} from "@/pose/movementClassifier.js";
import type { CalibrationThresholds, LandmarkFrame } from "./calibrationDomain";

type ClassifiedMovement = "jump" | "squat" | "none";

export type MovementEventEmitter = {
  push(frame: LandmarkFrame, confidence?: number): MovementEvent | null;
  reset(): void;
};

export function createMovementEventEmitter(
  thresholds: CalibrationThresholds,
  now: () => number = () => Date.now(),
): MovementEventEmitter {
  const buffer = createLandmarkBuffer() as LandmarkFrame[];
  let active: ClassifiedMovement = "none";

  return {
    push(frame, confidence = 1) {
      pushLandmarks(buffer, frame);
      const next = classifyMovement(buffer, thresholds) as ClassifiedMovement;

      if (next === active) return null;

      if (active === "squat" && next === "none") {
        active = "none";
        return movementEventSchema.parse({
          movement: "squat",
          phase: "completed",
          confidence,
          occurredAtMs: now(),
        });
      }

      if (next === "jump") {
        active = "jump";
        return movementEventSchema.parse({
          movement: "jump",
          phase: "completed",
          confidence,
          occurredAtMs: now(),
        });
      }

      if (next === "squat") {
        active = "squat";
        return movementEventSchema.parse({
          movement: "squat",
          phase: "started",
          confidence,
          occurredAtMs: now(),
        });
      }

      active = "none";
      return null;
    },
    reset() {
      buffer.splice(0, buffer.length);
      active = "none";
    },
  };
}
