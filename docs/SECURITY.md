# Security and Safety

## Secrets and Providers

- Keep Supabase service credentials and AI provider keys server-side and outside version control.
- Browser code may receive only explicitly public configuration such as a Supabase anon key protected by RLS.
- Use documented environment-variable names and provide redacted examples; never print secrets in logs, screenshots, fixtures, or handoff files.
- AI calls must pass through bounded server adapters with timeouts, output limits, schema validation, and safe error mapping.

## Untrusted Data

Treat user input, AI output, URL parameters, database rows, and external assets as untrusted. Validate at ingress, encode at render, and avoid executing model-produced code, markup, queries, or commands. Prompts must clearly separate instructions from user-provided data.

## Auth and Data

- Enforce authorization with Supabase RLS on every user-owned table; UI hiding is not authorization.
- Use least-privilege policies and test cross-user read/write denial.
- Derive XP, streaks, completion, and leaderboard facts from server-accepted session data where trust matters.
- Guest-to-account migration must be explicit, idempotent, and unable to overwrite another profile.
- Define retention before storing generated plans or coach text; collect only what the MVP uses.

## Webcam and Physical Safety

Webcam frames, raw landmarks, and calibration samples stay in memory on-device and are never uploaded. Only validated derived thresholds may be stored locally or synchronized to the signed-in user's RLS-protected calibration profile. Show a local-processing notice, release the camera on navigation, and provide clear permission and device-loss recovery. Before automatic calibration, remind users to clear floor and overhead space. Do not present coaching as medical advice.

## External and Destructive Actions

Agents must not deploy, modify production data, rotate credentials, apply remote database migrations, or run destructive cleanup without explicit user authorization. New dependencies require active-plan justification and audit review.

## Hackathon Safety Boundary

- A short deadline does not relax webcam locality, secret handling, schema validation, lifecycle cleanup, or RLS requirements for enabled remote data.
- Use synthetic demo accounts and non-sensitive profile values during public demonstrations.
- If RLS and cross-user denial evidence are incomplete, disable remote writes and demonstrate guest-local persistence instead of presenting Supabase as secure production storage.
- Do not log profile health information, movement limitations, raw provider prompts containing personal data, camera frames, or landmarks.
