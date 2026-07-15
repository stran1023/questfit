import React from "react";

// CalibrationScreen: guides the player through frame-check, jump sample,
// squat sample. Shows a live silhouette/framing guide.

export default function CalibrationScreen({ onCalibrationComplete }) {
  return (
    <div className="calibration-screen">
      <h2>Get ready</h2>
      <p>Stand where your whole body fits in the frame.</p>
      {/* TODO: live video preview + framing guide overlay */}
      {/* TODO: "jump when ready" / "squat when ready" prompts */}
    </div>
  );
}
