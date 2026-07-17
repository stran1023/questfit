import {describe,expect,it} from "vitest";
import {supportedMovements} from "@/contracts";
import {createMissionMovementRuntime,detectorFamilyFor} from "./missionMovementRuntime";

const thresholds={jumpDeltaPx:.04,squatHipKneeRatio:.45,standingHipY:.55,standingHipKneeRatio:.8};
function frame(complete=true){const value=Array.from({length:complete?33:10},()=>({x:.5,y:.5,visibility:1}));if(complete){value[11]={x:.35,y:.3,visibility:1};value[12]={x:.65,y:.3,visibility:1};value[23]={x:.4,y:.55,visibility:1};value[24]={x:.6,y:.55,visibility:1};value[25]={x:.4,y:.75,visibility:1};value[26]={x:.6,y:.75,visibility:1};value[27]={x:.4,y:.95,visibility:1};value[28]={x:.6,y:.95,visibility:1};}return value}

describe("mission movement runtime",()=>{
 it("routes every registered movement to exactly one detector family",()=>{expect(supportedMovements.map(movement=>[movement,detectorFamilyFor(movement)])).toEqual([
  ["jump","vertical"],["squat","vertical"],["lunge","vertical"],["high-knees","vertical"],["jumping-jack","standing-upper"],["punch-left","standing-upper"],["punch-right","standing-upper"],["side-reach-left","standing-upper"],["side-reach-right","standing-upper"],["push-up","floor"],["plank","floor"],
 ])});
 it("reports objective-specific framing before running a detector",()=>{const runtime=createMissionMovementRuntime(thresholds);expect(runtime.push(frame(false),"squat").readiness).toBe("needs-full-body");expect(runtime.push(frame(),"push-up").readiness).toBe("needs-side-view");expect(runtime.push(frame(),"squat").readiness).toBe("tracking")});
});
