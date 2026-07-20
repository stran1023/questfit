"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { encounterCopyByMovement } from "@/contracts";
import { TrailGuide } from "@/features/guide/TrailGuide";
import { loadSessionResult, type SessionResult } from "./sessionResultRepository";

const difficultyCopy = {
  decrease: "Choose a lighter target next time and finish with control.",
  maintain: "Keep this difficulty and build a cleaner streak.",
  increase: "You are ready for a slightly harder mission.",
} as const;

export default function ResultsScreen() {
  const [result, setResult] = useState<SessionResult | null | undefined>();
  useEffect(() => setResult(loadSessionResult()), []);

  if (result === undefined) return <main className="prepare-empty"><p>Loading results…</p></main>;
  if (!result) return <main className="prepare-empty"><h1>No completed mission yet.</h1><Link className="foundation-link" href="/plan">Plan a mission</Link></main>;

  const bestMovement = result.metrics.bestExercise ? encounterCopyByMovement[result.metrics.bestExercise].movementLabel : "—";
  const focusMovement = result.recommendation.focusExercise ? encounterCopyByMovement[result.recommendation.focusExercise].movementLabel : null;
  const ringStyle = { "--completion": `${result.metrics.completionRate * 3.6}deg` } as CSSProperties;

  return (
    <main className="results-shell">
      <section className="results-hero">
        <div>
          <p className="identity-kicker">Mission cleared</p>
          <h1>{result.coach.headline}</h1>
          <p className="results-lead">On-device moves. Deterministic score. No guesswork.</p>
        </div>
        <div className="completion-ring" style={ringStyle} aria-label={`${result.metrics.completionRate}% mission completion`}>
          <div><strong>{result.metrics.completionRate}%</strong><span>escaped</span></div>
        </div>
      </section>

      <TrailGuide message={`You cleared the route and banked ${result.metrics.xpEarned} XP. Strong finish!`} mood="cheering" />

      {result.persistence === "memory" && <p className="results-warning" role="status">Browser storage is unavailable. These results last only until this page is closed.</p>}

      <section className="results-grid" aria-label="Session facts">
        <div><span>Movements cleared</span><strong>{result.metrics.completedTargets}/{result.metrics.plannedTargets}</strong></div>
        <div><span>Recognition accuracy</span><strong>{result.metrics.accuracy}%</strong></div>
        <div><span>XP earned</span><strong>+{result.metrics.xpEarned}</strong></div>
        <div><span>Strongest movement</span><strong>{bestMovement}</strong></div>
      </section>

      <section className="coach-card">
        <p className="identity-kicker">AI recap · facts locked</p>
        <h2>{result.coach.summary}</h2>
        <p>{result.coach.recommendation}</p>
        <div className="next-challenge"><span>Recommended next mission</span><strong>{difficultyCopy[result.recommendation.difficulty]}</strong>{focusMovement && <small>Focus movement: {focusMovement}</small>}</div>
      </section>

      <nav className="results-actions" aria-label="Next adventure">
        <Link className="results-primary" href="/prepare">Replay this adventure</Link>
        <Link className="results-secondary" href="/plan">Build a new plan</Link>
      </nav>
      <p className="results-footnote">No medical or health score is calculated. Coaching uses only this mission&apos;s verified completion facts.</p>
    </main>
  );
}
