import type { SupportedMovement } from "@/contracts";
import type { MissionSnapshot } from "./missionController";

export type BossMove = "attack" | "dodge";
export type BossState = "approach" | "awakened" | "battle" | "defeated";

const dodgeMovements = new Set<SupportedMovement>(["jump", "squat", "lunge", "side-reach-left", "side-reach-right", "plank"]);

export function bossMoveFor(movement: SupportedMovement): BossMove {
  return dodgeMovements.has(movement) ? "dodge" : "attack";
}

export function bossBattleView(snapshot: MissionSnapshot, movement: SupportedMovement) {
  const state: BossState = snapshot.status === "complete" ? "defeated" : snapshot.missionProgress < 45 ? "approach" : snapshot.missionProgress < 65 ? "awakened" : "battle";
  const health = state === "approach" || state === "awakened" ? 100 : Math.max(0, Math.round((100 - snapshot.missionProgress) / 0.35));
  const move = bossMoveFor(movement);
  return {
    state,
    health,
    move,
    story: state === "approach" ? "ASH TITAN · DISTANT THREAT" : state === "awakened" ? "THE ASH TITAN AWAKENS" : state === "defeated" ? "ASH TITAN DEFEATED" : "FINAL BATTLE",
    telegraph: move === "attack" ? "STRIKE NOW" : movement === "plank" ? "BLOCK THE IMPACT" : "DODGE THE ATTACK",
  };
}
