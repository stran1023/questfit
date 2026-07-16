import test from "node:test";
import assert from "node:assert/strict";
import { classifyMovement, createLandmarkBuffer, pushLandmarks } from "./movementClassifier.js";

const thresholds = { standingHipY: .55, jumpDeltaPx: .06, squatHipKneeRatio: .45 };
function frame({ shoulder=.3, hip=.55, knee=.75, ankle=.95 }={}) {
  const result=Array.from({length:33},()=>({x:.5,y:.5}));
  for(const i of [11,12]) result[i].y=shoulder;
  for(const i of [23,24]) result[i].y=hip;
  for(const i of [25,26]) result[i].y=knee;
  for(const i of [27,28]) result[i].y=ankle;
  return result;
}

test("classifies a calibrated jump",()=>{
  const b=createLandmarkBuffer();
  [frame(),frame({hip:.5,ankle:.9}),frame({hip:.46,ankle:.84})].forEach(f=>pushLandmarks(b,f));
  assert.equal(classifyMovement(b,thresholds),"jump");
});

test("requires a held squat",()=>{
  const b=createLandmarkBuffer();
  [frame({hip:.66}),frame({hip:.67}),frame({hip:.68})].forEach(f=>pushLandmarks(b,f));
  assert.equal(classifyMovement(b,thresholds),"squat");
});

test("ignores a single noisy frame",()=>{
  const b=createLandmarkBuffer();
  [frame(),frame({hip:.68}),frame()].forEach(f=>pushLandmarks(b,f));
  assert.equal(classifyMovement(b,thresholds),"none");
});
