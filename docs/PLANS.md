# Plans

Use an execution plan for multi-session or cross-cutting work. One feature in `feature_list.json` and one plan step may be active at a time.

## Active Plan

- `docs/exec-plans/active/product-transformation.md` — migrate the verified prototype to the workout-to-adventure product while retaining reusable behavior.

## Plan Rules

Each active plan records objective, scope, dependencies, verification, risks, decisions, progress, and next action. Update it as evidence changes. Finished plans move to `docs/exec-plans/completed/`; deferred work belongs in `docs/exec-plans/tech-debt-tracker.md`, not in unrelated feature notes.

`feature_list.json` is the machine-readable execution state. Product docs describe behavior; plans describe how and why work is sequenced. Do not maintain a duplicate checklist in a second task document.
