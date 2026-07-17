import type { MissionSnapshot } from "./missionController";
import { missionPresentationFeedback } from "./missionPresentation";

export type MissionSoundCue = "success" | "combo" | "transition" | "miss" | "complete";

export function missionSoundCue(previous: MissionSnapshot, next: MissionSnapshot): MissionSoundCue | null {
  const feedback = missionPresentationFeedback(previous, next);
  if (feedback.completed) return "complete";
  if (feedback.missAdded) return "miss";
  if (feedback.objectiveChanged) return "transition";
  if (feedback.comboMilestone) return "combo";
  if (feedback.xpGained > 0) return "success";
  return null;
}

let context: AudioContext | null = null;

function audioContext() {
  if (typeof window === "undefined") return null;
  const Context = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;
  context ??= new Context();
  return context;
}

function tone(audio: AudioContext, frequency: number, startsAt: number, duration: number, type: OscillatorType = "sine") {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(0.12, startsAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

export async function unlockMissionSound() {
  const audio = audioContext();
  if (audio?.state === "suspended") await audio.resume().catch(() => undefined);
}

export function playMissionSound(cue: MissionSoundCue) {
  const audio = audioContext();
  if (!audio) return;
  void unlockMissionSound();
  const now = audio.currentTime;
  if (cue === "success") {
    tone(audio, 660, now, 0.1, "triangle");
    tone(audio, 880, now + 0.07, 0.13, "triangle");
  } else if (cue === "combo") {
    tone(audio, 523, now, 0.12, "triangle");
    tone(audio, 659, now + 0.08, 0.12, "triangle");
    tone(audio, 784, now + 0.16, 0.18, "triangle");
  } else if (cue === "transition") {
    tone(audio, 392, now, 0.12, "sine");
    tone(audio, 587, now + 0.1, 0.18, "sine");
  } else if (cue === "miss") {
    tone(audio, 196, now, 0.2, "sawtooth");
  } else {
    tone(audio, 523, now, 0.32, "triangle");
    tone(audio, 659, now + 0.08, 0.34, "triangle");
    tone(audio, 784, now + 0.16, 0.42, "triangle");
    tone(audio, 1047, now + 0.3, 0.5, "sine");
  }
}

export function closeMissionSound() {
  const audio = context;
  context = null;
  if (audio && audio.state !== "closed") void audio.close();
}
