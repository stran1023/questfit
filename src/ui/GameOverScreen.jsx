import React from "react";

export default function GameOverScreen({ score, onPlayAgain }) {
  return <main className="app-shell game-over-screen">
    <div className="caught-orbit" aria-hidden="true"><span>◆</span></div>
    <p className="eyebrow danger-text">Run complete · Caught</p>
    <h1>The monster <span>got you.</span></h1>
    <div className="score-card">
      <p className="eyebrow">Final score</p>
      <strong>{String(score).padStart(5,"0")}</strong>
      <p>Every clear kept you one step ahead.</p>
    </div>
    <button type="button" onClick={onPlayAgain}>Play again →</button>
    <p className="replay-note">Replay starts with fresh calibration for your current camera position.</p>
  </main>;
}
