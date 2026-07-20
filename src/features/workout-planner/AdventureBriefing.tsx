"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { encounterCopyByMovement, encounterStageTitle, type WorkoutPlan } from "@/contracts";
import { saveMissionSession } from "@/features/calibration/missionSession";
import { TrailGuide } from "@/features/guide/TrailGuide";
import type { PlanRationale, WorkoutRequest } from "./planningSchemas";
import { loadPlanningRequest, loadPlanningResult, type PlanningResponse } from "./planningJourney";

const movementLabel: Record<WorkoutPlan["exercises"][number]["movement"], string> = { jump:"Jumps", squat:"Squats", lunge:"Lunges", "high-knees":"High knees", "jumping-jack":"Jumping jacks", "punch-left":"Left punches", "punch-right":"Right punches", "side-reach-left":"Left side reaches", "side-reach-right":"Right side reaches", "push-up":"Push-ups", plank:"Plank" };
const phaseLabel: Record<PlanRationale["phases"][number]["phase"], string> = { "warm-up":"Warm-up", build:"Build", surge:"Intensity surge", peak:"Peak challenge" };
const goalLabel: Record<WorkoutRequest["goal"], string> = { general:"Balanced energy", cardio:"Cardio pace", strength:"Strength focus", mobility:"Controlled mobility" };

function MissionPipeline({ request, result }: { request: WorkoutRequest; result: PlanningResponse }) {
  const firstExercise = result.workout.exercises[0];
  const steps = [["01","Profile",goalLabel[request.goal]],["02","Policy",`${result.workout.durationMinutes} min curve`],["03","AI plan",result.source === "personalized" ? "Personalized" : "Safe fallback"],["04","Game map",`${result.adventure.segments.length} encounters`],["05","Body input","On-device pose"],["06","Score","Verified facts"]];
  const limitation = request.movementLimitations.trim() ? `${request.movementLimitations.trim().slice(0,34)} → incompatible moves removed` : `${request.fitnessLevel} + ${request.activityFrequency} → ${result.rationale.intensity} load`;
  return <section className="mission-pipeline" aria-labelledby="mission-pipeline-title"><div className="pipeline-heading"><div><p className="planner-kicker">AI → action</p><h2 id="mission-pipeline-title">How your mission was built</h2></div><span>{result.source === "personalized" ? "Validated plan" : "Validated fallback"}</span></div><ol>{steps.map(([number,title,detail]) => <li key={number}><b>{number}</b><strong>{title}</strong><small>{detail}</small></li>)}</ol><div className="pipeline-mappings"><span>{goalLabel[request.goal]} → ordered stages</span><span>{limitation}</span><span>{movementLabel[firstExercise.movement]} → {encounterCopyByMovement[firstExercise.movement].title}</span><span>{result.workout.exercises.reduce((sum,item) => sum + item.target,0)} targets → up to {result.adventure.rewards.baseXp} XP</span></div></section>;
}

