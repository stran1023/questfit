"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdventureBlueprint, WorkoutPlan } from "@/contracts";
import type { WorkoutRequest } from "./planningSchemas";
import { saveMissionSession } from "@/features/calibration/missionSession";
import { createLocalProfileRepository } from "@/features/identity/profileRepository";
import type { PlanRationale } from "./planningSchemas";

type PlanningResponse = {
  source: "personalized" | "fallback";
  workout: WorkoutPlan;
  adventure: AdventureBlueprint;
  rationale: PlanRationale;
  notice: string | null;
};

const initialRequest: WorkoutRequest = {
  goal: "general",
  durationMinutes: 10,
  fitnessLevel: "beginner",
  activityFrequency: "weekly",
  movementLimitations: "",
};
const movementLabel:Record<WorkoutPlan["exercises"][number]["movement"],string>={jump:"Jumps",squat:"Squats",lunge:"Lunges","high-knees":"High knees","jumping-jack":"Jumping jacks","punch-left":"Left punches","punch-right":"Right punches","side-reach-left":"Left side reaches","side-reach-right":"Right side reaches","push-up":"Push-ups",plank:"Plank"};
const phaseLabel:Record<PlanRationale["phases"][number]["phase"],string>={"warm-up":"Warm-up",primary:"Primary work",variation:"Variation",peak:"Peak challenge",finish:"Finale"};

export default function WorkoutPlanner() {
  const router = useRouter();
  const [request, setRequest] = useState(initialRequest);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<PlanningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profile = createLocalProfileRepository(localStorage).load();
    if (!profile) return;
    setRequest((current) => ({
      ...current,
      goal: profile.goal,
      fitnessLevel: profile.fitnessLevel,
      activityFrequency: profile.activityFrequency,
      movementLimitations: profile.movementLimitations,
    }));
  }, []);

  async function generate(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/workout/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request),
      });
      const payload = (await response.json()) as PlanningResponse | { message?: string };
      if (!response.ok || !("workout" in payload)) {
        throw new Error("message" in payload ? payload.message : "Adventure planning failed.");
      }
      setResult(payload);
      setStatus("success");
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Adventure planning failed. Please retry.");
      setStatus("error");
    }
  }

  function beginMission() {
    if (!result) return;
    try {
      saveMissionSession({ workout: result.workout, adventure: result.adventure });
      router.push("/prepare");
    } catch {
      setError("This browser could not save the mission. Free some browser storage or change privacy settings, then retry.");
      setStatus("error");
    }
  }

  return (
    <main className="planner-shell">
      <header className="planner-header">
        <a className="planner-brand" href="#planner">
          AI Fitness Escape
        </a>
        <span className="demo-mode">Guest demo · Local progress</span>
      </header>

      <section className="planner-hero" aria-labelledby="planner-title">
        <div>
          <p className="planner-kicker">Personalized mission planning</p>
          <h1 id="planner-title">
            Turn today&apos;s workout into <span>an adventure.</span>
          </h1>
          <p className="planner-summary">
            Choose your goal and available time. The planner builds a validated workout and
            transforms every exercise into a playable Volcano Escape objective.
          </p>
        </div>

        <form className="planner-form" id="planner" onSubmit={generate}>
          <label>
            Goal
            <select
              value={request.goal}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  goal: event.target.value as WorkoutRequest["goal"],
                }))
              }
            >
              <option value="general">Move and feel energized</option>
              <option value="cardio">Cardio endurance</option>
              <option value="strength">Lower-body strength</option>
              <option value="mobility">Gentle mobility</option>
            </select>
          </label>

          <fieldset>
            <legend>Available time</legend>
            <div className="choice-row">
              {([10, 15, 20] as const).map((duration) => (
                <label className="choice" key={duration}>
                  <input
                    checked={request.durationMinutes === duration}
                    name="duration"
                    onChange={() => setRequest((current) => ({ ...current, durationMinutes: duration }))}
                    type="radio"
                  />
                  <span>{duration} min</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Fitness level
            <select
              value={request.fitnessLevel}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  fitnessLevel: event.target.value as WorkoutRequest["fitnessLevel"],
                }))
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </label>

          <label>
            Activity frequency
            <select
              value={request.activityFrequency}
              onChange={(event) => setRequest((current) => ({ ...current, activityFrequency: event.target.value as WorkoutRequest["activityFrequency"] }))}
            >
              <option value="rarely">Rarely active</option>
              <option value="weekly">Active weekly</option>
              <option value="regular">Active 3–4 days/week</option>
              <option value="frequent">Active most days</option>
            </select>
          </label>

          <label>
            Movement considerations <span className="optional-label">Optional</span>
            <textarea
              maxLength={300}
              onChange={(event) => setRequest((current) => ({ ...current, movementLimitations: event.target.value }))}
              placeholder="Example: knee sensitivity, avoid jumping, limited floor space"
              rows={3}
              value={request.movementLimitations}
            />
          </label>

          <button className="planner-submit" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Building your adventure…" : "Generate my adventure"}
          </button>
        </form>
      </section>

      <div aria-live="polite" className="planner-live-region">
        {status === "loading" && "Analyzing your choices, planning the workout, and building the mission."}
        {status === "error" && (
          <div className="planner-error" role="alert">
            <p>{error}</p>
            <button onClick={() => void generate()} type="button">
              Retry planning
            </button>
          </div>
        )}
      </div>

      {result && (
        <section className="briefing" aria-labelledby="briefing-title">
          <div className="mission-art" aria-hidden="true">
            <span>Volcano</span>
            <strong>Escape</strong>
          </div>
          <div className="briefing-content">
            <p className="planner-kicker">Adventure briefing</p>
            <h2 id="briefing-title">{result.adventure.title}</h2>
            <p>
              {result.workout.durationMinutes} minutes · Difficulty {result.workout.difficulty} · Earn up to{" "}
              {result.adventure.rewards.baseXp} XP
            </p>
            {result.notice && <p className="fallback-notice">{result.notice}</p>}
            <section className="plan-rationale" aria-labelledby="plan-rationale-title">
              <p className="planner-kicker">Why this plan · {result.rationale.intensity} intensity</p>
              <h3 id="plan-rationale-title">Built for today&apos;s intent</h3>
              <p>{result.rationale.summary}</p>
              <ul>{result.rationale.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </section>
            <ol className="objectives">
              {result.adventure.segments.map((segment) => {
                const exercise = result.workout.exercises.find((item) => item.id === segment.exerciseId);
                const phase = result.rationale.phases.find((item) => item.exerciseId === segment.exerciseId)?.phase;
                return (
                  <li key={segment.id}>
                    <span>0{segment.order}</span>
                    <div>
                      <strong>{phase ? phaseLabel[phase] : "Workout"}</strong>
                      <p>{exercise?movementLabel[exercise.movement]:"Movement"} × {segment.target}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <button className="begin-button" onClick={beginMission} type="button">
              Prepare for mission
            </button>
          </div>
        </section>
      )}

      <p className="planner-privacy">Camera processing stays on this device. No video is uploaded.</p>
    </main>
  );
}
