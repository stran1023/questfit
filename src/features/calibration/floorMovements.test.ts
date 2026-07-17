import { describe,expect,it } from "vitest";
import type { LandmarkFrame } from "./calibrationDomain";
import { createFloorMovementEmitter,deriveFloorThresholds,isSideViewReady } from "./floorMovements";

function floorFrame(kind:"up"|"down"|"misaligned"="up"):LandmarkFrame{
 const p=Array.from({length:33},()=>({x:.5,y:.5,visibility:1}));
 Object.assign(p[11],{x:.3,y:.35});Object.assign(p[12],{x:.31,y:.36});Object.assign(p[23],{x:.5,y:kind==="misaligned"?.7:.55});Object.assign(p[24],{x:.51,y:kind==="misaligned"?.71:.56});Object.assign(p[27],{x:.7,y:.75});Object.assign(p[28],{x:.71,y:.76});
 if(kind==="down"){Object.assign(p[13],{x:.4,y:.45});Object.assign(p[15],{x:.5,y:.35});Object.assign(p[14],{x:.41,y:.46});Object.assign(p[16],{x:.51,y:.36});}
 else{Object.assign(p[13],{x:.4,y:.35});Object.assign(p[15],{x:.5,y:.35});Object.assign(p[14],{x:.41,y:.36});Object.assign(p[16],{x:.51,y:.36});}
 return p;
}
describe("floor movements",()=>{
 it("requires a side view",()=>{expect(isSideViewReady(floorFrame())).toBe(true);const front=floorFrame();front[12].x=.7;expect(isSideViewReady(front)).toBe(false);});
 it("counts one push-up after stable depth and full rearm",()=>{const e=createFloorMovementEmitter();expect(e.push(floorFrame("down"))).toBeNull();expect(e.push(floorFrame("down"))).toBeNull();expect(e.push(floorFrame("down"))).toBeNull();expect(e.push(floorFrame("up"))).toMatchObject({movement:"push-up",phase:"completed"});expect(e.push(floorFrame("up"))).toBeNull();});
 it("emits plank start, held, and released using elapsed time",()=>{let time=0;const e=createFloorMovementEmitter(undefined,()=>time);expect(e.push(floorFrame())).toBeNull();time=800;expect(e.push(floorFrame())).toMatchObject({movement:"plank",phase:"started"});time=1600;expect(e.push(floorFrame())).toMatchObject({movement:"plank",phase:"held"});expect(e.push(floorFrame("misaligned"))).toMatchObject({movement:"plank",phase:"released"});});
 it("derives thresholds and rejects incomplete samples",()=>{const t=deriveFloorThresholds([floorFrame("down"),floorFrame("down")],[floorFrame(),floorFrame()],[floorFrame(),floorFrame()]);expect(t.pushUpDownDegrees).toBeLessThan(t.pushUpUpDegrees);expect(()=>deriveFloorThresholds([],[],[])).toThrow(/samples/);});
});
