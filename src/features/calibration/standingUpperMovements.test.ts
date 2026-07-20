import { describe, expect, it } from "vitest";
import type { LandmarkFrame } from "./calibrationDomain";
import { createStandingUpperMovementEmitter, deriveStandingUpperThresholds } from "./standingUpperMovements";

function frame(): LandmarkFrame {
  const p = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 1 }));
  Object.assign(p[11], { x: 0.42, y: 0.3 }); Object.assign(p[12], { x: 0.58, y: 0.3 });
  Object.assign(p[15], { x: 0.38, y: 0.5 }); Object.assign(p[16], { x: 0.62, y: 0.5 });
  Object.assign(p[23], { x: 0.45, y: 0.55 }); Object.assign(p[24], { x: 0.55, y: 0.55 });
  Object.assign(p[27], { x: 0.45, y: 0.95 }); Object.assign(p[28], { x: 0.55, y: 0.95 });
  return p;
}
function jack() { const p=frame(); Object.assign(p[15],{x:0.2,y:0.15}); Object.assign(p[16],{x:0.8,y:0.15}); Object.assign(p[27],{x:0.25,y:0.95}); Object.assign(p[28],{x:0.75,y:0.95}); return p; }
function punch(side:"left"|"right") { const p=frame(); Object.assign(p[side==="left"?15:16],{x:side==="left"?0.12:0.88,y:0.3}); return p; }
function reach(side:"left"|"right") { const p=frame(); const shift=side==="left"?-0.12:0.12; p[11].x+=shift; p[12].x+=shift; return p; }

describe("standing upper/cardio movements",()=>{
  it("counts a complete jumping-jack cycle once",()=>{ const e=createStandingUpperMovementEmitter(); expect(e.push(jack())).toBeNull(); expect(e.push(jack())).toBeNull(); expect(e.push(frame())).toMatchObject({movement:"jumping-jack",phase:"completed"}); expect(e.push(frame())).toBeNull(); });
  it("separates directional punches and rearms on neutral",()=>{ const e=createStandingUpperMovementEmitter(); expect(e.push(punch("left"))).toMatchObject({movement:"punch-left"}); expect(e.push(punch("left"))).toBeNull(); expect(e.push(frame())).toBeNull(); expect(e.push(punch("right"))).toMatchObject({movement:"punch-right"}); });
  it("starts and completes directional side reaches",()=>{ const e=createStandingUpperMovementEmitter(); expect(e.push(reach("left"))).toBeNull(); expect(e.push(reach("left"))).toMatchObject({movement:"side-reach-left",phase:"started"}); expect(e.push(reach("left"))).toBeNull(); expect(e.push(frame())).toMatchObject({movement:"side-reach-left",phase:"completed"}); });
  it("derives bounded thresholds and rejects missing samples",()=>{ const t=deriveStandingUpperThresholds([jack(),jack()],[punch("left"),punch("right")],[reach("left"),reach("right")]); expect(t.jackFootSpreadRatio).toBeGreaterThan(1); expect(t.punchExtensionRatio).toBeGreaterThan(0); expect(t.sideReachLeanRatio).toBeGreaterThan(0); expect(()=>deriveStandingUpperThresholds([],[],[])).toThrow(/samples/); });
});
