// movementClassifier.js
// Pure functions: take a rolling buffer of recent landmark frames and
// per-user calibrated thresholds, return a discrete action.
// Keep this decoupled from rendering and from the pose engine itself
// so it stays independently testable.

const HISTORY_LENGTH = 10; // frames kept in the rolling buffer

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
  // TODO: compare hip landmark y-position across buffer for a rapid
  // upward displacement that returns to baseline within the window.
  return false;
}

function isSquat(buffer, thresholds) {
  // TODO: compare hip-to-knee vertical distance against
  // thresholds.squatHipKneeRatio, held for a few consecutive frames.
  return false;
}
