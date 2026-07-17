// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { publishMovementEvent, subscribeMovementEvents } from "./missionEventBridge";

describe("mission movement event bridge", () => {
  it("delivers validated detector events and unsubscribes cleanly", () => {
    const target = new EventTarget();
    const consume = vi.fn();
    const unsubscribe = subscribeMovementEvents(target, consume);
    const event = { movement: "squat" as const, phase: "completed" as const, confidence: 0.94, occurredAtMs: 42 };

    publishMovementEvent(target, event);
    expect(consume).toHaveBeenCalledWith(event);

    unsubscribe();
    publishMovementEvent(target, { ...event, occurredAtMs: 43 });
    expect(consume).toHaveBeenCalledTimes(1);
  });

  it("ignores malformed external events", () => {
    const target = new EventTarget();
    const consume = vi.fn();
    subscribeMovementEvents(target, consume);
    target.dispatchEvent(new CustomEvent("ai-fitness-escape:movement", { detail: { movement: "unknown" } }));
    expect(consume).not.toHaveBeenCalled();
  });
});
