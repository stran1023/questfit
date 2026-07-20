"use client";
import { useEffect, useRef, useState } from "react";
import type { SupportedMovement } from "@/contracts";
import { startWebcam, stopWebcam } from "@/pose/captureWebcam.js";
import { closePoseEngine, detectPose, initPoseEngine } from "@/pose/poseEngine.js";
import { loadCalibrationThresholds } from "@/features/calibration/missionSession";
import type { LandmarkFrame } from "@/features/calibration/calibrationDomain";
import { clearPoseOverlay, drawPoseOverlay } from "@/features/calibration/poseOverlay";
import { createMissionMovementRuntime, type PoseReadiness } from "./missionMovementRuntime";
import { publishMovementEvent } from "./missionEventBridge";

type Props={target:SupportedMovement;paused:boolean;onDeviceLoss:(reason:string)=>void;onRetry:()=>void;onGuidanceChange:(message:string)=>void};
type CameraState="starting"|PoseReadiness|"error";

const movementCue:Record<SupportedMovement,string>={jump:"Jump and land in your standing position.",squat:"Squat low, then return fully upright.",lunge:"Step into a lunge, then return to standing.","high-knees":"Alternate a clear left and right knee lift.","jumping-jack":"Open arms and feet, then return to neutral.","punch-left":"Extend your left fist, then return to guard.","punch-right":"Extend your right fist, then return to guard.","side-reach-left":"Lean and reach left, then return upright.","side-reach-right":"Lean and reach right, then return upright.","push-up":"Turn sideways; lower, then fully extend your arms.",plank:"Turn sideways and hold a straight plank."};

export default function MissionPoseCamera({target,paused,onDeviceLoss,onRetry,onGuidanceChange}:Props){
 const videoRef=useRef<HTMLVideoElement>(null);const overlayRef=useRef<HTMLCanvasElement>(null);const targetRef=useRef(target);const pausedRef=useRef(paused);const [state,setState]=useState<CameraState>("starting");const [latency,setLatency]=useState<number|null>(null);const [runId,setRunId]=useState(0);
 useEffect(()=>{targetRef.current=target},[target]);useEffect(()=>{pausedRef.current=paused},[paused]);
 useEffect(()=>{const thresholds=loadCalibrationThresholds();const overlay=overlayRef.current;if(!thresholds){setState("error");onDeviceLoss("Saved movement setup is missing. Return to preparation.");return;}let stream:MediaStream|null=null,timer:ReturnType<typeof setTimeout>|null=null,cancelled=false,count=0,total=0;const runtime=createMissionMovementRuntime(thresholds);const fail=(reason:string)=>{if(cancelled)return;setState("error");onDeviceLoss(reason)};
  void (async()=>{try{stream=await startWebcam(videoRef.current) as MediaStream;for(const track of stream.getVideoTracks())track.addEventListener("ended",()=>fail("Camera disconnected. Reconnect it, then resume."),{once:true});await initPoseEngine();const tick=()=>{if(cancelled)return;try{const start=performance.now();const frame=detectPose(videoRef.current,start) as LandmarkFrame;total+=performance.now()-start;count++;if(count%24===0)setLatency(total/count);drawPoseOverlay(overlay,frame);if(!pausedRef.current&&frame.length){const result=runtime.push(frame,targetRef.current);setState(current=>current===result.readiness?current:result.readiness);if(result.event)publishMovementEvent(window,result.event);}timer=setTimeout(tick,1000/24);}catch{fail("Pose tracking stopped. Check the camera, then resume.");}};tick();}catch{fail("Camera or pose tracking could not start. Allow camera access and retry preparation.");}})();
  return()=>{cancelled=true;if(timer)clearTimeout(timer);runtime.reset();clearPoseOverlay(overlay);stopWebcam(stream);closePoseEngine();};},[onDeviceLoss,runId]);
 const guidance=state==="needs-side-view"?"Turn sideways and keep shoulders, hips, and feet visible.":state==="needs-full-body"?"Step back until your full body is visible.":state==="error"?"Tracking unavailable.":state==="tracking"?movementCue[target]:"Starting on-device tracking…";
 useEffect(()=>onGuidanceChange(guidance),[guidance,onGuidanceChange]);
 return <aside className="mission-camera" aria-label="Pose tracking"><div className="mission-video"><video ref={videoRef} muted playsInline/><canvas ref={overlayRef} width="640" height="480" aria-hidden="true"/><span>● {state==="tracking"?"Live tracking":state.replaceAll("-"," ")}</span></div><strong>{guidance}</strong><small>{latency===null?"Measuring inference latency.":`Average inference ${latency.toFixed(1)} ms.`}</small>{state==="error"&&<button type="button" onClick={()=>{setState("starting");setLatency(null);setRunId(value=>value+1);onRetry()}}>Retry tracking</button>}<small>Processed on this device. Video and landmarks are not uploaded.</small></aside>
}
