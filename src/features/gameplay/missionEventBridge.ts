import { movementEventSchema, type MovementEvent } from "@/contracts";

export const missionMovementEventName = "ai-fitness-escape:movement";

export function publishMovementEvent(target: EventTarget, event: MovementEvent) {
  const detail = movementEventSchema.parse(event);
  target.dispatchEvent(new CustomEvent(missionMovementEventName, { detail }));
}

export function subscribeMovementEvents(
  target: EventTarget,
  consume: (event: MovementEvent) => void,
) {
  const listener = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const parsed = movementEventSchema.safeParse(event.detail);
    if (parsed.success) consume(parsed.data);
  };
  target.addEventListener(missionMovementEventName, listener);
  return () => target.removeEventListener(missionMovementEventName, listener);
}
