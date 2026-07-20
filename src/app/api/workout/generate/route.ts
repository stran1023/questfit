import { NextResponse } from "next/server";
import { workoutRequestSchema } from "@/features/workout-planner/planningSchemas";
import { generatePlanningExperience } from "@/features/workout-planner/planningService";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "Send a valid workout request and try again." },
      { status: 400 },
    );
  }

  const parsed = workoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "INVALID_REQUEST",
        message: "Choose a supported goal, duration, fitness level, activity frequency, and movement considerations.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  return NextResponse.json(await generatePlanningExperience(parsed.data));
}
