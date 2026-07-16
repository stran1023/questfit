export const OBSTACLE_TYPES = { JUMP_OVER: "jump-over", SLIDE_UNDER: "slide-under" };

export function createObstacle(random = Math.random) {
  return { id: `${Date.now()}-${random()}`, type: random() < .5 ? OBSTACLE_TYPES.JUMP_OVER : OBSTACLE_TYPES.SLIDE_UNDER, x: 1020, resolved: false };
}

export function spawnObstacle(existingObstacles, gameSpeed, random = Math.random) {
  return [...existingObstacles, createObstacle(random)];
}
