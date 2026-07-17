import {
  createCalibrationSession,
  finalizeThresholds,
  recordJumpSample,
  recordSquatSample,
  recordStandingSample,
  type CalibrationSession,
  type CalibrationThresholds,
  type LandmarkFrame,
} from "./calibrationDomain";

export type AutomaticCalibrationPhase =
  | "framing"
  | "jump-countdown"
  | "jump-sampling"
  | "squat-countdown"
  | "squat-sampling"
  | "ready";

type AutomaticCalibrationCallbacks = {
  onPhase(phase: AutomaticCalibrationPhase): void;
  onError(message: string): void;
  onComplete(thresholds: CalibrationThresholds): void;
};

const readinessFrames = 12;
export const calibrationCountdownMs = 3_000;
export const calibrationSampleMs = 2_200;
const requiredLandmarks = [0, 11, 12, 23, 24, 25, 26, 27, 28];

function isFullBodyVisible(frame: LandmarkFrame) {
  return frame.length >= 29 && requiredLandmarks.every((index) => {
    const point = frame[index];
    return point && Number.isFinite(point.x) && Number.isFinite(point.y) && (point.visibility ?? 1) >= 0.55;
  });
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hipY(frame: LandmarkFrame) {
  return average([frame[23]?.y, frame[24]?.y].filter(Number.isFinite));
}

function hasClearJump(frames: LandmarkFrame[]) {
  const values = frames.map(hipY).filter(Number.isFinite);
  return values.length >= 3 && Math.max(...values) - Math.min(...values) >= 0.015;
}

export function createAutomaticCalibration(callbacks: AutomaticCalibrationCallbacks) {
  let phase: AutomaticCalibrationPhase = "framing";
  let phaseStartedAt = 0;
  let session: CalibrationSession = createCalibrationSession();
  let standingFrames: LandmarkFrame[] = [];
  let movementFrames: LandmarkFrame[] = [];

  function transition(next: AutomaticCalibrationPhase, nowMs: number) {
    phase = next;
    phaseStartedAt = nowMs;
    movementFrames = [];
    callbacks.onPhase(next);
  }

  function retry(next: "jump-countdown" | "squat-countdown", nowMs: number, cause: unknown) {
    callbacks.onError(cause instanceof Error ? cause.message : "That movement was not clear enough. Try again.");
    transition(next, nowMs);
  }

  return {
    getPhase: () => phase,
    reset(nowMs = 0) {
      phase = "framing";
      phaseStartedAt = nowMs;
      session = createCalibrationSession();
      standingFrames = [];
      movementFrames = [];
      callbacks.onPhase("framing");
    },
    push(frame: LandmarkFrame, nowMs: number) {
      if (!isFullBodyVisible(frame) || phase === "ready") return;

      if (phase === "framing") {
        standingFrames = [...standingFrames.slice(-(readinessFrames - 1)), frame];
        if (standingFrames.length === readinessFrames) {
          try {
            recordStandingSample(session, standingFrames);
            callbacks.onError("");
            transition("jump-countdown", nowMs);
          } catch (cause) {
            callbacks.onError(cause instanceof Error ? cause.message : "Hold still with your full body visible.");
          }
        }
        return;
      }

      if (phase === "jump-countdown" && nowMs - phaseStartedAt >= calibrationCountdownMs) {
        transition("jump-sampling", nowMs);
      } else if (phase === "squat-countdown" && nowMs - phaseStartedAt >= calibrationCountdownMs) {
        transition("squat-sampling", nowMs);
      }

      if (phase === "jump-sampling" || phase === "squat-sampling") {
        movementFrames.push(frame);
        if (nowMs - phaseStartedAt < calibrationSampleMs) return;
        if (phase === "jump-sampling") {
          try {
            if (!hasClearJump(movementFrames)) throw new Error("Jump higher, then return to standing and try again.");
            recordJumpSample(session, movementFrames);
            callbacks.onError("");
            transition("squat-countdown", nowMs);
          } catch (cause) {
            retry("jump-countdown", nowMs, cause);
          }
        } else {
          try {
            recordSquatSample(session, movementFrames);
            const thresholds = finalizeThresholds(session);
            callbacks.onError("");
            transition("ready", nowMs);
            callbacks.onComplete(thresholds);
          } catch (cause) {
            retry("squat-countdown", nowMs, cause);
          }
        }
      }
    },
  };
}
