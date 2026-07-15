import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CalibrationScreen from "./ui/CalibrationScreen.jsx";
import GameScreen from "./ui/GameScreen.jsx";
import GameOverScreen from "./ui/GameOverScreen.jsx";

function App() {
  const [phase, setPhase] = useState("calibrating"); // calibrating | running | game-over
  const [score, setScore] = useState(0);

  if (phase === "calibrating") {
    return <CalibrationScreen onCalibrationComplete={() => setPhase("running")} />;
  }
  if (phase === "running") {
    return (
      <GameScreen
        onGameOver={(finalScore) => {
          setScore(finalScore);
          setPhase("game-over");
        }}
      />
    );
  }
  return <GameOverScreen score={score} onPlayAgain={() => setPhase("calibrating")} />;
}

createRoot(document.getElementById("root")).render(<App />);
