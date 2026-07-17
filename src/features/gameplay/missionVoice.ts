import type { SupportedMovement } from "@/contracts";
import type { MissionSnapshot } from "./missionController";

const names:Record<SupportedMovement,string>={jump:"jump",squat:"squat",lunge:"lunge","high-knees":"high knees","jumping-jack":"jumping jack","punch-left":"left punch","punch-right":"right punch","side-reach-left":"left side reach","side-reach-right":"right side reach","push-up":"push-up",plank:"plank"};
const instructions:Record<SupportedMovement,string>={jump:"Jump and land still.",squat:"Squat low and stand fully.",lunge:"Lunge and return to standing.","high-knees":"Alternate left and right knees.","jumping-jack":"Open arms and feet, then close.","punch-left":"Extend your left fist and return to guard.","punch-right":"Extend your right fist and return to guard.","side-reach-left":"Reach left and return upright.","side-reach-right":"Reach right and return upright.","push-up":"Turn sideways, lower, then fully extend.",plank:"Turn sideways and hold a straight plank."};

export type MissionVoiceCue={key:string;text:string};
export function missionVoiceCue(snapshot:MissionSnapshot,target:SupportedMovement,trackingGuidance:string):MissionVoiceCue|null{
 if(snapshot.status==="complete")return {key:"mission-complete",text:`Mission complete. You earned ${snapshot.xpEarned} XP.`};
 if(snapshot.pauseReason)return {key:`paused:${snapshot.pauseReason}`,text:snapshot.pauseReason};
 if(trackingGuidance.startsWith("Step back")||trackingGuidance.startsWith("Turn sideways")||trackingGuidance.startsWith("Tracking unavailable"))return {key:`tracking:${trackingGuidance}`,text:trackingGuidance};
 if(snapshot.status!=="playing")return null;
 if(snapshot.segmentProgress>0)return {key:`progress:${target}:${snapshot.segmentProgress}`,text:`${snapshot.segmentProgress} ${names[target]} complete.`};
 return {key:`objective:${target}`,text:`Next movement: ${names[target]}. ${instructions[target]}`};
}

export function speakMissionCue(cue:MissionVoiceCue){if(typeof speechSynthesis==="undefined"||typeof SpeechSynthesisUtterance==="undefined")return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(cue.text);utterance.rate=.95;utterance.volume=1;speechSynthesis.speak(utterance)}
