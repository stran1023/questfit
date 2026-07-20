"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TrailGuide } from "@/features/guide/TrailGuide";
import { startWebcam, stopWebcam } from "@/pose/captureWebcam.js";
import { closePoseEngine, detectPose, initPoseEngine } from "@/pose/poseEngine.js";
import {
  type LandmarkFrame,
} from "./calibrationDomain";
import { drawPoseOverlay } from "./poseOverlay";
import { createAutomaticCalibration, type AutomaticCalibrationPhase } from "./automaticCalibration";
import {
  loadCalibrationThresholds,
  loadMissionSession,
  saveCalibrationThresholds,
  type MissionSession,
} from "./missionSession";

type CameraStatus = "requesting" | "loading-model" | "tracking" | "searching" | "error";

function cameraErrorMessage(cause: unknown) {
  if (cause instanceof DOMException && cause.name === "NotAllowedError") {
    return "Camera permission is blocked. Allow camera access in the browser, then retry.";
  }
  return "Camera or pose tracking could not start. Check the camera connection, close other camera apps, and retry.";
}

export default function PrepareMission() {
  const { push } = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const cameraStatusRef = useRef<CameraStatus>("requesting");
  const calibrationRequiredRef = useRef(true);
  const stableFrameCountRef = useRef(0);
  const inferenceCountRef = useRef(0);
  const inferenceTotalRef = useRef(0);

  const [mission, setMission] = useState<MissionSession | null>();
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("requesting");
  const [step, setStep] = useState<AutomaticCalibrationPhase>("framing");
  const [error, setError] = useState("");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);
  const [launchCountdown, setLaunchCountdown] = useState<number | null>(null);

  useEffect(() => {
    calibrationRequiredRef.current = !loadCalibrationThresholds();
    setStep("framing");
    setMission(loadMissionSession());
  }, []);

  useEffect(() => {
    if (!mission) return;
    let stream: MediaStream | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function updateCameraStatus(next: CameraStatus) {
      if (cameraStatusRef.current === next) return;
      cameraStatusRef.current = next;
      setCameraStatus(next);
    }

    async function start() {
      try {
        updateCameraStatus("requesting");
        stream = await startWebcam(videoRef.current) as MediaStream;
        updateCameraStatus("loading-model");
        await initPoseEngine();
        if (cancelled) return;

        const automaticCalibration = calibrationRequiredRef.current ? createAutomaticCalibration({
          onPhase(next) {
            setStep(next);
            if (typeof speechSynthesis !== "undefined" && (next === "jump-countdown" || next === "squat-countdown")) {
              speechSynthesis.cancel();
              speechSynthesis.speak(new SpeechSynthesisUtterance(`${next === "jump-countdown" ? "Jump" : "Squat"} in 3, 2, 1`));
            }
          },
          onError(message) {
            setError(message);
          },
          onComplete(thresholds) {
            try {
              saveCalibrationThresholds(thresholds);
            } catch {
              updateCameraStatus("error");
              setError("Movement setup finished, but this browser could not save it. Free browser storage or change privacy settings, then retry setup.");
            }
          },
        }) : null;

        const tick = () => {
          if (cancelled) return;
          try {
            const startedAt = performance.now();
            const landmarks = detectPose(videoRef.current, startedAt) as LandmarkFrame;
            const elapsed = performance.now() - startedAt;
            inferenceCountRef.current += 1;
            inferenceTotalRef.current += elapsed;

            if (inferenceCountRef.current % 24 === 0) {
              setLatencyMs(inferenceTotalRef.current / inferenceCountRef.current);
            }

            drawPoseOverlay(overlayRef.current, landmarks);
            if (landmarks.length >= 29) {
              updateCameraStatus("tracking");
              if (automaticCalibration) {
                automaticCalibration.push(landmarks, startedAt);
              } else {
                stableFrameCountRef.current += 1;
                if (stableFrameCountRef.current >= 12) setStep("ready");
              }
            } else {
              stableFrameCountRef.current = 0;
              updateCameraStatus("searching");
            }
            timerId = setTimeout(tick, 1000 / 24);
          } catch (cause) {
            updateCameraStatus("error");
            setError(cameraErrorMessage(cause));
          }
        };
        tick();
      } catch (cause) {
        updateCameraStatus("error");
        setError(cameraErrorMessage(cause));
      }
    }

    void start();
    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
      stopWebcam(stream);
      closePoseEngine();
    };
  }, [mission, runId]);

  useEffect(() => {
    if (step !== "ready" || cameraStatus !== "tracking") {
      setLaunchCountdown(null);
      return;
    }
    setLaunchCountdown(3);
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance("Mission starts in 3, 2, 1, go!"));
    }
    const timers = [
      setTimeout(() => setLaunchCountdown(2), 1_000),
      setTimeout(() => setLaunchCountdown(1), 2_000),
      setTimeout(() => {
        setLaunchCountdown(0);
      }, 3_000),
      setTimeout(() => push("/mission"), 3_650),
    ];
    return () => timers.forEach(clearTimeout);
  }, [cameraStatus, push, step]);

  function retryCamera() {
    inferenceCountRef.current = 0;
    inferenceTotalRef.current = 0;
    setLatencyMs(null);
    setLaunchCountdown(null);
    stableFrameCountRef.current = 0;
    setStep("framing");
    setError("");
    cameraStatusRef.current = "requesting";
    setCameraStatus("requesting");
    setRunId((current) => current + 1);
  }

  if (mission === undefined) {
    return <main className="prepare-empty" role="status">Loading mission preparation…</main>;
  }

  if (mission === null) {
    return (
      <main className="prepare-empty">
        <p className="planner-kicker">No active adventure</p>
        <h1>Generate a mission first.</h1>
        <p>Your workout and objectives must be validated before calibration starts.</p>
        <Link className="foundation-link" href="/plan">Return to workout planner</Link>
      </main>
    );
  }

  const stepCopy = {
    framing: ["Step into view", "Keep your head, hips, knees, and feet visible. Setup starts automatically when you are stable."],
    "jump-countdown": ["Get ready to jump", "Jump after the spoken and visible 3 · 2 · 1 countdown."],
    "jump-sampling": ["Jump now", "Perform one clear jump, then return to standing."],
    "squat-countdown": ["Get ready to squat", "Squat after the spoken and visible 3 · 2 · 1 countdown."],
    "squat-sampling": ["Squat now", "Squat low, hold briefly, then return to standing."],
    ready: ["Mission ready", "Full-body tracking is stable. Stay in position—the adventure launches automatically."],
  }[step];
  const stepIndex = { framing: 0, "jump-countdown": 1, "jump-sampling": 1, "squat-countdown": 2, "squat-sampling": 2, ready: 2 }[step];
  const voiceAvailable = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const cameraCheck = cameraStatus === "error" ? ["attention", "Needs attention"] : cameraStatus === "tracking" ? ["ready", "Ready"] : ["pending", "Checking"];
  const bodyCheck = cameraStatus === "tracking" ? ["ready", "Full body found"] : cameraStatus === "error" ? ["attention", "Unavailable"] : ["pending", "Step into view"];
  const setupCheck = step === "ready" ? ["ready", "Ready"] : calibrationRequiredRef.current ? ["pending", "Recording once"] : ["pending", "Validating saved setup"];

  return (
    <main className="app-shell calibration-layout prepare-layout">
      <section>
        <p className="eyebrow">Mission launch {calibrationRequiredRef.current ? `· Setup ${stepIndex + 1} of 3` : "· Saved setup ready"}</p>
        <h1>{mission.adventure.title}</h1>
        {calibrationRequiredRef.current ? (
          <div className="progress" aria-label={`Calibration step ${stepIndex + 1} of 3`}>
            {[0, 1, 2].map((index) => <i key={index} className={index <= stepIndex ? "active" : ""} />)}
          </div>
        ) : (
          <div className="progress" aria-label="Camera readiness"><i className={step === "ready" ? "active" : ""} /></div>
        )}
        <div className="camera-stage">
          <video ref={videoRef} muted playsInline />
          <canvas ref={overlayRef} width="640" height="480" />
          <div className="framing-guide" aria-hidden="true" />
          <div className={`status-pill ${cameraStatus}`}>
            ● {cameraStatus === "tracking" ? "Live tracking" : cameraStatus.replace("-", " ")}
          </div>
          {step === "ready" && launchCountdown !== null && (
            <div className={`launch-countdown launch-countdown-${launchCountdown}`} role="status" aria-live="assertive" aria-label="Mission launch countdown">
              <span className="launch-countdown-ring launch-countdown-ring-outer" aria-hidden="true" />
              <span className="launch-countdown-ring launch-countdown-ring-inner" aria-hidden="true" />
              <p>Escape sequence</p>
              <strong key={launchCountdown}>{launchCountdown || "GO!"}</strong>
              <small>{launchCountdown ? "Hold your position" : "Move!"}</small>
              <div className="launch-countdown-steps" aria-hidden="true">
                {[3, 2, 1].map((value) => <i key={value} className={launchCountdown <= value ? "active" : ""} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="instruction-panel">
        <TrailGuide compact message={step === "ready" ? "Trail is clear. Hold position!" : "I’ll launch when your full body is in frame."} mood={step === "ready" ? "cheering" : "pointing"} />
        <section className="preflight-card" aria-labelledby="preflight-title">
          <div className="preflight-heading">
            <div><p className="eyebrow">Presenter preflight</p><h2 id="preflight-title">{step === "ready" ? "All systems ready" : "Launch checks"}</h2></div>
            <span className={step === "ready" && cameraStatus === "tracking" ? "ready" : "pending"}>{step === "ready" && cameraStatus === "tracking" ? "Launch ready" : "Automatic"}</span>
          </div>
          <ul className="preflight-list">
            <li data-state={cameraCheck[0]}><span>Camera + model</span><strong>{cameraCheck[1]}</strong></li>
            <li data-state={bodyCheck[0]}><span>Full-body framing</span><strong>{bodyCheck[1]}</strong></li>
            <li data-state={setupCheck[0]}><span>Movement setup</span><strong>{setupCheck[1]}</strong></li>
            <li data-state={voiceAvailable ? "ready" : "attention"}><span>Assistant voice</span><strong>{voiceAvailable ? "Available" : "Text fallback"}</strong></li>
            <li data-state="ready"><span>Validated mission</span><strong>{mission.workout.exercises.length} stages loaded</strong></li>
          </ul>
          <p>No button needed. Countdown begins when tracking and setup are ready.</p>
        </section>
        <div className="glass-card">
          <p className="eyebrow">Instruction</p>
          <h2>{stepCopy[0]}</h2>
          <p>{stepCopy[1]}</p>
        </div>
        <div className={`status-card ${error ? "danger" : ""}`} role="status" aria-live="polite">
          <strong>{error || (cameraStatus === "tracking" ? "Body detected" : "Preparing camera and pose model…")}</strong>
          <span>
            {latencyMs === null ? "Measuring on-device inference latency." : `Average inference ${latencyMs.toFixed(1)} ms.`}
          </span>
        </div>

        {cameraStatus === "error" && <button className="retry-button" onClick={retryCamera} type="button">Retry camera</button>}
        {(step === "jump-countdown" || step === "squat-countdown") && <div className="hands-free-countdown" aria-label="Countdown">3 · 2 · 1</div>}
        {step !== "ready" && cameraStatus !== "error" && <p className="hands-free-note">Hands-free setup · Stay in position and follow the cues</p>}

        <div className="space-check">
          <p className="eyebrow">Space check</p>
          <p>Clear overhead and floor space · Use a non-slip surface · Keep even lighting</p>
        </div>
        <p className="privacy">Processed on this device. Video and landmarks are not uploaded.</p>
      </aside>
    </main>
  );
}
