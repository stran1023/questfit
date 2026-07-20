# Technical Debt Tracker

| ID | Debt | Impact | Trigger to resolve | Status |
| --- | --- | --- | --- | --- |
| TD-002 | npm audit reports two moderate vulnerabilities after the Next.js migration | dependency/security risk | review package paths during the next dependency change; avoid forced breaking upgrades without review | open |
| TD-003 | Small JavaScript pose/calibration foundations remain behind typed adapters | weaker static guarantees inside those foundations | migrate incrementally without discarding core regression coverage | open |
| TD-004 | Browser-control surface was unavailable during foundation verification | delayed visual evidence | Chrome desktop/narrow planning evidence captured 2026-07-17 | resolved |
| TD-005 | A live physical camera-loss/retry demonstration is outside the guest happy-path hackathon walkthrough | movement/calibration/counting passed physically; automated track-ended, denied-permission, progress-preservation, retry, and cleanup checks pass | run the physical device-loss scenario during post-demo robustness hardening | deferred |
