import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CalibrationScreen from "./ui/CalibrationScreen.jsx";
import GameScreen from "./ui/GameScreen.jsx";
import GameOverScreen from "./ui/GameOverScreen.jsx";
import "./styles.css";

function App() {
  const [phase, setPhase] = useState("calibrating"); // calibrating | running | game-over
  const [score, setScore] = useState(0);
  const [thresholds, setThresholds] = useState(null);

  if (phase === "calibrating") {
    return <CalibrationScreen onCalibrationComplete={(values) => { setThresholds(values); setPhase("running"); }} />;
  }
  if (phase === "running") {
    return (
      <GameScreen
        thresholds={thresholds}
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
