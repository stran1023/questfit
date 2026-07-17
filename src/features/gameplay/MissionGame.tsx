"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import type {SupportedMovement} from "@/contracts";
import {loadMissionSession} from "@/features/calibration/missionSession";
import {createMissionController,type MissionSnapshot} from "./missionController";
import {subscribeMovementEvents} from "./missionEventBridge";
import {saveSessionResult} from "@/features/coaching/sessionResultRepository";
import MissionPoseCamera from "./MissionPoseCamera";
import {missionVoiceCue,speakMissionCue} from "./missionVoice";
import {createMissionScene,publishMissionSceneUpdate} from "./missionScene";
import {closeMissionSound,missionSoundCue,playMissionSound,unlockMissionSound} from "./missionSound";

const initial:MissionSnapshot={status:"ready",segmentIndex:0,segmentProgress:0,missionProgress:0,xpEarned:0,combo:0,misses:0,totalMisses:0,completedByExercise:{},pauseReason:null};

export default function MissionGame(){
 const hostRef=useRef<HTMLDivElement>(null);const controllerRef=useRef<ReturnType<typeof createMissionController>|null>(null);const pendingDeviceLossRef=useRef<string|null>(null);const lastVoiceKeyRef=useRef("");const previousSoundSnapshotRef=useRef(initial);const [snapshot,setSnapshot]=useState(initial);const [target,setTarget]=useState<SupportedMovement>("squat");const [trackingGuidance,setTrackingGuidance]=useState("");const [voiceEnabled,setVoiceEnabled]=useState(true);const [soundEnabled,setSoundEnabled]=useState(false);const [missing,setMissing]=useState(false);
 const handleDeviceLoss=useCallback((reason:string)=>{const controller=controllerRef.current;if(controller)controller.pause(reason);else pendingDeviceLossRef.current=reason},[]);
 const handleTrackingRetry=useCallback(()=>controllerRef.current?.resume(),[]);
 const handleGuidanceChange=useCallback((message:string)=>setTrackingGuidance(message),[]);
 useEffect(()=>{const session=loadMissionSession();if(!session){setMissing(true);return;}const exerciseById=new Map(session.workout.exercises.map(exercise=>[exercise.id,exercise]));const controller=createMissionController(session.workout,session.adventure);controllerRef.current=controller;const update=(value:MissionSnapshot)=>{setSnapshot(value);const segment=session.adventure.segments[value.segmentIndex];const exercise=segment&&exerciseById.get(segment.exerciseId);if(exercise)setTarget(exercise.movement)};const unsubscribe=controller.subscribe(update);const unsubscribeMovement=subscribeMovementEvents(window,event=>controller.consume(event));controller.start();if(pendingDeviceLossRef.current){controller.pause(pendingDeviceLossRef.current);pendingDeviceLossRef.current=null}let game:{destroy:(removeCanvas:boolean,noReturn?:boolean)=>void}|null=null;let cancelled=false;
 void import("phaser").then(({default:Phaser})=>{if(cancelled||!hostRef.current)return;const host=hostRef.current;const currentSnapshot=controller.getSnapshot();const currentSegment=session.adventure.segments[currentSnapshot.segmentIndex];const currentExercise=currentSegment&&exerciseById.get(currentSegment.exerciseId);const scene=createMissionScene(Phaser,host,{snapshot:currentSnapshot,target:currentExercise?.movement??"squat"});
 game=new Phaser.Game({type:Phaser.AUTO,parent:hostRef.current,width:960,height:540,backgroundColor:"#090b20",scene,physics:{default:"arcade"},render:{antialias:true}});});
 return()=>{cancelled=true;unsubscribe();unsubscribeMovement();game?.destroy(true);controllerRef.current=null;};},[]);
 useEffect(()=>{if(snapshot.status!=="complete")return;const session=loadMissionSession();if(session)saveSessionResult(session.workout,session.adventure,{completedByExercise:snapshot.completedByExercise,missedEvents:snapshot.totalMisses});},[snapshot.status,snapshot.completedByExercise,snapshot.totalMisses]);
 useEffect(()=>{publishMissionSceneUpdate(window,{snapshot,target})},[snapshot,target]);
 useEffect(()=>{if(!voiceEnabled){if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();lastVoiceKeyRef.current="";return}const cue=missionVoiceCue(snapshot,target,trackingGuidance);if(!cue||cue.key===lastVoiceKeyRef.current)return;lastVoiceKeyRef.current=cue.key;speakMissionCue(cue)},[snapshot,target,trackingGuidance,voiceEnabled]);
 useEffect(()=>{const previous=previousSoundSnapshotRef.current;previousSoundSnapshotRef.current=snapshot;if(!soundEnabled)return;const cue=missionSoundCue(previous,snapshot);if(cue)playMissionSound(cue)},[snapshot,soundEnabled]);
 useEffect(()=>()=>{if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();closeMissionSound()},[]);
 if(missing)return <main className="prepare-empty"><h1>No active mission.</h1><Link className="foundation-link" href="/plan">Plan an adventure</Link></main>;
 return <main className="mission-shell"><header className="mission-header"><div><p className="identity-kicker">Volcano Escape</p><h1>{snapshot.status==="complete"?"Mission complete":"Mission in progress"}</h1></div><div className="mission-controls"><button aria-pressed={voiceEnabled} onClick={()=>setVoiceEnabled(value=>!value)} type="button">Voice {voiceEnabled?"on":"off"}</button><button aria-pressed={soundEnabled} onClick={()=>setSoundEnabled(value=>{const next=!value;if(next)void unlockMissionSound();return next})} type="button">Sound {soundEnabled?"on":"off"}</button>{snapshot.status==="complete"?<Link className="foundation-link" href="/results">View results</Link>:<button onClick={()=>snapshot.status==="paused"?controllerRef.current?.resume():controllerRef.current?.pause()} type="button">{snapshot.status==="paused"?"Resume":"Pause"}</button>}</div></header><section className="mission-layout"><MissionPoseCamera target={target} paused={snapshot.status!=="playing"} onDeviceLoss={handleDeviceLoss} onRetry={handleTrackingRetry} onGuidanceChange={handleGuidanceChange}/><div className="game-canvas" ref={hostRef}/></section><section className="objective-hud"><div><span>Current objective</span><strong>{target}</strong></div><div><span>Progress</span><strong>{snapshot.segmentProgress}</strong></div><div><span>Combo</span><strong>×{snapshot.combo}</strong></div><div><span>XP</span><strong>{snapshot.xpEarned}</strong></div><progress max="100" value={snapshot.missionProgress}>{snapshot.missionProgress}%</progress></section>{snapshot.pauseReason&&<p role="status">{snapshot.pauseReason}</p>}</main>;
}
