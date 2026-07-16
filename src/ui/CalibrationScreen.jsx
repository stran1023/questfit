import React, { useEffect, useRef, useState } from "react";
import { startWebcam, stopWebcam } from "../pose/captureWebcam.js";
import { closePoseEngine, detectPose, initPoseEngine } from "../pose/poseEngine.js";
import {
  createCalibrationSession,
  finalizeThresholds,
  recordJumpSample,
  recordSquatSample,
  recordStandingSample,
} from "../calibration/calibrationFlow.js";

const CONNECTIONS = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];

function drawPose(canvas, landmarks) {
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 3;
  for (const [a, b] of CONNECTIONS) {
    if (!landmarks[a] || !landmarks[b]) continue;
    ctx.beginPath();
    ctx.moveTo((1 - landmarks[a].x) * width, landmarks[a].y * height);
    ctx.lineTo((1 - landmarks[b].x) * width, landmarks[b].y * height);
    ctx.stroke();
  }
  ctx.fillStyle = "#f0abfc";
  for (const point of landmarks) {
    ctx.beginPath();
    ctx.arc((1 - point.x) * width, point.y * height, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CalibrationScreen({ onCalibrationComplete }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const sessionRef = useRef(createCalibrationSession());
  const standingFramesRef = useRef([]);
  const captureFramesRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("requesting-camera");
  const [step, setStep] = useState("framing");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream = null;
    let timerId = null;
    let cancelled = false;
    async function start() {
      try {
        stream = await startWebcam(videoRef.current);
        setCameraStatus("loading-model");
        await initPoseEngine();
        if (cancelled) return closePoseEngine();
        const tick = () => {
          if (cancelled) return;
          const landmarks = detectPose(videoRef.current, performance.now());
          drawPose(overlayRef.current, landmarks);
          if (landmarks.length >= 29) {
            setCameraStatus("tracking");
            standingFramesRef.current = [...standingFramesRef.current.slice(-23), landmarks];
            if (captureFramesRef.current) captureFramesRef.current.push(landmarks);
          } else {
            setCameraStatus("searching");
          }
          timerId = window.setTimeout(tick, 1000 / 24);
        };
        tick();
      } catch (cause) {
        console.error(cause);
        setCameraStatus("error");
        setError(cause?.name === "NotAllowedError" ? "Camera permission is blocked. Enable it and reload." : "Camera or pose tracking could not start. Check the camera and reload.");
      }
    }
    start();
    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
      stopWebcam(stream);
      closePoseEngine();
    };
  }, []);

  const capture = async (kind) => {
    setBusy(true);
    setError("");
    captureFramesRef.current = [];
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const frames = captureFramesRef.current;
    captureFramesRef.current = null;
    try {
      if (kind === "jump") {
        recordJumpSample(sessionRef.current, frames);
        setStep("squat");
      } else {
        recordSquatSample(sessionRef.current, frames);
        const thresholds = finalizeThresholds(sessionRef.current);
        setStep("ready");
        window.setTimeout(() => onCalibrationComplete(thresholds), 900);
      }
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  const lockFraming = () => {
    try {
      recordStandingSample(sessionRef.current, standingFramesRef.current);
      setError("");
      setStep("jump");
    } catch (cause) {
      setError(cause.message);
    }
  };

  const copy = {
    framing: ["Fit your whole body inside the guide", "Stand 6–8 feet away with your head and feet visible."],
    jump: [busy ? "Jump now!" : "Capture your jump", "Press the button, then perform one clear jump."],
    squat: [busy ? "Squat now!" : "Capture your squat", "Press the button, then squat low and hold briefly."],
    ready: ["Calibration complete", "Your personal movement thresholds are ready."],
  }[step];
  const stepIndex = { framing: 0, jump: 1, squat: 2, ready: 2 }[step];
  const canAct = cameraStatus === "tracking" && !busy;
  const bypassCalibration = () => onCalibrationComplete({
    standingHipY: 0.55,
    standingHipKneeRatio: 0.8,
    jumpDeltaPx: 0.06,
    squatHipKneeRatio: 0.45,
  });

  return (
    <main className="app-shell calibration-layout">
      <section>
        <p className="eyebrow">Step {stepIndex + 1} of 3</p>
        <h1>Let&apos;s get you <span>in motion.</span></h1>
        <div className="progress" aria-label={`Calibration step ${stepIndex + 1} of 3`}>
          {[0,1,2].map((index) => <i key={index} className={index <= stepIndex ? "active" : ""} />)}
        </div>
        <div className="camera-stage">
          <video ref={videoRef} muted playsInline />
          <canvas ref={overlayRef} width="640" height="480" />
          <div className="framing-guide" aria-hidden="true" />
          <div className={`status-pill ${cameraStatus}`}>● {cameraStatus === "tracking" ? "Live tracking" : cameraStatus.replace("-", " ")}</div>
        </div>
      </section>
      <aside className="instruction-panel">
        <div className="glass-card">
          <p className="eyebrow">Instruction</p>
          <h2>{copy[0]}</h2>
          <p>{copy[1]}</p>
        </div>
        <div className={`status-card ${error ? "danger" : ""}`} role="status" aria-live="polite">
          <strong>{error || (cameraStatus === "tracking" ? "Body detected" : "Preparing camera and AI model…")}</strong>
          <span>{error ? "Adjust your position and try the current step again." : "Keep your full body visible throughout calibration."}</span>
        </div>
        {step === "framing" && <button disabled={!canAct} onClick={lockFraming}>Lock framing →</button>}
        {step === "jump" && <button disabled={!canAct} onClick={() => capture("jump")}>{busy ? "Capturing…" : "Capture jump"}</button>}
        {step === "squat" && <button disabled={!canAct} onClick={() => capture("squat")}>{busy ? "Capturing…" : "Capture squat"}</button>}
        <div className="space-check"><p className="eyebrow">Space check</p><p>Clear overhead space · Use a non-slip floor · Keep even lighting</p></div>
        {import.meta.env.DEV && <button type="button" className="dev-bypass" onClick={bypassCalibration}>Dev only · Skip calibration</button>}
        <p className="privacy">🔒 Processed on this device. Video is not uploaded.</p>
      </aside>
    </main>
  );
}
