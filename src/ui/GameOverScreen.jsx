import React from "react";

export default function GameOverScreen({ score, onPlayAgain }) {
  return (
    <div className="game-over-screen">
      <h2>Caught!</h2>
      <p>Score: {score}</p>
      <button onClick={onPlayAgain}>Play again</button>
    </div>
  );
}
