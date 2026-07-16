// poseEngine.js
// Thin wrapper around MediaPipe PoseLandmarker. Model details stay here so
// calibration and game modules only consume normalized landmarks.

import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

let landmarker = null;
let initialization = null;

async function createLandmarker(delegate) {
  const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
  return PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate,
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.55,
    minPosePresenceConfidence: 0.55,
    minTrackingConfidence: 0.55,
  });
}

export async function initPoseEngine() {
  if (landmarker) return landmarker;
  if (initialization) return initialization;

  initialization = (async () => {
    try {
      landmarker = await createLandmarker("GPU");
    } catch (gpuError) {
      console.warn("GPU pose initialization failed; using CPU.", gpuError);
      landmarker = await createLandmarker("CPU");
    }
    return landmarker;
  })();

  try {
    return await initialization;
  } finally {
    initialization = null;
  }
}

export function detectPose(videoElement, timestampMs) {
  if (!landmarker) throw new Error("Pose engine not initialized");
  if (!videoElement || videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return [];
  }

  const result = landmarker.detectForVideo(videoElement, timestampMs);
  return result.landmarks?.[0] ?? [];
}

export function closePoseEngine() {
  landmarker?.close();
  landmarker = null;
  initialization = null;
}
