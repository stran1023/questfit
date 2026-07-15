// collision.js
// Checks whether the player's current action matches the obstacle type
// in range. Match = cleared + score. Mismatch = miss (see gameState.js).

import { OBSTACLE_TYPES } from "./obstacleSpawner.js";

export function checkCollision(obstacle, playerAction) {
  if (obstacle.type === OBSTACLE_TYPES.JUMP_OVER) return playerAction === "jump";
  if (obstacle.type === OBSTACLE_TYPES.SLIDE_UNDER) return playerAction === "squat";
  return false;
}
