import { checkCollision } from "./collision.js";
import { createObstacle } from "./obstacleSpawner.js";

export const MAX_MISSES = 3;
const GROUND_Y = 410;

export function createGameState() {
  return {
    phase: "running",
    score: 0,
    misses: 0,
    speed: 285,
    elapsed: 0,
    spawnIn: 1.6,
    obstacles: [],
    player: {
      x: 235,
      y: GROUND_Y,
      velocityY: 0,
      action: "none",
      grounded: true,
      slideRemaining: 0,
      jumpArmed: true,
      squatArmed: true,
    },
    monster: { x: 58, targetX: 58 },
  };
}

export function applyPlayerAction(state, action) {
  const player = state.player;
  if (action !== "jump") player.jumpArmed = true;
  if (action !== "squat") player.squatArmed = true;

  if (action === "jump" && player.jumpArmed && player.grounded) {
    player.jumpArmed = false;
    state.player.velocityY = -650;
    state.player.grounded = false;
  }
  if (action === "squat" && player.squatArmed && player.grounded) {
    player.squatArmed = false;
    player.slideRemaining = .65;
  }
  return state;
}

export function registerMiss(state) {
  state.misses = Math.min(MAX_MISSES, state.misses + 1);
  state.monster.targetX = 58 + state.misses * 45;
  if (state.misses >= MAX_MISSES) state.phase = "game-over";
  return state;
}

export function registerScore(state, points) {
  state.score += points;
  return state;
}

export function updateGameState(state, deltaSeconds, action, random = Math.random) {
  if (state.phase !== "running") return state;
  const dt = Math.min(deltaSeconds, .05);
  state.elapsed += dt;
  state.speed = Math.min(430, 285 + state.elapsed * 2.2);
  applyPlayerAction(state, action);

  state.player.slideRemaining = Math.max(0, state.player.slideRemaining - dt);

  if (!state.player.grounded) {
    state.player.velocityY += 1550 * dt;
    state.player.y += state.player.velocityY * dt;
    if (state.player.y >= GROUND_Y) {
      state.player.y = GROUND_Y;
      state.player.velocityY = 0;
      state.player.grounded = true;
    }
  }

  state.player.action = !state.player.grounded
    ? "jump"
    : state.player.slideRemaining > 0
      ? "squat"
      : "none";

  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    state.obstacles.push(createObstacle(random));
    state.spawnIn = Math.max(1.25, 2.25 - state.elapsed * .008);
  }

  for (const obstacle of state.obstacles) {
    obstacle.x -= state.speed * dt;
    if (!obstacle.resolved && obstacle.x <= state.player.x + 34) {
      obstacle.resolved = true;
      if (checkCollision(obstacle, state.player.action, state.player.grounded)) registerScore(state, 100);
      else registerMiss(state);
    }
  }
  state.obstacles = state.obstacles.filter((obstacle) => obstacle.x > -100);
  state.monster.x += (state.monster.targetX - state.monster.x) * Math.min(1, dt * 4);
  state.score += dt * 10;
  return state;
}
