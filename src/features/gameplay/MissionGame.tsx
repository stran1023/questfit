"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { encounterCopyByMovement, encounterStageTitle, type EncounterProgress, type SupportedMovement } from "@/contracts";
import { loadMissionSession } from "@/features/calibration/missionSession";
import { saveSessionResult } from "@/features/coaching/sessionResultRepository";
import { TrailGuide } from "@/features/guide/TrailGuide";
import type { CooldownPlan } from "@/features/workout-planner/planningSchemas";
import CooldownGuide from "./CooldownGuide";
import MissionPoseCamera from "./MissionPoseCamera";
import { createMissionController, type MissionSnapshot } from "./missionController";
import { subscribeMovementEvents } from "./missionEventBridge";
import { encounterProgressAt } from "./missionPresentation";
import { createMissionScene, publishMissionSceneUpdate } from "./missionScene";
import { closeMissionSound, missionMusicTier, missionSoundCue, playMissionSound, setMissionMusicPaused, setMissionMusicTier, startMissionMusic, stopMissionMusic, unlockMissionSound } from "./missionSound";
import { missionVoiceCue, speakMissionCue } from "./missionVoice";

const initial: MissionSnapshot = { status: "ready", segmentIndex: 0, segmentProgress: 0, missionProgress: 0, xpEarned: 0, combo: 0, misses: 0, totalMisses: 0, completedByExercise: {}, pauseReason: null };

