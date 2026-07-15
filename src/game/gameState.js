// gameState.js
// Central game state. Data flow is one-directional: pose -> action ->
// state (here) -> render. UI components should never mutate state
// directly; route changes through the functions below.

const MAX_MISSES = 3;

export function createGameState() {
  return {
    phase: "calibrating", // 'calibrating' | 'running' | 'game-over'
    score: 0,
    misses: 0,
    obstacles: [],
    playerAction: "none",
  };
}

export function applyPlayerAction(state, action) {
  state.playerAction = action;
  return state;
}

export function registerMiss(state) {
  state.misses += 1;
  if (state.misses >= MAX_MISSES) {
    state.phase = "game-over";
  }
  return state;
}

export function registerScore(state, points) {
  state.score += points;
  return state;
}
