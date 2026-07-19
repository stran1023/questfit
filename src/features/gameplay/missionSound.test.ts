import { describe, expect, it } from "vitest";
import type { MissionSnapshot } from "./missionController";
import { missionMusicTier, missionSoundCue } from "./missionSound";

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

describe("mission sound cues", () => {
  it("prioritizes factual completion, misses, transitions, combo, then success", () => {
    const base = snapshot();
    expect(missionSoundCue(base, snapshot({ xpEarned: 10, combo: 1 }))).toBe("success");
    expect(missionSoundCue(snapshot({ combo: 2 }), snapshot({ xpEarned: 10, combo: 3 }))).toBe("combo");
    expect(missionSoundCue(base, snapshot({ segmentIndex: 1, xpEarned: 10 }))).toBe("transition");
    expect(missionSoundCue(base, snapshot({ totalMisses: 1 }))).toBe("miss");
    expect(missionSoundCue(base, snapshot({ status: "complete", xpEarned: 100 }))).toBe("complete");
    expect(missionSoundCue(base, base)).toBeNull();
  });

  it("derives soundtrack urgency only from authoritative mission progress", () => {
    expect(missionMusicTier(0)).toBe("calm");
    expect(missionMusicTier(34)).toBe("calm");
    expect(missionMusicTier(35)).toBe("rising");
    expect(missionMusicTier(74)).toBe("rising");
    expect(missionMusicTier(75)).toBe("escape");
    expect(missionMusicTier(100)).toBe("escape");
  });
});
