import type { SupportedMovement, WorkoutPlan } from "@/contracts";
import { planRationaleSchema, type PlanRationale, type WorkoutRequest } from "./planningSchemas";

type PlannedMovement = { movement: SupportedMovement; baseTarget: number };

const goalSequences: Record<WorkoutRequest["goal"], PlannedMovement[]> = {
  general: [
    { movement: "jumping-jack", baseTarget: 4 },
    { movement: "squat", baseTarget: 5 },
    { movement: "punch-left", baseTarget: 3 },
    { movement: "high-knees", baseTarget: 6 },
    { movement: "punch-right", baseTarget: 3 },
    { movement: "side-reach-left", baseTarget: 3 },
    { movement: "jump", baseTarget: 3 },
  ],
  cardio: [
    { movement: "jumping-jack", baseTarget: 5 },
    { movement: "punch-left", baseTarget: 4 },
    { movement: "high-knees", baseTarget: 8 },
    { movement: "punch-right", baseTarget: 4 },
    { movement: "jump", baseTarget: 4 },
    { movement: "side-reach-left", baseTarget: 3 },
    { movement: "squat", baseTarget: 5 },
  ],
  strength: [
    { movement: "jumping-jack", baseTarget: 3 },
    { movement: "squat", baseTarget: 6 },
    { movement: "lunge", baseTarget: 4 },
    { movement: "squat", baseTarget: 5 },
    { movement: "lunge", baseTarget: 4 },
    { movement: "squat", baseTarget: 5 },
    { movement: "jump", baseTarget: 3 },
  ],
  mobility: [
    { movement: "high-knees", baseTarget: 4 },
    { movement: "side-reach-left", baseTarget: 4 },
    { movement: "side-reach-right", baseTarget: 4 },
    { movement: "squat", baseTarget: 4 },
    { movement: "lunge", baseTarget: 3 },
    { movement: "punch-left", baseTarget: 3 },
    { movement: "punch-right", baseTarget: 3 },
  ],
};

const replacementPoolByGoal: Record<WorkoutRequest["goal"], PlannedMovement[]> = {
  general: [
    { movement: "punch-left", baseTarget: 3 }, { movement: "punch-right", baseTarget: 3 },
    { movement: "side-reach-left", baseTarget: 3 }, { movement: "side-reach-right", baseTarget: 3 },
    { movement: "squat", baseTarget: 4 }, { movement: "high-knees", baseTarget: 5 },
  ],
  cardio: [
    { movement: "punch-left", baseTarget: 4 }, { movement: "punch-right", baseTarget: 4 },
    { movement: "high-knees", baseTarget: 6 }, { movement: "squat", baseTarget: 4 },
    { movement: "side-reach-left", baseTarget: 3 }, { movement: "side-reach-right", baseTarget: 3 },
  ],
  strength: [
    { movement: "squat", baseTarget: 5 }, { movement: "lunge", baseTarget: 4 },
    { movement: "punch-left", baseTarget: 4 }, { movement: "punch-right", baseTarget: 4 },
    { movement: "side-reach-left", baseTarget: 3 }, { movement: "side-reach-right", baseTarget: 3 },
  ],
  mobility: [
    { movement: "side-reach-left", baseTarget: 4 }, { movement: "side-reach-right", baseTarget: 4 },
    { movement: "squat", baseTarget: 3 }, { movement: "high-knees", baseTarget: 4 },
    { movement: "punch-left", baseTarget: 2 }, { movement: "punch-right", baseTarget: 2 },
  ],
};

const goalSummary: Record<WorkoutRequest["goal"], string> = {
  general: "A balanced standing session that alternates cardio, lower-body work, and directional movement.",
  cardio: "A faster-paced standing circuit that builds heart-rate effort, then finishes under control.",
  strength: "A controlled strength circuit centered on squats and lunges with active upper-body intervals.",
  mobility: "A gentle standing sequence that prioritizes range, control, and low-impact transitions.",
};

function limitationFlags(limitations: string) {
  const normalized = limitations.toLowerCase();
  return {
    knee: /\b(knee|ankle)\b|no jump|low impact/.test(normalized),
    shoulder: /\b(shoulder|arm|wrist)\b/.test(normalized),
    floor: /\b(floor|space|mat)\b/.test(normalized),
  };
}

function excludedMovements(request: WorkoutRequest) {
  const flags = limitationFlags(request.movementLimitations);
  const excluded = new Set<SupportedMovement>(["push-up", "plank"]);
  if (flags.knee) ["jump", "jumping-jack", "lunge"].forEach((movement) => excluded.add(movement as SupportedMovement));
  if (flags.shoulder) ["jumping-jack", "punch-left", "punch-right", "side-reach-left", "side-reach-right", "push-up", "plank"].forEach((movement) => excluded.add(movement as SupportedMovement));
  return { excluded, flags };
}

