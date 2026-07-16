import test from "node:test";
import assert from "node:assert/strict";
import { createCalibrationSession, finalizeThresholds, recordJumpSample, recordSquatSample, recordStandingSample } from "./calibrationFlow.js";

function frame({ shoulder = .3, hip = .55, knee = .75 } = {}) {
  const points = Array.from({ length: 33 }, () => ({ x: .5, y: .5, visibility: 1 }));
  for (const index of [11, 12]) points[index].y = shoulder;
  for (const index of [23, 24]) points[index].y = hip;
  for (const index of [25, 26]) points[index].y = knee;
  return points;
}

test("derives finite user thresholds from standing, jump, and squat samples", () => {
  const session = createCalibrationSession();
  recordStandingSample(session, Array.from({ length: 5 }, () => frame()));
  recordJumpSample(session, [frame(), frame({ hip: .48 }), frame({ hip: .44 }), frame({ hip: .5 }), frame()]);
  recordSquatSample(session, [frame(), frame({ hip: .62 }), frame({ hip: .68 }), frame({ hip: .66 }), frame()]);
  const thresholds = finalizeThresholds(session);
  assert.ok(Object.values(thresholds).every(Number.isFinite));
  assert.ok(thresholds.jumpDeltaPx > 0);
  assert.ok(thresholds.squatHipKneeRatio < thresholds.standingHipKneeRatio);
});

test("rejects incomplete calibration", () => {
  assert.throws(() => finalizeThresholds(createCalibrationSession()), /incomplete/);
});

test("rejects movements too small to calibrate safely", () => {
  const session = createCalibrationSession();
  recordStandingSample(session, Array.from({ length: 5 }, () => frame()));
  recordJumpSample(session, Array.from({ length: 5 }, () => frame({ hip: .545 })));
  recordSquatSample(session, Array.from({ length: 5 }, () => frame({ hip: .56 })));
  assert.throws(() => finalizeThresholds(session), /too small/);
});
