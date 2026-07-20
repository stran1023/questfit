"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TrailGuide } from "@/features/guide/TrailGuide";
import { createLocalProfileRepository } from "@/features/identity/profileRepository";
import type { WorkoutRequest } from "./planningSchemas";
import { loadPlanningRequest, savePlanningRequest } from "./planningJourney";

const initialRequest: WorkoutRequest = { goal: "general", durationMinutes: 10, fitnessLevel: "beginner", activityFrequency: "weekly", movementLimitations: "" };

export default function WorkoutPlanner() {
  const router = useRouter();
  const [request, setRequest] = useState(initialRequest);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const journeyRequest = loadPlanningRequest(sessionStorage);
    if (journeyRequest) {
      setRequest(journeyRequest);
      return;
    }
    const profile = createLocalProfileRepository(localStorage).load();
    if (profile) setRequest((current) => ({ ...current, goal: profile.goal, fitnessLevel: profile.fitnessLevel, activityFrequency: profile.activityFrequency, movementLimitations: profile.movementLimitations }));
  }, []);

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      savePlanningRequest(sessionStorage, request);
      router.push("/ai-to-action");
    } catch {
      setError("This browser could not start planning. Free some browser storage or change privacy settings, then retry.");
    }
  }

  return <main className="planner-shell route-enter">
    <header className="planner-header"><a className="planner-brand" href="#planner">QuestFit</a><span className="demo-mode">Guest demo · Local progress</span></header>
    <section className="planner-hero" aria-labelledby="planner-title">
      <div className="planner-pitch"><p className="planner-kicker">Build your run</p><h1 id="planner-title">Train hard. <span>Play harder.</span></h1><p className="planner-summary">Choose your goal. We&apos;ll turn it into a body-controlled adventure.</p><TrailGuide compact message="Choose the goal. I’ll map the challenge." mood="pointing" /><div className="sport-stats" aria-label="Adventure features"><span><b>01</b> Personalized</span><span><b>02</b> Movement-safe</span><span><b>03</b> Game-ready</span></div></div>
      <form className="planner-form" id="planner" onSubmit={generate}>
        <label>Goal<select value={request.goal} onChange={(event) => setRequest((current) => ({ ...current, goal: event.target.value as WorkoutRequest["goal"] }))}><option value="general">Move and feel energized</option><option value="cardio">Cardio endurance</option><option value="strength">Lower-body strength</option><option value="mobility">Controlled mobility</option></select></label>
        <fieldset><legend>Available time</legend><div className="choice-row">{([10,15,20] as const).map((duration) => <label className="choice" key={duration}><input checked={request.durationMinutes === duration} name="duration" onChange={() => setRequest((current) => ({ ...current, durationMinutes: duration }))} type="radio"/><span>{duration} min</span></label>)}</div></fieldset>
        <label>Fitness level<select value={request.fitnessLevel} onChange={(event) => setRequest((current) => ({ ...current, fitnessLevel: event.target.value as WorkoutRequest["fitnessLevel"] }))}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option></select></label>
        <label>Activity frequency<select value={request.activityFrequency} onChange={(event) => setRequest((current) => ({ ...current, activityFrequency: event.target.value as WorkoutRequest["activityFrequency"] }))}><option value="rarely">Rarely active</option><option value="weekly">Active weekly</option><option value="regular">Active 3–4 days/week</option><option value="frequent">Active most days</option></select></label>
        <label>Movement considerations <span className="optional-label">Optional</span><textarea maxLength={300} onChange={(event) => setRequest((current) => ({ ...current, movementLimitations: event.target.value }))} placeholder="Example: knee sensitivity, avoid jumping" rows={3} value={request.movementLimitations}/></label>
        <button className="planner-submit" type="submit">Generate my adventure <span aria-hidden="true">→</span></button>
        {error && <div className="planner-error" role="alert"><p>{error}</p></div>}
      </form>
    </section>
    <p className="planner-privacy">Camera processing stays on this device. No video is uploaded.</p>
  </main>;
}
