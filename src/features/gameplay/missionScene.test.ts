import { describe, expect, it } from "vitest";
import { missionSceneView } from "./missionScene";

const snapshot = {
  status: "playing" as const,
  segmentIndex: 0,
  segmentProgress: 2,
  missionProgress: 40,
  xpEarned: 20,
  combo: 2,
  misses: 0,
  totalMisses: 0,
  completedByExercise: {},
  pauseReason: null,
};

describe("missionSceneView", () => {
  it("maps authoritative progress and movement copy into scene state", () => {
    expect(missionSceneView({ snapshot, target: "punch-left" })).toEqual({
      objective: "Left punch",
      status: "ESCAPE IN PROGRESS",
      progressLabel: "40% TO SAFETY",
      progress: 0.4,
      playerX: 402,
    });
  });

  it("clamps scene progress and exposes pause/complete states", () => {
    expect(missionSceneView({ snapshot: { ...snapshot, status: "paused", missionProgress: -4 }, target: "plank" }).status).toBe("MISSION PAUSED");
    expect(missionSceneView({ snapshot: { ...snapshot, status: "complete", missionProgress: 140 }, target: "jump" })).toMatchObject({ status: "ESCAPED", progress: 1, playerX: 828 });
  });
});
