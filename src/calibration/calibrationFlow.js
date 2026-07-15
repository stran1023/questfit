// calibrationFlow.js
// Runs once at game start: captures one sample jump and one sample squat
// from the player, derives per-user detection thresholds, and hands them
// to the movement classifier. Do not hardcode global thresholds.

export const CALIBRATION_STEPS = ["frame-check", "jump-sample", "squat-sample", "done"];

export function createCalibrationSession() {
  return {
    step: 0,
    jumpSample: null,
    squatSample: null,
  };
}

export function recordJumpSample(session, landmarkBuffer) {
  // TODO: derive a jumpDeltaPx threshold from the captured sample.
  session.jumpSample = landmarkBuffer;
  session.step += 1;
  return session;
}

export function recordSquatSample(session, landmarkBuffer) {
  // TODO: derive a squatHipKneeRatio threshold from the captured sample.
  session.squatSample = landmarkBuffer;
  session.step += 1;
  return session;
}

export function finalizeThresholds(session) {
  // TODO: compute and return { jumpDeltaPx, squatHipKneeRatio }
  return { jumpDeltaPx: 0, squatHipKneeRatio: 0 };
}
