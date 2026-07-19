# Hackathon Demo Runbook

## Demo Claim

AI Fitness Escape turns a personalized guest workout into a body-controlled Volcano Escape mission. Camera processing and derived movement thresholds remain local. The demo does not claim live accounts, cloud synchronization, or leaderboard support.

## Reference Setup

- Browser: Google Chrome 150.0.7871.127
- Primary viewport: 1440 × 900 or larger landscape laptop display
- Runtime: local or deployed Next.js application in guest-local mode
- Planning/coaching: deterministic fallback is acceptable and labeled honestly
- Voice: on by default
- Action sound: off by default due browser gesture policy; enable once on the mission screen before stepping away
- Observed pose inference: 16.9 ms average during the all-eleven physical check
- Observed Phaser cadence: under 25 ms average across 120 reduced-motion frames; normal reference cadence previously measured at 16.38 ms

## Preflight — 10 Minutes Before Judging

1. Use the documented Chrome profile and close other camera-heavy applications.
2. Confirm the laptop is plugged in, volume is audible, and browser zoom is 100%.
3. Clear a non-slip, well-lit area with full standing-body visibility and arm clearance.
4. Open the application and confirm the welcome screen shows one **Start as guest** action.
5. If using the short walkthrough, complete normal calibration once beforehand and leave its compatible derived thresholds saved. Do not edit browser storage.
6. Generate one mission, verify the illustrated volcano world loads, then return through normal navigation.
7. Keep a second Chrome tab closed but ready to open the application if the first tab is accidentally closed.

## Full First-Time Walkthrough — 4–6 Minutes

| Beat | Presenter action | What the judge should notice |
| --- | --- | --- |
| 1. Promise | Select **Start as guest** | No account or cloud setup blocks the experience. |
| 2. Personalize | Enter profile details and select **Save and continue** | The profile explains local persistence and non-medical use. |
| 3. Plan | Continue, choose goal/time/level, and generate the adventure | Preferences compile into a validated Volcano Escape briefing; provider mode remains honest. |
| 4. Prepare | Select **Prepare for mission**, step back, and follow automatic spoken/visible setup | No lock-framing or capture button is required; saved calibration skips recording but still confirms live full-body readiness. |
| 5. Launch | Stay in position through the spoken full-screen `3 · 2 · 1 · GO!`; the mission opens automatically | Energy rings and the gold `GO!` create the transition; there is no second launch button. Voice starts enabled and action sound remains an optional in-mission control. |
| 6. Play | Follow the spoken encounter, target, and final-count cues; return to neutral after each action | The hero mirrors each movement family, the active hazard recoils before the next approaches, embers/lava and tension copy escalate, and verified actions produce XP, combo energy, and portal progress. |
| 7. Escape | Complete the final objective | Transient hazards clear and the mission shows the exclusive **Volcano escaped** payoff. |
| 8. Results | Keep presenting while the completion celebration automatically opens results after 2.6 seconds | The completion ring, accuracy, XP, strongest movement, and next-mission guidance are factual; replay and new-plan actions are obvious. |
| 9. Replay | Select the next-adventure action and continue through preparation | Compatible saved calibration is reused; replay does not require new recording. |

## Short Saved-Setup Walkthrough — 2–3 Minutes

Use this version when judging time is limited. It is normal returning-guest behavior, not a bypass.

1. Open the application with the previously saved guest profile and compatible calibration.
2. Select **Continue adventure** and generate the mission.
3. Show the briefing, then continue through preparation; point out that saved movement setup avoids rerecording while the camera still verifies readiness.
4. Stay in frame for the automatic three-second launch, optionally enable sound once inside the mission, and complete the six standing objectives without repositioning the laptop.
5. Show the escape celebration and factual results.

## Suggested Narration

- “Your body is the controller; raw camera frames never leave this laptop.”
- “The planner proposes the workout, but validated contracts and deterministic rules decide what is playable.”
- “Each recognized move changes the game immediately—watch the encounter, combo, XP, and runner progress.”
- “The AI coach can phrase the recap, but it cannot rewrite the measured session facts.”
- “For the hackathon we chose a reliable guest-local journey; accounts and cloud history are deliberately outside this demo claim.”

## If Something Goes Wrong

- Camera blocked: allow camera permission, then use the visible retry action. Do not refresh to repair state.
- Framing correction: follow the spoken cue and keep head, hips, knees, and feet visible with enough lateral room for jumping jacks and punches.
- Tracking interruption: pause, reconnect or restore the camera, and retry; automated regression coverage verifies progress preservation.
- Planner unavailable: use the visible retry; deterministic fallback content keeps the mission playable.
- Sound silent: leave voice enabled. Action sound is optional and may require selecting **Sound off** once to change it to **Sound on**.

## Evidence Boundary

The all-eleven movement mission, factual 11/11 results, 16.9 ms inference, cleanup, desktop/narrow layout, reduced motion, all encounter transitions, and completion presentation have recorded evidence. A live physical camera-disconnect walkthrough and Supabase behavior remain deferred and must not be claimed during judging.
