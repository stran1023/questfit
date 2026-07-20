// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from "vitest";
import { validAdventureBlueprintFixture, validWorkoutPlanFixture } from "@/contracts";
import {
  loadCalibrationThresholds,
  loadMissionSession,
  saveCalibrationThresholds,
  saveMissionSession,
  thresholdsKey,
} from "./missionSession";

describe("mission session boundary", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("round-trips only validated workout and adventure data", () => {
    saveMissionSession({
      workout: validWorkoutPlanFixture,
      adventure: validAdventureBlueprintFixture,
    });
    expect(loadMissionSession()).toEqual({
      workout: validWorkoutPlanFixture,
      adventure: validAdventureBlueprintFixture,
      cooldown: { durationSeconds: 15, steps: ["Slow march and settle your breathing", "Release shoulders and shake out your arms", "Stand tall for three calm breaths"] },
    });
  });

  it("rejects tampered session data", () => {
    sessionStorage.setItem(
      "ai-fitness-escape:mission-v1",
      JSON.stringify({ workout: validWorkoutPlanFixture, adventure: { invalid: true } }),
    );
    expect(loadMissionSession()).toBeNull();
  });

  it("round-trips finite calibration thresholds and rejects invalid values", () => {
    const thresholds = {
      standingHipY: 0.55,
      standingHipKneeRatio: 0.8,
      jumpDeltaPx: 0.06,
      squatHipKneeRatio: 0.45,
    };
    saveCalibrationThresholds(thresholds);
    expect(loadCalibrationThresholds()).toEqual(thresholds);
    localStorage.setItem(thresholdsKey, JSON.stringify({ schemaVersion: 1, poseModelVersion: "wrong", thresholds }));
    expect(loadCalibrationThresholds()).toBeNull();
  });
});
