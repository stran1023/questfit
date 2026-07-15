import React, { useRef, useEffect } from "react";

// GameScreen: hosts the canvas render loop and the (hidden) webcam
// video element that feeds the pose engine.

export default function GameScreen({ onGameOver }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // TODO: start webcam, init pose engine, start requestAnimationFrame loop
  }, []);

  return (
    <div className="game-screen">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={800} height={450} />
    </div>
  );
}
