import { coachSummarySchema, recommendationSchema, sessionMetricsSchema, type AdventureBlueprint, type CoachSummary, type Recommendation, type SessionMetrics, type WorkoutPlan } from "@/contracts";
import { fallbackCoachSummary } from "./coachService";
import { analyzeSession, recommendNextSession, type SessionPerformance } from "./sessionAnalysis";

const resultKey = "ai-fitness-escape:latest-result:v1";
export type SessionResult = { metrics: SessionMetrics; recommendation: Recommendation; coach: CoachSummary; coachSource: "fallback"; persistence: "session"|"memory" };
let memoryResult:SessionResult|null=null;

export function saveSessionResult(workout: WorkoutPlan, adventure: AdventureBlueprint, performance: SessionPerformance) {
  const metrics = analyzeSession(workout, adventure, performance);
  const recommendation = recommendNextSession(metrics);
  const result: SessionResult = { metrics, recommendation, coach: fallbackCoachSummary({ metrics, recommendation }), coachSource: "fallback", persistence:"session" };
  try{sessionStorage.setItem(resultKey, JSON.stringify(result));memoryResult=result}catch{result.persistence="memory";memoryResult=result}
  return result;
}

export function loadSessionResult(): SessionResult | null {
  let serialized:string|null;try{serialized=sessionStorage.getItem(resultKey)}catch{return memoryResult}if(!serialized)return memoryResult;
  try { const raw=JSON.parse(serialized) as Record<string,unknown>;return {metrics:sessionMetricsSchema.parse(raw.metrics),recommendation:recommendationSchema.parse(raw.recommendation),coach:coachSummarySchema.parse(raw.coach),coachSource:"fallback",persistence:"session"}; } catch { return null; }
}
