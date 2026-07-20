import {
  adventureBlueprintSchema,
  validateAdventureForWorkout,
  workoutPlanSchema,
  type AdventureBlueprint,
  type WorkoutPlan,
} from "@/contracts";
import { calibrationThresholdsSchema, type CalibrationThresholds } from "./calibrationDomain";

const missionKey = "ai-fitness-escape:mission-v1";
export const thresholdsKey = "ai-fitness-escape:calibration-profile:v1";
const poseModelVersion = "mediapipe-pose-landmarker-lite-f16-v1";

export type MissionSession = {
  workout: WorkoutPlan;
  adventure: AdventureBlueprint;
};

export function saveMissionSession(session: MissionSession) {
  const workout = workoutPlanSchema.parse(session.workout);
  const adventure = validateAdventureForWorkout(session.adventure, workout);
  if (!adventure.success) throw new Error("Mission data is not playable.");
  sessionStorage.setItem(missionKey, JSON.stringify({ workout, adventure: adventure.data }));
}

export function loadMissionSession(): MissionSession | null {
  const serialized = sessionStorage.getItem(missionKey);
  if (!serialized) return null;

  try {
    const raw = JSON.parse(serialized) as { workout?: unknown; adventure?: unknown };
    const workout = workoutPlanSchema.parse(raw.workout);
    const adventure = adventureBlueprintSchema.parse(raw.adventure);
    const validated = validateAdventureForWorkout(adventure, workout);
    if (!validated.success) return null;
    return { workout, adventure: validated.data };
  } catch {
    return null;
  }
}

export function saveCalibrationThresholds(thresholds: CalibrationThresholds) {
  localStorage.setItem(thresholdsKey, JSON.stringify({
    schemaVersion: 1,
    poseModelVersion,
    calibratedAt: new Date().toISOString(),
    thresholds: calibrationThresholdsSchema.parse(thresholds),
  }));
}

export function loadCalibrationThresholds(): CalibrationThresholds | null {
  const serialized = localStorage.getItem(thresholdsKey);
  if (!serialized) return null;
  try {
    const raw = JSON.parse(serialized) as Record<string, unknown>;
    if (raw.schemaVersion !== 1 || raw.poseModelVersion !== poseModelVersion) return null;
    return calibrationThresholdsSchema.parse(raw.thresholds);
  } catch {
    return null;
  }
}
