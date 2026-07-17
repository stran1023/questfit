export const supportedMovements = [
  "jump",
  "squat",
  "lunge",
  "high-knees",
  "jumping-jack",
  "punch-left",
  "punch-right",
  "side-reach-left",
  "side-reach-right",
  "push-up",
  "plank",
] as const;

export type SupportedMovement = (typeof supportedMovements)[number];

export const challengeTemplateByMovement = {
  jump: "broken-platforms",
  squat: "stone-gate",
  lunge: "lava-stride",
  "high-knees": "ember-sprint",
  "jumping-jack": "energy-beacon",
  "punch-left": "left-crystal",
  "punch-right": "right-crystal",
  "side-reach-left": "left-rune",
  "side-reach-right": "right-rune",
  "push-up": "rising-platform",
  plank: "shield-hold",
} as const satisfies Record<SupportedMovement, string>;

export const supportedChallengeTemplates = [
  "broken-platforms",
  "stone-gate",
  "lava-stride",
  "ember-sprint",
  "energy-beacon",
  "left-crystal",
  "right-crystal",
  "left-rune",
  "right-rune",
  "rising-platform",
  "shield-hold",
] as const;