function PlanRationaleCards({ request, result }: { request: WorkoutRequest; result: PlanningResponse }) {
  const chips = [["Intensity", result.rationale.intensity], ["Duration", `${result.workout.durationMinutes} min`], ["Route", `${result.workout.exercises.length} stages`], ["Level", request.fitnessLevel]];
  const icons = ["◎", "↗", "◇", "✓"];
  const limitationReason = request.movementLimitations ? result.rationale.reasons.find((reason) => /remove|avoid|limitation|impact/i.test(reason)) : undefined;
  const displayedReasons = limitationReason ? [...result.rationale.reasons.filter((reason) => reason !== limitationReason).slice(0,3), limitationReason] : result.rationale.reasons.slice(0,4);
  return <section className="rationale-scan" aria-labelledby="rationale-title"><div className="rationale-heading"><div><p className="planner-kicker">Built for your trail</p><h3 id="rationale-title">Why this plan fits</h3></div><span>Quick scan</span></div><div className="rationale-chips" aria-label="Plan profile">{chips.map(([label,value])=><span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div><div className="rationale-cards">{displayedReasons.map((reason,index)=><article key={reason} style={{"--reveal-order":index} as CSSProperties}><i aria-hidden="true">{icons[index]}</i><div><strong>{index === 0 ? "Goal match" : index === 1 ? "Pace curve" : index === 2 ? "Movement fit" : "Safe finish"}</strong><p>{reason}</p></div></article>)}</div><p className="rationale-summary">{result.rationale.summary}</p></section>;
}

export default function AdventureBriefing() {
  const router = useRouter();
  const [error,setError] = useState<string|null>(null);
  const [journey,setJourney] = useState<{request: NonNullable<ReturnType<typeof loadPlanningRequest>>; result: NonNullable<ReturnType<typeof loadPlanningResult>>}|null>();
  useEffect(() => {
    const request = loadPlanningRequest(sessionStorage);
    const result = loadPlanningResult(sessionStorage);
    setJourney(request && result ? {request,result} : null);
  }, []);
  if (journey === undefined) return <main className="journey-shell"><section className="journey-missing"><p className="planner-kicker">Opening briefing</p><h1>Mission ready...</h1></section></main>;
  const request = journey?.request ?? null;
  const result = journey?.result ?? null;
  if (!request || !result) return <main className="journey-shell route-enter"><section className="journey-missing"><p className="planner-kicker">Briefing unavailable</p><h1>Your next adventure starts with a plan.</h1><p>The saved briefing was missing or invalid.</p><Link className="begin-button" href="/plan">Create adventure</Link></section></main>;
  const validatedResult = result;
  const totalTargets = result.workout.exercises.reduce((sum, exercise) => sum + exercise.target, 0);

  function beginMission() { try { saveMissionSession({ workout: validatedResult.workout, adventure: validatedResult.adventure, cooldown: validatedResult.rationale.cooldown }); router.push("/prepare"); } catch { setError("This browser could not save the mission. Free some browser storage or change privacy settings, then retry."); } }

  return <main className="briefing-shell route-enter">
    <header className="planner-header"><Link className="planner-brand" href="/plan">AI Fitness Escape</Link><span className="demo-mode">Mission ready</span></header>
    <section className="briefing-hero briefing-hero-compact" aria-labelledby="briefing-title"><div className="briefing-hero-copy"><div className="briefing-badges"><span>⚡ AI-built</span><span>✓ Movement-safe</span></div><p className="planner-kicker">Volcano mission</p><h1 id="briefing-title">{result.adventure.title}</h1><p>Defeat the Ash Titan. Escape the eruption.</p></div><div className="briefing-visual" aria-hidden="true"><span>Boss encounter</span><strong>Ash Titan</strong><i>Strike · Dodge · Escape</i></div></section>
    <TrailGuide message="Route locked. Warm up, reach the Titan, finish strong." mood="pointing" />
    <section className="briefing-stat-grid" aria-label="Mission stats"><article><span aria-hidden="true">◷</span><small>Duration</small><strong>{result.workout.durationMinutes} min</strong></article><article><span aria-hidden="true">◆</span><small>Difficulty</small><strong>{result.workout.difficulty} / 5</strong></article><article><span aria-hidden="true">◎</span><small>Checkpoints</small><strong>4</strong></article><article><span aria-hidden="true">↯</span><small>Moves</small><strong>{result.workout.exercises.length}</strong></article><article className="reward-stat"><span aria-hidden="true">★</span><small>Reward</small><strong>{result.adventure.rewards.baseXp} XP</strong></article></section>
    <section className="route-card" aria-labelledby="route-title"><div className="route-card-heading"><div><p className="planner-kicker">Adventure map</p><h2 id="route-title">Trailhead → Titan → Escape</h2></div><span>{totalTargets} targets</span></div><ol className="route-map adventure-map"><li><i aria-hidden="true">▲</i><strong>Trailhead</strong><small>Warm-up ridge</small></li><li><i aria-hidden="true">≋</i><strong>Lava Steps</strong><small>Build the pace</small></li><li className="boss-marker"><i aria-hidden="true">♜</i><strong>Ash Titan</strong><small>Boss threat</small></li><li className="storm-marker"><i aria-hidden="true">◎</i><strong>Storm Gate</strong><small>Escape right</small></li></ol><div className="map-legend"><span>⚔ Boss battle</span><span>→ Route runs left to right</span><span>✓ {result.rationale.cooldown.durationSeconds}s recovery after escape</span></div><div className="movement-strip" aria-label="Workout movements">{result.workout.exercises.map((exercise,index) => <span key={exercise.id}><b>{index + 1}</b>{movementLabel[exercise.movement]} × {exercise.target}</span>)}</div></section>
    <PlanRationaleCards request={request} result={result}/>
    <details className="briefing-details"><summary><span><b>Mission details</b><small>AI pipeline, instructions and safety</small></span><i aria-hidden="true">＋</i></summary><div className="briefing-details-content">{result.notice && <p className="fallback-notice">{result.notice}</p>}<MissionPipeline request={request} result={result}/><ol className="objectives briefing-objectives">{result.adventure.segments.map((segment) => { const exercise=result.workout.exercises.find((item)=>item.id===segment.exerciseId); const phase=result.rationale.phases.find((item)=>item.exerciseId===segment.exerciseId)?.phase; const matching=exercise?result.adventure.segments.filter((candidate)=>result.workout.exercises.find((item)=>item.id===candidate.exerciseId)?.movement===exercise.movement):[]; const index=matching.findIndex((candidate)=>candidate.id===segment.id)+1; return <li key={segment.id}><span>0{segment.order}</span><div><strong>{phase?phaseLabel[phase]:"Workout"}</strong><h3>{exercise?encounterStageTitle(exercise.movement,{index,total:matching.length}):"Encounter"}</h3><p>{exercise?movementLabel[exercise.movement]:"Movement"} × {segment.target}</p><small>{exercise?encounterCopyByMovement[exercise.movement].instruction:""}</small></div></li>; })}</ol></div></details>
    <section className="briefing-start"><div><span>✓ On-device tracking</span><span>✓ Guided cooldown</span></div><button className="begin-button" onClick={beginMission} type="button">Start Adventure <span aria-hidden="true">→</span></button></section>
    {error && <div className="planner-error" role="alert"><p>{error}</p></div>}
  </main>;
}
