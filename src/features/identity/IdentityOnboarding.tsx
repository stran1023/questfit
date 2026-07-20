"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TrailGuide } from "@/features/guide/TrailGuide";
import {
  defaultFitnessProfileInput,
  fitnessProfileSchema,
  type FitnessProfile,
  type FitnessProfileInput,
} from "./profileSchema";
import {
  createLocalProfileRepository,
  type ProfileRepository,
} from "./profileRepository";

type View = "welcome" | "profile" | "returning";

export default function IdentityOnboarding() {
  const router = useRouter();
  const [repository, setRepository] = useState<ProfileRepository | null>(null);
  const [view, setView] = useState<View>("welcome");
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [form, setForm] = useState<FitnessProfileInput>(defaultFitnessProfileInput);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const localRepository = createLocalProfileRepository(window.localStorage);
    setRepository(localRepository);
    const saved = localRepository.load();
    if (saved) {
      setProfile(saved);
      setForm({
        heightCm: saved.heightCm,
        weightKg: saved.weightKg,
        activityFrequency: saved.activityFrequency,
        fitnessLevel: saved.fitnessLevel,
        goal: saved.goal,
        movementLimitations: saved.movementLimitations,
      });
      setView("returning");
    }
  }, []);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const candidate = fitnessProfileSchema.omit({ schemaVersion: true, guestId: true, updatedAt: true }).safeParse(form);
    if (!candidate.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of candidate.error.issues) nextErrors[String(issue.path[0])] = issue.message;
      setErrors(nextErrors);
      return;
    }
    if (!repository) return;
    try {
      const saved = repository.save(candidate.data, profile?.guestId);
      setProfile(saved);
      setErrors({});
      setView("returning");
      setMessage("Profile saved on this device. You can edit it any time.");
    } catch {
      setMessage("This browser could not save your profile. Free some browser storage or change privacy settings, then retry.");
    }
  }

  if (view === "returning" && profile) {
    return (
      <main className="identity-shell identity-returning">
        <p className="identity-kicker">Player profile ready</p>
        <h1>Ready for the next run?</h1>
        <p className="identity-summary">
          Guest profile · {profile.heightCm} cm · {profile.activityFrequency} activity · {profile.fitnessLevel}
        </p>
        <TrailGuide compact message="Profile locked. Let’s choose your next trail." mood="cheering" />
        {message && <p className="identity-message" role="status">{message}</p>}
        <div className="identity-actions">
          <button className="identity-primary" onClick={() => router.push("/plan")} type="button">
            Continue adventure
          </button>
          <button className="identity-secondary" onClick={() => setView("profile")} type="button">
            Edit profile
          </button>
        </div>
        <p className="identity-privacy">Saved locally in this browser. Camera setup never stores video or landmarks.</p>
      </main>
    );
  }

  if (view === "profile") {
    return (
      <main className="identity-shell">
        <header className="identity-header">
          <button className="identity-back" onClick={() => setView(profile ? "returning" : "welcome")} type="button">
            ← Back
          </button>
          <span>Step 1 of 2 · Fitness profile</span>
        </header>
        <section className="profile-layout" aria-labelledby="profile-title">
          <div>
            <p className="identity-kicker">Player setup</p>
            <h1 id="profile-title">Tune your mission.</h1>
            <p className="identity-summary">Your stats set the pace. Saved locally. Not medical advice.</p>
            <TrailGuide compact message="Three quick choices help me set your pace." mood="pointing" />
            {message && <p className="identity-message" role="status">{message}</p>}
          </div>
          <form className="profile-form" onSubmit={saveProfile} noValidate>
            <div className="profile-pair">
              <label>
                Height (cm)
                <input
                  aria-describedby={errors.heightCm ? "height-error" : undefined}
                  inputMode="numeric"
                  min="100"
                  max="230"
                  onChange={(event) => setForm((current) => ({ ...current, heightCm: Number(event.target.value) }))}
                  type="number"
                  value={form.heightCm}
                />
                {errors.heightCm && <span className="field-error" id="height-error">Enter 100–230 cm.</span>}
              </label>
              <label>
                Weight (kg)
                <input
                  aria-describedby={errors.weightKg ? "weight-error" : undefined}
                  inputMode="decimal"
                  min="30"
                  max="300"
                  onChange={(event) => setForm((current) => ({ ...current, weightKg: Number(event.target.value) }))}
                  step="0.1"
                  type="number"
                  value={form.weightKg}
                />
                {errors.weightKg && <span className="field-error" id="weight-error">Enter 30–300 kg.</span>}
              </label>
            </div>
            <label>
              Activity frequency
              <select value={form.activityFrequency} onChange={(event) => setForm((current) => ({ ...current, activityFrequency: event.target.value as FitnessProfileInput["activityFrequency"] }))}>
                <option value="rarely">Rarely active</option>
                <option value="weekly">1–2 days per week</option>
                <option value="regular">3–4 days per week</option>
                <option value="frequent">5+ days per week</option>
              </select>
            </label>
            <div className="profile-pair">
              <label>
                Fitness level
                <select value={form.fitnessLevel} onChange={(event) => setForm((current) => ({ ...current, fitnessLevel: event.target.value as FitnessProfileInput["fitnessLevel"] }))}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                </select>
              </label>
              <label>
                Main goal
                <select value={form.goal} onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value as FitnessProfileInput["goal"] }))}>
                  <option value="general">General fitness</option>
                  <option value="cardio">Cardio endurance</option>
                  <option value="strength">Strength</option>
                  <option value="mobility">Mobility</option>
                </select>
              </label>
            </div>
            <label>
              Movement limitations <span>(optional)</span>
              <textarea
                maxLength={300}
                onChange={(event) => setForm((current) => ({ ...current, movementLimitations: event.target.value }))}
                placeholder="Anything that should reduce impact or range?"
                rows={3}
                value={form.movementLimitations}
              />
            </label>
            <button className="identity-primary" type="submit">Save and continue</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="identity-shell welcome-layout">
      <section>
        <p className="identity-kicker">Your body is the controller</p>
        <h1>Train. Fight. Escape.</h1>
        <p className="identity-summary">A personal workout becomes a live fantasy mission.</p>
        <TrailGuide message="I’m Scout. Let’s turn your workout into a trail worth conquering." mood="welcome" />
        <div className="identity-actions">
          <button className="identity-primary" onClick={() => setView("profile")} type="button">Start as guest</button>
        </div>
        <p className="identity-privacy">Guest mode · No account · Local progress · No camera upload</p>
      </section>
      <aside className="welcome-card" aria-label="Adventure preview">
        <span>Mission preview</span>
        <strong>Volcano Escape</strong>
        <p>Every verified rep moves the story.</p>
        <ul>
          <li>On-device body tracking</li>
          <li>Personalized mission plan</li>
          <li>Live movement combat</li>
        </ul>
      </aside>
    </main>
  );
}