export default function MissionGame() {
  const { replace } = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<typeof createMissionController> | null>(null);
  const pendingDeviceLossRef = useRef<string | null>(null);
  const lastVoiceKeyRef = useRef("");
  const previousSoundSnapshotRef = useRef(initial);
  const resultsSavedRef = useRef(false);
  const [snapshot, setSnapshot] = useState(initial);
  const [target, setTarget] = useState<SupportedMovement>("squat");
  const [targetCount, setTargetCount] = useState(0);
  const [encounter, setEncounter] = useState<EncounterProgress>({ index: 1, total: 1 });
  const [trackingGuidance, setTrackingGuidance] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [missing, setMissing] = useState(false);
  const [cooldown, setCooldown] = useState<CooldownPlan | null>(null);
  const [coolingDown, setCoolingDown] = useState(false);

  const handleDeviceLoss = useCallback((reason: string) => {
    const controller = controllerRef.current;
    if (controller) controller.pause(reason); else pendingDeviceLossRef.current = reason;
  }, []);
  const handleTrackingRetry = useCallback(() => controllerRef.current?.resume(), []);
  const handleGuidanceChange = useCallback((message: string) => setTrackingGuidance(message), []);
  const finishCooldown = useCallback(() => replace("/results"), [replace]);

  useEffect(() => {
    const session = loadMissionSession();
    if (!session) { setMissing(true); return; }
    setCooldown(session.cooldown);
    const exerciseById = new Map(session.workout.exercises.map((exercise) => [exercise.id, exercise]));
    const movements = session.adventure.segments.map((segment) => exerciseById.get(segment.exerciseId)?.movement ?? "squat");
    const controller = createMissionController(session.workout, session.adventure);
    controllerRef.current = controller;
    const update = (value: MissionSnapshot) => {
      setSnapshot(value);
      const segment = session.adventure.segments[value.segmentIndex];
      const exercise = segment && exerciseById.get(segment.exerciseId);
      if (exercise) {
        setTarget(exercise.movement);
        setTargetCount(segment.target);
        setEncounter(encounterProgressAt(movements, value.segmentIndex));
      }
    };
    const unsubscribe = controller.subscribe(update);
    const unsubscribeMovement = subscribeMovementEvents(window, (event) => controller.consume(event));
    controller.start();
    if (pendingDeviceLossRef.current) { controller.pause(pendingDeviceLossRef.current); pendingDeviceLossRef.current = null; }
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | null = null;
    let cancelled = false;
    void import("phaser").then(({ default: Phaser }) => {
      if (cancelled || !hostRef.current) return;
      const currentSnapshot = controller.getSnapshot();
      const currentSegment = session.adventure.segments[currentSnapshot.segmentIndex];
      const currentExercise = currentSegment && exerciseById.get(currentSegment.exerciseId);
      const currentTarget = currentExercise?.movement ?? "squat";
      const scene = createMissionScene(Phaser, hostRef.current, { snapshot: currentSnapshot, target: currentTarget, encounter: encounterProgressAt(movements, currentSnapshot.segmentIndex) });
      game = new Phaser.Game({ type: Phaser.AUTO, parent: hostRef.current, width: 960, height: 540, backgroundColor: "#090b20", scene, physics: { default: "arcade" }, render: { antialias: true } });
    });
    return () => { cancelled = true; unsubscribe(); unsubscribeMovement(); game?.destroy(true); controllerRef.current = null; };
  }, []);

  useEffect(() => {
    if (snapshot.status !== "complete" || resultsSavedRef.current) return;
    const session = loadMissionSession();
    if (!session) return;
    resultsSavedRef.current = true;
    saveSessionResult(session.workout, session.adventure, { completedByExercise: snapshot.completedByExercise, missedEvents: snapshot.totalMisses });
    setCoolingDown(true);
  }, [snapshot.status, snapshot.completedByExercise, snapshot.totalMisses]);

  useEffect(() => { publishMissionSceneUpdate(window, { snapshot, target, encounter }); }, [snapshot, target, encounter]);
  useEffect(() => {
    if (!voiceEnabled) { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); lastVoiceKeyRef.current = ""; return; }
    const cue = missionVoiceCue(snapshot, target, trackingGuidance, encounter, targetCount);
    if (!cue || cue.key === lastVoiceKeyRef.current) return;
    lastVoiceKeyRef.current = cue.key;
    speakMissionCue(cue);
  }, [snapshot, target, trackingGuidance, encounter, targetCount, voiceEnabled]);
  useEffect(() => {
    const previous = previousSoundSnapshotRef.current;
    previousSoundSnapshotRef.current = snapshot;
    if (!soundEnabled) { stopMissionMusic(); return; }
    void startMissionMusic().then((started) => setAudioBlocked(!started));
    setMissionMusicTier(missionMusicTier(snapshot.missionProgress));
    setMissionMusicPaused(snapshot.status === "paused" || snapshot.status === "recovery" || coolingDown);
    const cue = missionSoundCue(previous, snapshot);
    if (cue) playMissionSound(cue);
  }, [snapshot, soundEnabled, coolingDown]);
  useEffect(() => () => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); closeMissionSound(); }, []);

  if (missing) return <main className="prepare-empty"><h1>No active mission.</h1><Link className="foundation-link" href="/plan">Plan an adventure</Link></main>;
  return (
    <main className="mission-shell" data-music-state={soundEnabled && !audioBlocked ? "on" : "off"} data-music-tier={missionMusicTier(snapshot.missionProgress)}>
      <header className="mission-header">
        <div><p className="identity-kicker">Volcano Escape</p><h1>{coolingDown ? "Recovery" : snapshot.status === "complete" ? "Mission complete" : "Mission in progress"}</h1></div>
        <div className="mission-controls">
          <button aria-pressed={voiceEnabled} onClick={() => setVoiceEnabled((value) => !value)} type="button">Voice {voiceEnabled ? "on" : "off"}</button>
          <button aria-pressed={soundEnabled && !audioBlocked} onClick={() => { if (soundEnabled && !audioBlocked) { setSoundEnabled(false); return; } setSoundEnabled(true); void unlockMissionSound().then(() => startMissionMusic()).then((started) => setAudioBlocked(!started)); }} type="button">{audioBlocked ? "Play music" : `Music + effects ${soundEnabled ? "on" : "off"}`}</button>
          {!coolingDown && snapshot.status !== "complete" && <button onClick={() => snapshot.status === "paused" ? controllerRef.current?.resume() : controllerRef.current?.pause()} type="button">{snapshot.status === "paused" ? "Resume" : "Pause"}</button>}
        </div>
      </header>
      <TrailGuide compact message={coolingDown ? "Great escape. Breathe and bring your heart rate down." : snapshot.status === "paused" || snapshot.status === "recovery" ? "Reset your stance. Your progress is safe." : snapshot.missionProgress >= 75 ? "Final climb—finish the Titan!" : "Match the move. I’ll mark every verified rep."} mood={coolingDown ? "cheering" : "pointing"} />
      <div hidden={coolingDown}>
        <section className="mission-layout"><MissionPoseCamera target={target} paused={snapshot.status !== "playing"} onDeviceLoss={handleDeviceLoss} onRetry={handleTrackingRetry} onGuidanceChange={handleGuidanceChange}/><div className="game-canvas" ref={hostRef}/></section>
        <section className="objective-hud" data-target={target}><div><span>Current encounter</span><strong>{encounterStageTitle(target, encounter)}</strong></div><div><span>Movement</span><strong>{encounterCopyByMovement[target].movementLabel}</strong></div><div><span>Set progress</span><strong>{snapshot.segmentProgress}/{targetCount}</strong></div><div><span>Combo</span><strong>×{snapshot.combo}</strong></div><div><span>XP</span><strong>{snapshot.xpEarned}</strong></div><progress max="100" value={snapshot.missionProgress}>{snapshot.missionProgress}%</progress></section>
        {snapshot.pauseReason && <p role="status">{snapshot.pauseReason}</p>}
      </div>
      {coolingDown && cooldown && <CooldownGuide plan={cooldown} onComplete={finishCooldown} />}
    </main>
  );
}
