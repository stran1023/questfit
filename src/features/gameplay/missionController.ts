import {
  movementEventSchema,
  type AdventureBlueprint,
  type MovementEvent,
  type WorkoutPlan,
} from "@/contracts";

export type MissionStatus = "ready" | "playing" | "paused" | "recovery" | "complete";
export type MissionSnapshot = {
  status: MissionStatus;
  segmentIndex: number;
  segmentProgress: number;
  missionProgress: number;
  xpEarned: number;
  combo: number;
  misses: number;
  totalMisses: number;
  completedByExercise: Record<string, number>;
  pauseReason: string | null;
};

export function createMissionController(workout: WorkoutPlan, blueprint: AdventureBlueprint) {
  const exerciseById = new Map(workout.exercises.map((exercise) => [exercise.id, exercise]));
  let snapshot: MissionSnapshot = { status: "ready", segmentIndex: 0, segmentProgress: 0, missionProgress: 0, xpEarned: 0, combo: 0, misses: 0, totalMisses: 0, completedByExercise: {}, pauseReason: null };
  const listeners = new Set<(value: MissionSnapshot) => void>();

  function publish() { const value={...snapshot}; for(const listener of listeners) listener(value); }
  function current() { return blueprint.segments[snapshot.segmentIndex]; }
  function calculateMissionProgress(segmentIndex:number, segmentProgress:number) {
    const completedTargets=blueprint.segments.slice(0,segmentIndex).reduce((sum,segment)=>sum+segment.target,0)+segmentProgress;
    const total=blueprint.segments.reduce((sum,segment)=>sum+segment.target,0);
    return total ? Math.round(completedTargets/total*100) : 0;
  }

  return {
    getSnapshot:()=>({...snapshot}),
    subscribe(listener:(value:MissionSnapshot)=>void){listeners.add(listener);return()=>listeners.delete(listener);},
    start(){if(snapshot.status!=="ready")return;snapshot={...snapshot,status:"playing"};publish();},
    consume(raw:MovementEvent){
      const event=movementEventSchema.parse(raw);
      if(snapshot.status!=="playing")return false;
      const segment=current(), exercise=segment&&exerciseById.get(segment.exerciseId);
      if(!segment||!exercise||event.movement!==exercise.movement)return false;
      const credit=exercise.mode==="hold" ? event.phase==="held" : event.phase==="completed";
      if(!credit)return false;
      const progress=Math.min(segment.target,snapshot.segmentProgress+1);
      const combo=snapshot.combo+1;
      snapshot={...snapshot,segmentProgress:progress,combo,xpEarned:snapshot.xpEarned+10,misses:0,completedByExercise:{...snapshot.completedByExercise,[exercise.id]:progress},missionProgress:calculateMissionProgress(snapshot.segmentIndex,progress)};
      if(progress>=segment.target){
        if(snapshot.segmentIndex===blueprint.segments.length-1)snapshot={...snapshot,status:"complete",missionProgress:100,xpEarned:snapshot.xpEarned+blueprint.rewards.baseXp};
        else snapshot={...snapshot,segmentIndex:snapshot.segmentIndex+1,segmentProgress:0};
      }
      publish();return true;
    },
    recordMiss(){if(snapshot.status!=="playing")return;const misses=snapshot.misses+1;snapshot={...snapshot,misses,totalMisses:snapshot.totalMisses+1,combo:0,status:misses>=3?"recovery":"playing",pauseReason:misses>=3?"Tracking needs recovery.":null};publish();},
    pause(reason="Mission paused."){if(snapshot.status!=="playing")return;snapshot={...snapshot,status:"paused",pauseReason:reason};publish();},
    resume(){if(snapshot.status!=="paused"&&snapshot.status!=="recovery")return;snapshot={...snapshot,status:"playing",misses:0,pauseReason:null};publish();},
    replay(){snapshot={status:"ready",segmentIndex:0,segmentProgress:0,missionProgress:0,xpEarned:0,combo:0,misses:0,totalMisses:0,completedByExercise:{},pauseReason:null};publish();},
  };
}
