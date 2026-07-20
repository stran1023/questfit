"use client";

import { useEffect, useMemo, useState } from "react";
import type { CooldownPlan } from "@/features/workout-planner/planningSchemas";

export default function CooldownGuide({ plan, onComplete }: { plan: CooldownPlan; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(plan.durationSeconds);
  const stepDuration = plan.durationSeconds / plan.steps.length;
  const stepIndex = useMemo(
    () => Math.min(plan.steps.length - 1, Math.floor((plan.durationSeconds - remaining) / stepDuration)),
    [plan.durationSeconds, plan.steps.length, remaining, stepDuration],
  );

  useEffect(() => {
    if (remaining <= 0) { onComplete(); return; }
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1_000);
    return () => window.clearTimeout(timer);
  }, [remaining, onComplete]);

  return (
    <section className="cooldown-guide" aria-labelledby="cooldown-title">
      <div className="cooldown-orbit" aria-hidden="true"><span>{remaining}</span></div>
      <div>
        <p className="identity-kicker">Recovery sequence · Unscored</p>
        <h2 id="cooldown-title">Cool down. Mission secured.</h2>
        <p className="cooldown-current" aria-live="polite">{plan.steps[stepIndex]}</p>
        <ol>{plan.steps.map((step, index) => <li className={index === stepIndex ? "active" : index < stepIndex ? "done" : ""} key={step}>{step}</li>)}</ol>
        <p className="cooldown-note">Camera tracking is paused. Recovery does not change XP or accuracy.</p>
        <button onClick={onComplete} type="button">Finish cooldown</button>
      </div>
    </section>
  );
}
