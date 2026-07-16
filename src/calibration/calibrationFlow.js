// calibrationFlow.js
// Runs once at game start: captures one sample jump and one sample squat
// from the player, derives per-user detection thresholds, and hands them
// to the movement classifier. Do not hardcode global thresholds.

export const CALIBRATION_STEPS = ["frame-check", "jump-sample", "squat-sample", "done"];

export function createCalibrationSession() {
  return {
    step: 0,
    standingSample: null,
    jumpSample: null,
    squatSample: null,
  };
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

function hipY(landmarks) {
  return average([landmarks[23]?.y, landmarks[24]?.y].filter(Number.isFinite));
}

function squatRatio(landmarks) {
  const hip = hipY(landmarks);
  const knee = average([landmarks[25]?.y, landmarks[26]?.y].filter(Number.isFinite));
  const shoulder = average([landmarks[11]?.y, landmarks[12]?.y].filter(Number.isFinite));
  return Math.abs(knee - hip) / Math.max(0.001, Math.abs(hip - shoulder));
}

function validFrames(buffer) {
  return buffer.filter((frame) => frame?.length >= 29);
}

export function recordStandingSample(session, landmarkBuffer) {
  const frames = validFrames(landmarkBuffer);
  if (frames.length < 3) throw new Error("A stable full-body standing sample is required");
  session.standingSample = frames;
  session.step = 1;
  return session;
}

export function recordJumpSample(session, landmarkBuffer) {
  const frames = validFrames(landmarkBuffer);
  if (!session.standingSample || frames.length < 3) throw new Error("A valid jump sample is required");
  session.jumpSample = frames;
  session.step = 2;
  return session;
}

export function recordSquatSample(session, landmarkBuffer) {
  const frames = validFrames(landmarkBuffer);
  if (!session.jumpSample || frames.length < 3) throw new Error("A valid squat sample is required");
  session.squatSample = frames;
  session.step = 3;
  return session;
}

export function finalizeThresholds(session) {
  if (!session.standingSample || !session.jumpSample || !session.squatSample) {
    throw new Error("Calibration is incomplete");
  }

  const standingHipY = average(session.standingSample.map(hipY));
  const jumpPeakY = Math.min(...session.jumpSample.map(hipY));
  const measuredJumpDelta = standingHipY - jumpPeakY;
  const standingRatio = average(session.standingSample.map(squatRatio));
  const squatMinimumRatio = Math.min(...session.squatSample.map(squatRatio));

  if (measuredJumpDelta < 0.015 || standingRatio - squatMinimumRatio < 0.08) {
    throw new Error("Samples were too small. Try one clear jump and a deeper squat");
  }

  const thresholds = {
    jumpDeltaPx: measuredJumpDelta * 0.6,
    squatHipKneeRatio: squatMinimumRatio + (standingRatio - squatMinimumRatio) * 0.35,
    standingHipY,
    standingHipKneeRatio: standingRatio,
  };

  if (!Object.values(thresholds).every(Number.isFinite)) {
    throw new Error("Calibration produced invalid thresholds");
  }
  return thresholds;
}
