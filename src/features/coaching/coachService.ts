import { coachSummarySchema, type CoachSummary, type Recommendation, type SessionMetrics } from "@/contracts";

export type CoachFacts = { metrics: SessionMetrics; recommendation: Recommendation };
export type CoachProvider = (facts: CoachFacts) => Promise<unknown>;

export function fallbackCoachSummary({ metrics, recommendation }: CoachFacts): CoachSummary {
  const focus = recommendation.focusExercise ? ` Focus next time on ${recommendation.focusExercise}.` : "";
  return coachSummarySchema.parse({
    headline: metrics.completionRate === 100 ? "Mission complete" : "Workout recorded",
    summary: `You completed ${metrics.completedTargets} of ${metrics.plannedTargets} targets with ${metrics.accuracy}% accuracy and earned ${metrics.xpEarned} XP.`,
    recommendation: `Next difficulty: ${recommendation.difficulty}.${focus}`,
  });
}

export async function generateCoachSummary(
  facts: CoachFacts,
  provider?: CoachProvider,
  timeoutMs = 1500,
): Promise<{ summary: CoachSummary; source: "provider" | "fallback" }> {
  if (!provider) return { summary: fallbackCoachSummary(facts), source: "fallback" };
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const raw = await Promise.race([
      provider(facts),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Coach timeout")), timeoutMs); }),
    ]);
    const parsed = coachSummarySchema.safeParse(raw);
    if (!parsed.success) throw new Error("Invalid coach output");
    const grounded = fallbackCoachSummary(facts);
    return { summary: { ...grounded, headline: parsed.data.headline }, source: "provider" };
  } catch {
    return { summary: fallbackCoachSummary(facts), source: "fallback" };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
