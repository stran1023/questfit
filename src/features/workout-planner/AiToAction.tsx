"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrailGuide } from "@/features/guide/TrailGuide";
import type { WorkoutRequest } from "./planningSchemas";
import { loadPlanningRequest, savePlanningResult } from "./planningJourney";

const stages = ["Analyzing your preferences...", "Finding the best route...", "Generating challenges...", "Preparing your adventure...", "Finalizing your briefing..."];
const stageDelayMs = 620;
const guideMessages = ["Reading your trail profile.", "Plotting the safest route.", "Turning moves into checkpoints.", "Loading the boss encounter.", "Briefing ready—almost there!"];

export default function AiToAction() {
  const router = useRouter();
  const started = useRef(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [request, setRequest] = useState<WorkoutRequest | null>();

  useEffect(() => setRequest(loadPlanningRequest(sessionStorage)), []);

  const generate = useCallback(async () => {
    if (!request) return;
    setError(null);
    setStage(0);
    const startedAt = Date.now();
    const interval = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), stageDelayMs);
    try {
      const response = await fetch("/api/workout/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request) });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(typeof payload === "object" && payload && "message" in payload ? String(payload.message) : "Adventure planning failed.");
      const minimumDwell = stageDelayMs * stages.length - (Date.now() - startedAt);
      if (minimumDwell > 0) await new Promise((resolve) => window.setTimeout(resolve, minimumDwell));
      setStage(stages.length - 1);
      savePlanningResult(sessionStorage, payload);
      window.setTimeout(() => router.replace("/briefing"), 280);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Adventure planning failed. Please retry.");
    } finally {
      window.clearInterval(interval);
    }
  }, [request, router]);

  useEffect(() => {
    if (started.current || !request) return;
    started.current = true;
    void generate();
  }, [attempt, generate, request]);

  function retry() {
    started.current = false;
    setAttempt((value) => value + 1);
  }

  if (request === undefined) return <main className="journey-shell"><section className="journey-missing"><p className="planner-kicker">Opening builder</p><h1>Loading your route...</h1></section></main>;
  if (!request) return <main className="journey-shell route-enter"><section className="journey-missing"><p className="planner-kicker">Mission data missing</p><h1>Let&apos;s rebuild your route.</h1><p>Your planning choices were not found in this browser.</p><Link className="begin-button" href="/plan">Back to planner</Link></section></main>;

  const progress = error ? Math.max(12, (stage / stages.length) * 100) : ((stage + 1) / stages.length) * 100;
  return <main className="journey-shell route-enter">
    <header className="journey-header"><span className="planner-brand">AI Fitness Escape</span><span className="demo-mode">AI → Action</span></header>
    <section className="action-builder" aria-labelledby="action-title">
      <div className="action-orbit" aria-hidden="true"><span/><span/><span/><strong>{error ? "!" : `${Math.round(progress)}%`}</strong></div>
      <div className="action-copy"><p className="planner-kicker">Building your mission</p><h1 id="action-title">Your goals are becoming <span>gameplay.</span></h1><p className="action-status" aria-live="polite">{error ? "Build paused" : stages[stage]}</p><TrailGuide compact message={error ? "Trail signal dropped. Your choices are safe—let’s retry." : guideMessages[stage]} mood="thinking" />
        <div className="action-progress" role="progressbar" aria-label="Adventure generation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }}/></div>
        <ol className="action-stages">{stages.map((label,index) => <li className={index < stage ? "complete" : index === stage && !error ? "active" : ""} key={label}><span>{index < stage ? "✓" : `0${index + 1}`}</span><p>{label.replace("...", "")}</p></li>)}</ol>
        {error && <div className="planner-error" role="alert"><p>{error}</p><div><button onClick={retry} type="button">Retry planning</button><Link href="/plan">Edit choices</Link></div></div>}
      </div>
    </section>
    <p className="planner-privacy">Validated planning · Safe fallback · On-device movement</p>
  </main>;
}
