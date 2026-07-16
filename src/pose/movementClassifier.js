// movementClassifier.js
// Pure functions: take a rolling buffer of recent landmark frames and
// per-user calibrated thresholds, return a discrete action.
// Keep this decoupled from rendering and from the pose engine itself
// so it stays independently testable.

const HISTORY_LENGTH = 18;
const HOLD_FRAMES = 3;

export function createLandmarkBuffer() {
  return [];
}

export function pushLandmarks(buffer, landmarks) {
  buffer.push(landmarks);
  if (buffer.length > HISTORY_LENGTH) buffer.shift();
  return buffer;
}

// thresholds = { jumpDeltaPx, squatHipKneeRatio } set during calibration
export function classifyMovement(buffer, thresholds) {
  if (buffer.length < 2) return "none";

  if (isJump(buffer, thresholds)) return "jump";
  if (isSquat(buffer, thresholds)) return "squat";
  return "none";
}

function isJump(buffer, thresholds) {
  if (!Number.isFinite(thresholds?.jumpDeltaPx) || !Number.isFinite(thresholds?.standingHipY)) return false;
  const recent = buffer.slice(-5).map(hipY).filter(Number.isFinite);
  if (recent.length < 3) return false;
  const peakDelta = thresholds.standingHipY - Math.min(...recent);
  const bothFeetRaised = buffer.slice(-3).some((frame) => {
    const left = frame[27]?.y;
    const right = frame[28]?.y;
    return Number.isFinite(left) && Number.isFinite(right) && peakDelta >= thresholds.jumpDeltaPx;
  });
  return bothFeetRaised && peakDelta >= thresholds.jumpDeltaPx;
}

function isSquat(buffer, thresholds) {
  if (!Number.isFinite(thresholds?.squatHipKneeRatio)) return false;
  const ratios = buffer.slice(-HOLD_FRAMES).map(hipKneeRatio).filter(Number.isFinite);
  return ratios.length === HOLD_FRAMES && ratios.every((ratio) => ratio <= thresholds.squatHipKneeRatio);
}

function midpointY(frame, left, right) {
  const values = [frame[left]?.y, frame[right]?.y].filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : NaN;
}

function hipY(frame) {
  return midpointY(frame, 23, 24);
}

function hipKneeRatio(frame) {
  const hip = hipY(frame);
  const knee = midpointY(frame, 25, 26);
  const shoulder = midpointY(frame, 11, 12);
  if (![hip, knee, shoulder].every(Number.isFinite)) return NaN;
  return Math.abs(knee - hip) / Math.max(.001, Math.abs(hip - shoulder));
}
