// renderEngine.js
// Canvas-based side-scroller renderer. Runs on requestAnimationFrame,
// decoupled from the pose-detection loop so rendering stays smooth
// regardless of detection speed.

export function initRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  return ctx;
}

export function renderFrame(ctx, state) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  // TODO: draw ground, player sprite, obstacles, monster, score/HUD.
}
