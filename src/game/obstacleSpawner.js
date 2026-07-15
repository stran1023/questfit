// obstacleSpawner.js
// Spawns obstacles at an interval that shortens as speed increases.
// Obstacle types map 1:1 to the two supported exercises.

export const OBSTACLE_TYPES = {
  JUMP_OVER: "jump-over", // cleared by a jump
  SLIDE_UNDER: "slide-under", // cleared by a squat
};

export function spawnObstacle(existingObstacles, gameSpeed) {
  const type = Math.random() < 0.5 ? OBSTACLE_TYPES.JUMP_OVER : OBSTACLE_TYPES.SLIDE_UNDER;
  return [...existingObstacles, { type, x: 0, cleared: false }];
}
