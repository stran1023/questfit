import type { SupportedMovement } from "@/contracts";
import type { MissionSnapshot } from "./missionController";

export type EncounterKind =
  | "boulder"
  | "fire-gate"
  | "broken-bridge"
  | "lava-steps"
  | "storm-gate"
  | "left-wall"
  | "right-wall"
  | "left-vines"
  | "right-vines"
  | "low-tunnel"
  | "ember-storm";

export type EncounterPresentation = {
  title: string;
  instruction: string;
  kind: EncounterKind;
  color: number;
  accent: number;
};

export const encounterByMovement: Record<SupportedMovement, EncounterPresentation> = {
  jump: { title: "Boulder leap", instruction: "Jump clear!", kind: "boulder", color: 0x64748b, accent: 0x67e8f9 },
  squat: { title: "Flame gate", instruction: "Get low!", kind: "fire-gate", color: 0xf97316, accent: 0xfbbf24 },
  lunge: { title: "Broken bridge", instruction: "Lunge across!", kind: "broken-bridge", color: 0x475569, accent: 0xa7f3d0 },
  "high-knees": { title: "Lava steps", instruction: "Drive your knees!", kind: "lava-steps", color: 0xef4444, accent: 0xfde68a },
  "jumping-jack": { title: "Storm gate", instruction: "Power the portal!", kind: "storm-gate", color: 0x7c3aed, accent: 0x67e8f9 },
  "punch-left": { title: "Left rock wall", instruction: "Strike left!", kind: "left-wall", color: 0x9f1239, accent: 0xfda4af },
  "punch-right": { title: "Right rock wall", instruction: "Strike right!", kind: "right-wall", color: 0x9f1239, accent: 0xfda4af },
  "side-reach-left": { title: "Left ember vines", instruction: "Reach left!", kind: "left-vines", color: 0x15803d, accent: 0x86efac },
  "side-reach-right": { title: "Right ember vines", instruction: "Reach right!", kind: "right-vines", color: 0x15803d, accent: 0x86efac },
  "push-up": { title: "Low tunnel", instruction: "Push through!", kind: "low-tunnel", color: 0x334155, accent: 0x93c5fd },
  plank: { title: "Ember storm", instruction: "Hold the shield!", kind: "ember-storm", color: 0xb45309, accent: 0xfde68a },
};

export type MissionPresentationFeedback = {
  xpGained: number;
  objectiveChanged: boolean;
  comboMilestone: boolean;
  completed: boolean;
  missAdded: boolean;
};

export function missionPresentationFeedback(
  previous: MissionSnapshot,
  next: MissionSnapshot,
): MissionPresentationFeedback {
  return {
    xpGained: Math.max(0, next.xpEarned - previous.xpEarned),
    objectiveChanged: next.segmentIndex !== previous.segmentIndex,
    comboMilestone: next.combo > previous.combo && next.combo > 0 && next.combo % 3 === 0,
    completed: previous.status !== "complete" && next.status === "complete",
    missAdded: next.totalMisses > previous.totalMisses,
  };
}
