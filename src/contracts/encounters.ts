import type { SupportedMovement } from "./movements";

export type EncounterCopy = {
  title: string;
  movementLabel: string;
  instruction: string;
  spokenInstruction: string;
};

export const encounterCopyByMovement = {
  jump: { title: "Boulder leap", movementLabel: "jump", instruction: "Jump clear!", spokenInstruction: "Jump and land still." },
  squat: { title: "Flame gate", movementLabel: "squat", instruction: "Get low!", spokenInstruction: "Squat low and stand fully." },
  lunge: { title: "Broken bridge", movementLabel: "lunge", instruction: "Lunge across!", spokenInstruction: "Lunge and return to standing." },
  "high-knees": { title: "Lava steps", movementLabel: "high knees", instruction: "Drive your knees!", spokenInstruction: "Alternate left and right knees." },
  "jumping-jack": { title: "Storm gate", movementLabel: "jumping jack", instruction: "Power the portal!", spokenInstruction: "Open arms and feet, then close." },
  "punch-left": { title: "Left rock wall", movementLabel: "left punch", instruction: "Strike left!", spokenInstruction: "Extend your left fist and return to guard." },
  "punch-right": { title: "Right rock wall", movementLabel: "right punch", instruction: "Strike right!", spokenInstruction: "Extend your right fist and return to guard." },
  "side-reach-left": { title: "Left ember vines", movementLabel: "left side reach", instruction: "Reach left!", spokenInstruction: "Reach left and return upright." },
  "side-reach-right": { title: "Right ember vines", movementLabel: "right side reach", instruction: "Reach right!", spokenInstruction: "Reach right and return upright." },
  "push-up": { title: "Low tunnel", movementLabel: "push-up", instruction: "Push through!", spokenInstruction: "Turn sideways, lower, then fully extend." },
  plank: { title: "Ember storm", movementLabel: "plank", instruction: "Hold the shield!", spokenInstruction: "Turn sideways and hold a straight plank." },
} as const satisfies Record<SupportedMovement, EncounterCopy>;

export type EncounterProgress = { index: number; total: number };

export function encounterStageTitle(movement: SupportedMovement, progress: EncounterProgress) {
  const base = encounterCopyByMovement[movement].title;
  return progress.total > 1 ? `${base} · Stage ${progress.index} of ${progress.total}` : base;
}
