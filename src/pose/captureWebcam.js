// captureWebcam.js
// Requests camera access and streams frames into a hidden <video> element
// for the pose engine to read from.

export async function startWebcam(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480, facingMode: "user" },
    audio: false,
  });
  videoElement.srcObject = stream;
  await videoElement.play();
  return stream;
}

export function stopWebcam(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}
