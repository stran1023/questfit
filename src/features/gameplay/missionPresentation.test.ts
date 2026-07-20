import { describe, expect, it } from "vitest";
import { supportedMovements } from "@/contracts";
import type { MissionSnapshot } from "./missionController";
import { encounterByMovement, encounterProgressAt, missionPresentationFeedback, runnerActionByMovement } from "./missionPresentation";

const snapshot = (changes: Partial<MissionSnapshot> = {}): MissionSnapshot => ({
  status: "playing",
  segmentIndex: 0,
  segmentProgress: 0,
  missionProgress: 0,
  xpEarned: 0,
  combo: 0,
  misses: 0,
  totalMisses: 0,
  completedByExercise: {},
  pauseReason: null,
  ...changes,
});

describe("mission presentation", () => {
  it("defines a readable encounter for every supported movement", () => {
    expect(Object.keys(encounterByMovement)).toEqual(expect.arrayContaining([...supportedMovements]));
    for (const movement of supportedMovements) {
      expect(encounterByMovement[movement].title.length).toBeGreaterThan(4);
      expect(encounterByMovement[movement].instruction).toMatch(/!$/);
    }
    expect(encounterByMovement["punch-left"].kind).not.toBe(encounterByMovement["punch-right"].kind);
    expect(encounterByMovement["push-up"].kind).not.toBe(encounterByMovement.plank.kind);
    expect(Object.keys(runnerActionByMovement)).toEqual(expect.arrayContaining([...supportedMovements]));
    expect(runnerActionByMovement.jump).toBe("leap");
    expect(runnerActionByMovement.squat).toBe("duck");
    expect(runnerActionByMovement["punch-left"]).not.toBe(runnerActionByMovement["punch-right"]);
  });

  it("numbers repeated movement encounters without changing their movement identity", () => {
    const movements = ["jumping-jack", "squat", "lunge", "squat", "lunge", "jump"] as const;
    expect(encounterProgressAt([...movements], 1)).toEqual({ index: 1, total: 2 });
    expect(encounterProgressAt([...movements], 3)).toEqual({ index: 2, total: 2 });
    expect(encounterProgressAt([...movements], 5)).toEqual({ index: 1, total: 1 });
  });

  it("derives feedback only from authoritative snapshot changes", () => {
    const previous = snapshot({ combo: 2, xpEarned: 20 });
    expect(missionPresentationFeedback(previous, snapshot({ combo: 3, xpEarned: 30 }))).toEqual({
      xpGained: 10,
      objectiveChanged: false,
      comboMilestone: true,
      completed: false,
      missAdded: false,
    });
    expect(missionPresentationFeedback(previous, snapshot({ status: "complete", segmentIndex: 1, xpEarned: 130, totalMisses: 1 }))).toMatchObject({
      xpGained: 110,
      objectiveChanged: true,
      completed: true,
      missAdded: true,
    });
  });
});
