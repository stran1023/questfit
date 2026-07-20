import { encounterCopyByMovement, encounterStageTitle, type EncounterProgress, type SupportedMovement } from "@/contracts";
import type { MissionSnapshot } from "./missionController";

export type MissionVoiceCue={key:string;text:string};
export function missionVoiceCue(snapshot:MissionSnapshot,target:SupportedMovement,trackingGuidance:string,encounter:EncounterProgress={index:1,total:1},targetCount=0):MissionVoiceCue|null{
 if(snapshot.status==="complete")return {key:"mission-complete",text:`Mission complete. You earned ${snapshot.xpEarned} XP.`};
 if(snapshot.pauseReason)return {key:`paused:${snapshot.pauseReason}`,text:snapshot.pauseReason};
 if(trackingGuidance.startsWith("Step back")||trackingGuidance.startsWith("Turn sideways")||trackingGuidance.startsWith("Tracking unavailable"))return {key:`tracking:${trackingGuidance}`,text:trackingGuidance};
 if(snapshot.status!=="playing")return null;
 const copy=encounterCopyByMovement[target];
 if(snapshot.segmentProgress>0){
  const remaining=Math.max(0,targetCount-snapshot.segmentProgress);
  const halfway=targetCount>6&&snapshot.segmentProgress===Math.ceil(targetCount/2);
  if(remaining>3&&!halfway)return null;
  return {key:`progress:${snapshot.segmentIndex}:${snapshot.segmentProgress}`,text:remaining===0?`${copy.movementLabel} set complete.`:remaining===1?`One ${copy.movementLabel} left.`:`${remaining} ${copy.movementLabel} remaining.`};
 }
 const targetCopy=targetCount>0?` ${targetCount} repetitions.`:"";
 return {key:`objective:${snapshot.segmentIndex}`,text:`${encounterStageTitle(target,encounter)}.${targetCopy} ${copy.spokenInstruction}`};
}

export function speakMissionCue(cue:MissionVoiceCue){if(typeof speechSynthesis==="undefined"||typeof SpeechSynthesisUtterance==="undefined")return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(cue.text);utterance.rate=.95;utterance.volume=1;speechSynthesis.speak(utterance)}
