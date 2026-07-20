import { z } from "zod";
import { movementEventSchema, type MovementEvent } from "@/contracts";
import type { Landmark, LandmarkFrame } from "./calibrationDomain";

export const floorThresholdsSchema = z.strictObject({
  sideViewWidthRatio: z.number().finite().min(0.03).max(0.8),
  pushUpDownDegrees: z.number().finite().min(55).max(120),
  pushUpUpDegrees: z.number().finite().min(125).max(180),
  plankAlignmentDegrees: z.number().finite().min(140).max(180),
  plankStartMs: z.number().int().min(300).max(5_000),
});
export type FloorThresholds = z.infer<typeof floorThresholdsSchema>;
export const defaultFloorThresholds: FloorThresholds = {
  sideViewWidthRatio: 0.45,
  pushUpDownDegrees: 105,
  pushUpUpDegrees: 150,
  plankAlignmentDegrees: 155,
  plankStartMs: 800,
};

function angle(a: Landmark | undefined, b: Landmark | undefined, c: Landmark | undefined) {
  if (!a || !b || !c) return NaN;
  const abx=a.x-b.x, aby=a.y-b.y, cbx=c.x-b.x, cby=c.y-b.y;
  const denominator=Math.hypot(abx,aby)*Math.hypot(cbx,cby);
  if (!denominator) return NaN;
  return Math.acos(Math.max(-1,Math.min(1,(abx*cbx+aby*cby)/denominator)))*180/Math.PI;
}
function averageFinite(values:number[]) { const valid=values.filter(Number.isFinite); return valid.length ? valid.reduce((a,b)=>a+b,0)/valid.length : NaN; }
function elbowAngle(frame:LandmarkFrame) { return averageFinite([angle(frame[11],frame[13],frame[15]),angle(frame[12],frame[14],frame[16])]); }
function bodyAngle(frame:LandmarkFrame) { return averageFinite([angle(frame[11],frame[23],frame[27]),angle(frame[12],frame[24],frame[28])]); }
function sideViewRatio(frame:LandmarkFrame) {
  const shoulderWidth=Math.hypot((frame[12]?.x??NaN)-(frame[11]?.x??NaN),(frame[12]?.y??NaN)-(frame[11]?.y??NaN));
  const torsoLength=averageFinite([
    Math.hypot((frame[23]?.x??NaN)-(frame[11]?.x??NaN),(frame[23]?.y??NaN)-(frame[11]?.y??NaN)),
    Math.hypot((frame[24]?.x??NaN)-(frame[12]?.x??NaN),(frame[24]?.y??NaN)-(frame[12]?.y??NaN)),
  ]);
  return shoulderWidth/torsoLength;
}
export function isSideViewReady(frame:LandmarkFrame, threshold=defaultFloorThresholds.sideViewWidthRatio) { const ratio=sideViewRatio(frame); return Number.isFinite(ratio)&&ratio<=threshold; }

export function deriveFloorThresholds(pushUpDown:LandmarkFrame[],pushUpUp:LandmarkFrame[],plank:LandmarkFrame[]):FloorThresholds {
  const downs=pushUpDown.map(elbowAngle).filter(Number.isFinite), ups=pushUpUp.map(elbowAngle).filter(Number.isFinite), alignments=plank.map(bodyAngle).filter(Number.isFinite), views=[...pushUpDown,...pushUpUp,...plank].map(sideViewRatio).filter(Number.isFinite);
  if(downs.length<2||ups.length<2||alignments.length<2||views.length<4) throw new Error("Clear side-view push-up and plank samples are required.");
  const down=Math.min(...downs), up=Math.max(...ups), alignment=Math.max(...alignments);
  if(up-down<25||alignment<140) throw new Error("Use a clearer push-up range and straighter plank alignment.");
  return floorThresholdsSchema.parse({sideViewWidthRatio:Math.max(.03,Math.min(.8,Math.max(...views)*1.3)),pushUpDownDegrees:Math.max(55,Math.min(120,down+10)),pushUpUpDegrees:Math.max(125,Math.min(180,up-8)),plankAlignmentDegrees:Math.max(140,Math.min(180,alignment-8)),plankStartMs:800});
}

export function createFloorMovementEmitter(raw:FloorThresholds=defaultFloorThresholds,now:()=>number=()=>Date.now()) {
  const thresholds=floorThresholdsSchema.parse(raw);
  let downFrames=0, pushUpDown=false, plankCandidateAt:number|null=null, plankActive=false, plankHeld=false;
  const emit=(movement:"push-up"|"plank",phase:"started"|"completed"|"held"|"released",confidence:number):MovementEvent=>movementEventSchema.parse({movement,phase,confidence,occurredAtMs:now()});
  return {
    push(frame:LandmarkFrame,confidence=1):MovementEvent|null {
      if(!isSideViewReady(frame,thresholds.sideViewWidthRatio)) { downFrames=0; pushUpDown=false; plankCandidateAt=null; if(plankActive){plankActive=false;plankHeld=false;return emit("plank","released",confidence);} return null; }
      const elbow=elbowAngle(frame), aligned=bodyAngle(frame)>=thresholds.plankAlignmentDegrees;
      if(elbow<=thresholds.pushUpDownDegrees){downFrames+=1;plankCandidateAt=null;if(downFrames>=3)pushUpDown=true;return null;}
      downFrames=0;
      if(pushUpDown&&elbow>=thresholds.pushUpUpDegrees){pushUpDown=false;return emit("push-up","completed",confidence);}
      if(aligned&&elbow>=thresholds.pushUpUpDegrees){
        const current=now();
        if(plankCandidateAt===null){plankCandidateAt=current;return null;}
        if(!plankActive&&current-plankCandidateAt>=thresholds.plankStartMs){plankActive=true;return emit("plank","started",confidence);}
        if(plankActive&&!plankHeld&&current-plankCandidateAt>=thresholds.plankStartMs*2){plankHeld=true;return emit("plank","held",confidence);}
        return null;
      }
      plankCandidateAt=null;
      if(plankActive){plankActive=false;plankHeld=false;return emit("plank","released",confidence);}
      return null;
    },
    reset(){downFrames=0;pushUpDown=false;plankCandidateAt=null;plankActive=false;plankHeld=false;},
  };
}
