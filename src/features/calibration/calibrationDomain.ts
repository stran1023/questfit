import { z } from "zod";
import {
  createCalibrationSession as createCoreSession,
  finalizeThresholds as finalizeCoreThresholds,
  recordJumpSample as recordCoreJumpSample,
  recordSquatSample as recordCoreSquatSample,
  recordStandingSample as recordCoreStandingSample,
} from "@/calibration/calibrationFlow.js";

export type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

export type LandmarkFrame = Landmark[];

export type CalibrationSession = {
  step: number;
  standingSample: LandmarkFrame[] | null;
  jumpSample: LandmarkFrame[] | null;
  squatSample: LandmarkFrame[] | null;
};

export const calibrationThresholdsSchema = z.strictObject({
  jumpDeltaPx: z.number().finite().positive().max(1),
  squatHipKneeRatio: z.number().finite().positive().max(5),
  standingHipY: z.number().finite().min(0).max(1),
  standingHipKneeRatio: z.number().finite().positive().max(5),
});

export type CalibrationThresholds = z.infer<typeof calibrationThresholdsSchema>;

export function createCalibrationSession(): CalibrationSession {
  return createCoreSession() as CalibrationSession;
}

export function recordStandingSample(session: CalibrationSession, frames: LandmarkFrame[]) {
  return recordCoreStandingSample(session, frames) as CalibrationSession;
}

export function recordJumpSample(session: CalibrationSession, frames: LandmarkFrame[]) {
  return recordCoreJumpSample(session, frames) as CalibrationSession;
}

export function recordSquatSample(session: CalibrationSession, frames: LandmarkFrame[]) {
  return recordCoreSquatSample(session, frames) as CalibrationSession;
}

export function finalizeThresholds(session: CalibrationSession): CalibrationThresholds {
  return calibrationThresholdsSchema.parse(finalizeCoreThresholds(session));
}
