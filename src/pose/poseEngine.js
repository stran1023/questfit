// poseEngine.js
// Thin wrapper around MediaPipe Pose (or swap for TensorFlow.js MoveNet).
// Exposes a single detect(videoElement) -> landmarks[] call so the rest
// of the app doesn't need to know which underlying model is in use.

// import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let landmarker = null;

export async function initPoseEngine() {
  // TODO: load MediaPipe PoseLandmarker with GPU delegate.
  // const vision = await FilesetResolver.forVisionTasks(...);
  // landmarker = await PoseLandmarker.createFromOptions(vision, { ... });
  throw new Error("initPoseEngine: implement MediaPipe/MoveNet setup");
}

export function detectPose(videoElement, timestampMs) {
  if (!landmarker) throw new Error("Pose engine not initialized");
  // return landmarker.detectForVideo(videoElement, timestampMs).landmarks[0];
}
