import { describe, expect, it } from "vitest";
import { bossBattleView, bossMoveFor } from "./bossBattle";
import type { MissionSnapshot } from "./missionController";

const snapshot: MissionSnapshot = { status: "playing", segmentIndex: 3, segmentProgress: 0, missionProgress: 70, xpEarned: 50, combo: 5, misses: 0, totalMisses: 0, completedByExercise: {}, pauseReason: null };

describe("boss battle presentation", () => {
  it("maps supported movements to direct attacks or defensive dodges", () => {
    expect(bossMoveFor("punch-left")).toBe("attack");
    expect(bossMoveFor("high-knees")).toBe("attack");
    expect(bossMoveFor("jump")).toBe("dodge");
    expect(bossMoveFor("squat")).toBe("dodge");
    expect(bossMoveFor("plank")).toBe("dodge");
  });

  it("derives boss state and health only from authoritative mission progress", () => {
    expect(bossBattleView({ ...snapshot, missionProgress: 20 }, "jump")).toMatchObject({ state: "approach", health: 100 });
    expect(bossBattleView({ ...snapshot, missionProgress: 50 }, "jump")).toMatchObject({ state: "awakened", health: 100 });
    expect(bossBattleView(snapshot, "punch-left")).toMatchObject({ state: "battle", health: 86, move: "attack" });
    expect(bossBattleView({ ...snapshot, status: "complete", missionProgress: 100 }, "jump")).toMatchObject({ state: "defeated", health: 0 });
  });
});
