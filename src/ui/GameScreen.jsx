import React, { useEffect, useRef, useState } from "react";
import { startWebcam, stopWebcam } from "../pose/captureWebcam.js";
import { closePoseEngine, detectPose, initPoseEngine } from "../pose/poseEngine.js";
import { classifyMovement, createLandmarkBuffer, pushLandmarks } from "../pose/movementClassifier.js";
import { createGameState, registerMiss, updateGameState } from "../game/gameState.js";
import { initRenderer, renderFrame } from "../game/renderEngine.js";

const BONES = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];
function drawSkeleton(canvas, points) { const ctx=canvas?.getContext("2d"); if(!ctx)return; ctx.clearRect(0,0,canvas.width,canvas.height);ctx.strokeStyle="#22d3ee";ctx.lineWidth=4;for(const[a,b]of BONES){if(!points[a]||!points[b])continue;ctx.beginPath();ctx.moveTo((1-points[a].x)*canvas.width,points[a].y*canvas.height);ctx.lineTo((1-points[b].x)*canvas.width,points[b].y*canvas.height);ctx.stroke()}ctx.fillStyle="#e879f9";for(const point of points){ctx.beginPath();ctx.arc((1-point.x)*canvas.width,point.y*canvas.height,3,0,Math.PI*2);ctx.fill()} }

export default function GameScreen({ thresholds, onGameOver }) {
  const videoRef=useRef(null), overlayRef=useRef(null), canvasRef=useRef(null);
  const actionRef=useRef("none"), mockUntilRef=useRef(0), gameStateRef=useRef(createGameState()), overRef=useRef(false);
  const [action,setAction]=useState("none"), [tracking,setTracking]=useState("Connecting");
  const [hud,setHud]=useState({score:0,misses:0,speed:0});
  const setCurrentAction=(next)=>{actionRef.current=next;setAction(next)};
  const triggerMockAction=(next)=>{mockUntilRef.current=performance.now()+700;setCurrentAction(next)};
  const simulateMiss=()=>{registerMiss(gameStateRef.current);setHud(s=>({...s,misses:gameStateRef.current.misses}))};

  useEffect(()=>{let stream,timer,cancelled=false;const buffer=createLandmarkBuffer();(async()=>{try{stream=await startWebcam(videoRef.current);await initPoseEngine();const tick=()=>{if(cancelled)return;const now=performance.now(),landmarks=detectPose(videoRef.current,now);drawSkeleton(overlayRef.current,landmarks);if(landmarks.length){pushLandmarks(buffer,landmarks);if(now>=mockUntilRef.current)setCurrentAction(classifyMovement(buffer,thresholds));setTracking("Live tracking")}else setTracking("Body not visible");timer=setTimeout(tick,1000/24)};tick()}catch(error){console.error(error);setTracking("Camera unavailable")}})();return()=>{cancelled=true;clearTimeout(timer);stopWebcam(stream);closePoseEngine()}},[thresholds]);

  useEffect(()=>{if(!import.meta.env.DEV)return;const key=(event)=>{if(event.repeat)return;if(event.code==="Space"||event.code==="ArrowUp"){event.preventDefault();triggerMockAction("jump")}if(event.code==="ArrowDown"){event.preventDefault();triggerMockAction("squat")}if(event.code==="KeyM")simulateMiss()};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);

  useEffect(()=>{const ctx=initRenderer(canvasRef.current);let raf,last=performance.now(),lastHud=0;const loop=(now)=>{const state=gameStateRef.current;updateGameState(state,(now-last)/1000,actionRef.current);last=now;renderFrame(ctx,state);if(now-lastHud>120){setHud({score:Math.floor(state.score),misses:state.misses,speed:Math.round(state.speed)});lastHud=now}if(state.phase==="game-over"&&!overRef.current){overRef.current=true;setTimeout(()=>onGameOver(Math.floor(state.score)),900)}else raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[onGameOver]);

  return <main className="app-shell game-layout">
    <section className="pose-panel">
      <div className="panel-heading"><div><p className="eyebrow">AI controller</p><h2>Pose tracking</h2></div><span className="live-dot">● {tracking}</span></div>
      <div className="pose-stage"><video ref={videoRef} muted playsInline/><canvas ref={overlayRef} width="640" height="480"/></div>
      <div className={`action-card ${action}`}><span>Detected action</span><strong>{action==="none"?"— Ready":action==="jump"?"▲ Jump":"▼ Squat"}</strong></div>
      {tracking === "Camera unavailable" && <button type="button" className="retry-button" onClick={() => window.location.reload()}>Reconnect camera</button>}
      <p className="privacy">🔒 Processed locally · Video is not uploaded</p>
    </section>
    <section className="game-panel">
      <div className="game-title"><div><p className="eyebrow">Escape run</p><h1>Stay ahead.</h1></div><div className="mini-hud"><b>Score <span>{String(hud.score).padStart(5,"0")}</span></b><b>Speed <span>{hud.speed}</span></b><b>Lives <span>{Array.from({length:3},(_,i)=>i<3-hud.misses?"◆":"◇").join(" ")}</span></b></div></div>
      <div className={`game-canvas-wrap danger-${hud.misses}`}><canvas ref={canvasRef} width="960" height="540"/></div>
      <p className="game-hint">Jump over cyan ground hazards · Squat under magenta barriers</p>
      {import.meta.env.DEV&&<div className="dev-controls" aria-label="Development controls"><div><p className="eyebrow">Dev controls</p><span>Space / ↑ Jump · ↓ Squat · M Miss</span></div><button onClick={()=>triggerMockAction("jump")}>▲ Jump</button><button onClick={()=>triggerMockAction("squat")}>▼ Squat</button><button className="miss" onClick={simulateMiss}>Miss</button></div>}
    </section>
  </main>;
}
