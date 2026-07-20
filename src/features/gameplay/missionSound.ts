import type { MissionSnapshot } from "./missionController";
import { missionPresentationFeedback } from "./missionPresentation";

export type MissionSoundCue = "success" | "combo" | "transition" | "miss" | "complete";
export type MissionMusicTier = "calm" | "rising" | "escape";

export function missionMusicTier(progress: number): MissionMusicTier {
  if (progress >= 75) return "escape";
  if (progress >= 35) return "rising";
  return "calm";
}

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
let musicGain: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicStep = 0;
let activeMusicTier: MissionMusicTier = "calm";
let musicPaused = false;
let musicGeneration = 0;

function audioContext() {
  if (typeof window === "undefined") return null;
  const Context = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;
  context ??= new Context();
  return context;
}

function tone(audio: AudioContext, frequency: number, startsAt: number, duration: number, type: OscillatorType = "sine", peak = 0.12, destination: AudioNode = audio.destination) {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(peak, startsAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

const bassPattern = [130.81, 130.81, 155.56, 174.61, 130.81, 196, 174.61, 155.56];
const melodyPattern = [261.63, 311.13, 349.23, 392, 349.23, 466.16, 392, 311.13];

function scheduleMusicBeat() {
  const audio = context;
  if (!audio || !musicGain || audio.state !== "running" || musicPaused) return;
  const now = audio.currentTime + 0.02;
  const index = musicStep % bassPattern.length;
  tone(audio, bassPattern[index], now, 0.31, "sine", 0.3, musicGain);
  if (activeMusicTier !== "calm" || index % 2 === 0) tone(audio, melodyPattern[index], now + 0.05, 0.18, "triangle", activeMusicTier === "escape" ? 0.22 : 0.16, musicGain);
  if (activeMusicTier === "escape") tone(audio, index % 2 ? 98 : 110, now, 0.08, "square", 0.1, musicGain);
  musicStep += 1;
}

export async function startMissionMusic() {
  const audio = audioContext();
  if (!audio) return false;
  const startGeneration = musicGeneration;
  const unlocked = await unlockMissionSound();
  if (startGeneration !== musicGeneration || !unlocked) return false;
  if (!musicGain) {
    musicGain = audio.createGain();
    musicGain.gain.setValueAtTime(0.0001, audio.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.045, audio.currentTime + 0.8);
    musicGain.connect(audio.destination);
  }
  if (!musicTimer) {
    scheduleMusicBeat();
    musicTimer = setInterval(scheduleMusicBeat, 360);
  }
  return true;
}

export function setMissionMusicTier(tier: MissionMusicTier) {
  activeMusicTier = tier;
}

export function setMissionMusicPaused(paused: boolean) {
  musicPaused = paused;
  if (!paused) scheduleMusicBeat();
}

export function stopMissionMusic() {
  musicGeneration += 1;
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  musicStep = 0;
  musicPaused = false;
  const fadingGain = musicGain;
  if (fadingGain && context?.state === "running") {
    const now = context.currentTime;
    fadingGain.gain.cancelScheduledValues(now);
    fadingGain.gain.setValueAtTime(Math.max(0.0001, fadingGain.gain.value), now);
    fadingGain.gain.linearRampToValueAtTime(0.0001, now + 0.32);
    setTimeout(() => fadingGain.disconnect(), 340);
  } else fadingGain?.disconnect();
  musicGain = null;
}

export async function unlockMissionSound() {
  const audio = audioContext();
  if (audio?.state === "suspended") await audio.resume().catch(() => undefined);
  return audio?.state === "running";
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
  stopMissionMusic();
  const audio = context;
  context = null;
  if (audio && audio.state !== "closed") void audio.close();
}
