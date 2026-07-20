import { encounterCopyByMovement, type EncounterProgress, type SupportedMovement } from "@/contracts";
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

export type RunnerAction = "leap" | "duck" | "stride" | "sprint" | "power" | "strike-left" | "strike-right" | "reach-left" | "reach-right" | "push" | "shield";

export const runnerActionByMovement: Record<SupportedMovement, RunnerAction> = {
  jump: "leap",
  squat: "duck",
  lunge: "stride",
  "high-knees": "sprint",
  "jumping-jack": "power",
  "punch-left": "strike-left",
  "punch-right": "strike-right",
  "side-reach-left": "reach-left",
  "side-reach-right": "reach-right",
  "push-up": "push",
  plank: "shield",
};

export const encounterByMovement: Record<SupportedMovement, EncounterPresentation> = {
  jump: { ...encounterCopyByMovement.jump, kind: "boulder", color: 0x64748b, accent: 0x67e8f9 },
  squat: { ...encounterCopyByMovement.squat, kind: "fire-gate", color: 0xf97316, accent: 0xfbbf24 },
  lunge: { ...encounterCopyByMovement.lunge, kind: "broken-bridge", color: 0x475569, accent: 0xa7f3d0 },
  "high-knees": { ...encounterCopyByMovement["high-knees"], kind: "lava-steps", color: 0xef4444, accent: 0xfde68a },
  "jumping-jack": { ...encounterCopyByMovement["jumping-jack"], kind: "storm-gate", color: 0x7c3aed, accent: 0x67e8f9 },
  "punch-left": { ...encounterCopyByMovement["punch-left"], kind: "left-wall", color: 0x9f1239, accent: 0xfda4af },
  "punch-right": { ...encounterCopyByMovement["punch-right"], kind: "right-wall", color: 0x9f1239, accent: 0xfda4af },
  "side-reach-left": { ...encounterCopyByMovement["side-reach-left"], kind: "left-vines", color: 0x15803d, accent: 0x86efac },
  "side-reach-right": { ...encounterCopyByMovement["side-reach-right"], kind: "right-vines", color: 0x15803d, accent: 0x86efac },
  "push-up": { ...encounterCopyByMovement["push-up"], kind: "low-tunnel", color: 0x334155, accent: 0x93c5fd },
  plank: { ...encounterCopyByMovement.plank, kind: "ember-storm", color: 0xb45309, accent: 0xfde68a },
};

export function encounterProgressAt(movements: SupportedMovement[], segmentIndex: number): EncounterProgress {
  const movement = movements[segmentIndex];
  if (!movement) return { index: 1, total: 1 };
  const total = movements.filter((candidate) => candidate === movement).length;
  const index = movements.slice(0, segmentIndex + 1).filter((candidate) => candidate === movement).length;
  return { index, total };
}

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