function phaseSequence(count: number): PlanRationale["phases"][number]["phase"][] {
  if (count === 5) return ["warm-up", "primary", "variation", "peak", "finish"];
  if (count === 6) return ["warm-up", "primary", "primary", "variation", "peak", "finish"];
  return ["warm-up", "warm-up", "primary", "primary", "variation", "peak", "finish"];
}

function intensityFor(request: WorkoutRequest): PlanRationale["intensity"] {
  if (request.goal === "mobility" || request.activityFrequency === "rarely") return "gentle";
  if (request.fitnessLevel === "intermediate" && ["regular", "frequent"].includes(request.activityFrequency)) return "challenging";
  return "moderate";
}

export function selectPlannedMovements(request: WorkoutRequest): PlannedMovement[] {
  const count = request.durationMinutes === 10 ? 5 : request.durationMinutes === 15 ? 6 : 7;
  const { excluded } = excludedMovements(request);
  const sequence = goalSequences[request.goal];
  const defaultIndexes = count === 5 ? [0, 1, 2, 5, 6] : count === 6 ? [0, 1, 2, 3, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
  const generalIndexes = count === 5 ? [0, 1, 2, 4, 6] : count === 6 ? [0, 1, 2, 3, 4, 6] : [0, 1, 2, 3, 4, 5, 6];
  const cardioIndexes = count === 5 ? [0, 1, 2, 3, 4] : count === 6 ? [0, 1, 2, 3, 4, 6] : [0, 1, 2, 3, 4, 5, 6];
  const strengthIndexes = count === 5 ? [0, 1, 2, 3, 6] : count === 6 ? [0, 1, 2, 3, 4, 6] : [0, 1, 2, 3, 4, 5, 6];
  const selectedIndexes = request.goal === "general" ? generalIndexes : request.goal === "cardio" ? cardioIndexes : request.goal === "strength" ? strengthIndexes : defaultIndexes;
  const selected = selectedIndexes.map((index) => sequence[index]).filter(({ movement }) => !excluded.has(movement));
  const eligibleReplacements = replacementPoolByGoal[request.goal].filter(({ movement }) => !excluded.has(movement));
  let replacementIndex = 0;
  while (selected.length < count && eligibleReplacements.length > 0) {
    selected.push(eligibleReplacements[replacementIndex % eligibleReplacements.length]);
    replacementIndex += 1;
  }
  return selected.slice(0, count);
}

export function targetMultiplier(request: WorkoutRequest) {
  const level = request.fitnessLevel === "intermediate" ? 1.25 : 1;
  const activity = { rarely: 0.8, weekly: 1, regular: 1.1, frequent: 1.2 }[request.activityFrequency];
  return level * activity;
}

export function restSecondsFor(request: WorkoutRequest, movement: SupportedMovement) {
  const base = request.goal === "strength" ? 20 : request.goal === "cardio" ? 10 : 15;
  const impact = ["jump", "jumping-jack", "high-knees", "lunge"].includes(movement) ? 5 : 0;
  const beginner = request.fitnessLevel === "beginner" ? 5 : 0;
  return Math.min(35, base + impact + beginner);
}

export function createPlanRationale(request: WorkoutRequest, workout: WorkoutPlan): PlanRationale {
  const { flags } = excludedMovements(request);
  const intensity = intensityFor(request);
  const reasons = [
    `${request.goal === "general" ? "General fitness" : request.goal[0].toUpperCase() + request.goal.slice(1)} intent determines the movement balance and order.`,
    `${request.durationMinutes} minutes creates ${workout.exercises.length} focused stages without unnecessary camera transitions.`,
    `${request.fitnessLevel === "beginner" ? "Beginner" : "Intermediate"} level with ${request.activityFrequency} activity sets ${intensity} targets and recovery.`,
    "All objectives stay standing and front-facing for a reliable hands-free mission.",
  ];
  if (flags.knee) reasons.push("Reported knee, ankle, or impact concerns remove jumps, jumping jacks, and lunges.");
  if (flags.shoulder) reasons.push("Reported upper-body concerns remove overhead, punching, reaching, and floor-loading movements.");
  if (flags.floor) reasons.push("Reported floor or space constraints are respected by keeping the mission standing.");
  const phases = phaseSequence(workout.exercises.length).map((phase, index) => ({ exerciseId: workout.exercises[index].id, phase }));
  return planRationaleSchema.parse({ summary: goalSummary[request.goal], intensity, reasons: reasons.slice(0, 6), phases });
}

export function isWorkoutPolicyCompliant(request: WorkoutRequest, workout: WorkoutPlan) {
  const { excluded } = excludedMovements(request);
  return workout.goal === request.goal && workout.durationMinutes === request.durationMinutes && workout.exercises.length >= 5 && workout.exercises.length <= 7 && workout.exercises.every((exercise) => !excluded.has(exercise.movement) && exercise.mode === "reps");
}
