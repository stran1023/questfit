import { adventureBlueprintSchema, challengeTemplateByMovement, supportedMovements, workoutPlanSchema } from "@/contracts";

export function createMovementCheckMission() {
  const workout=workoutPlanSchema.parse({schemaVersion:1,id:"movement-check-v1",goal:"general",durationMinutes:10,difficulty:1,exercises:supportedMovements.map((movement,index)=>({id:`check-${movement}`,movement,mode:movement==="plank"?"hold":"reps",target:1,restSeconds:index===supportedMovements.length-1?undefined:5}))});
  const adventure=adventureBlueprintSchema.parse({schemaVersion:1,id:"movement-check-adventure-v1",workoutPlanId:workout.id,theme:"volcano-escape",title:"Full Movement Check",segments:workout.exercises.map((exercise,index)=>({id:`check-segment-${index+1}`,exerciseId:exercise.id,challengeTemplate:challengeTemplateByMovement[exercise.movement],target:exercise.target,order:index+1})),rewards:{baseXp:100}});
  return {workout,adventure};
}
