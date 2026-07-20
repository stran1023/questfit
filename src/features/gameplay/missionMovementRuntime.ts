import type { MovementEvent, SupportedMovement } from "@/contracts";
import { createFloorMovementEmitter, isSideViewReady } from "@/features/calibration/floorMovements";
import { createLowerBodyMovementEmitter } from "@/features/calibration/lowerBodyMovements";
import { createMovementEventEmitter } from "@/features/calibration/movementEvents";
import { createStandingUpperMovementEmitter } from "@/features/calibration/standingUpperMovements";
import type { CalibrationThresholds, LandmarkFrame } from "@/features/calibration/calibrationDomain";

export type DetectorFamily = "vertical" | "standing-upper" | "floor";
export type PoseReadiness = "tracking" | "needs-full-body" | "needs-side-view";

const familyByMovement: Record<SupportedMovement, DetectorFamily> = {
  squat: "vertical", jump: "vertical", lunge: "vertical", "high-knees": "vertical",
  "jumping-jack": "standing-upper", "punch-left": "standing-upper", "punch-right": "standing-upper",
  "side-reach-left": "standing-upper", "side-reach-right": "standing-upper",
  "push-up": "floor", plank: "floor",
};

export function detectorFamilyFor(movement: SupportedMovement) { return familyByMovement[movement]; }

function fullBodyVisible(frame: LandmarkFrame) {
  return frame.length >= 29 && [0,11,12,23,24,25,26,27,28].every((index) => (frame[index]?.visibility ?? 1) >= .5);
}

function confidence(frame: LandmarkFrame) {
  const values=[0,11,12,13,14,15,16,23,24,25,26,27,28].map(index=>frame[index]?.visibility??0);
  return values.reduce((sum,value)=>sum+value,0)/values.length;
}

export function createMissionMovementRuntime(thresholds: CalibrationThresholds, now:()=>number=()=>Date.now()) {
  const vertical=createMovementEventEmitter(thresholds,now);
  const lower=createLowerBodyMovementEmitter(undefined,now);
  const upper=createStandingUpperMovementEmitter(undefined,now);
  const floor=createFloorMovementEmitter(undefined,now);
  let target:SupportedMovement|null=null;
  const reset=()=>{vertical.reset();lower.reset();upper.reset();floor.reset();};

  return {
    push(frame:LandmarkFrame,nextTarget:SupportedMovement):{readiness:PoseReadiness;event:MovementEvent|null} {
      if(nextTarget!==target){target=nextTarget;reset();}
      if(!fullBodyVisible(frame))return {readiness:"needs-full-body",event:null};
      const family=detectorFamilyFor(nextTarget);
      if(family==="floor"&&!isSideViewReady(frame))return {readiness:"needs-side-view",event:null};
      const certainty=confidence(frame);
      let event:MovementEvent|null=null;
      if(family==="floor")event=floor.push(frame,certainty);
      else if(family==="standing-upper")event=upper.push(frame,certainty);
      else if(nextTarget==="squat"||nextTarget==="jump")event=vertical.push(frame,certainty);
      else event=lower.push(frame,certainty);
      return {readiness:"tracking",event:event?.movement===nextTarget?event:null};
    },
    reset,
  };
}
