# Contributing to QuestFit

Thank you for helping make fitness more playful, private, and accessible. Contributions to product code, movement fixtures, tests, documentation, accessibility, and visual polish are welcome.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

1. Search [existing issues](https://github.com/stran1023/questfit/issues) before opening a new one.
2. For substantial features or architecture changes, open a feature request first so scope and ownership can be agreed upon.
3. Do not include personal health information, webcam captures, raw pose landmarks, credentials, or private provider prompts in issues, fixtures, commits, or screenshots.

## Development Setup

```bash
git clone https://github.com/stran1023/questfit.git
cd questfit
./init.sh
npm run dev
```

PowerShell users can run `./init.ps1` instead of `./init.sh`.

## Pull Request Workflow

1. Fork the repository and create a focused branch from `main`.
2. Keep each pull request limited to one coherent change.
3. Preserve the architecture boundaries in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
4. Add or update tests for observable behavior.
5. Update user-facing and architecture documentation when behavior or ownership changes.
6. Run the complete verification gate:

   ```bash
   npm run verify
   ```

7. Open a pull request using the repository template and describe the behavior, evidence, risks, and screenshots when presentation changes.

## Engineering Expectations

- React owns application UI and navigation; Phaser owns world rendering; MediaPipe inference runs independently.
- Treat AI output, browser storage, network payloads, and user input as untrusted until validated.
- Keep authoritative scoring, XP, accuracy, and recommendations deterministic.
- Never upload or persist webcam frames, calibration images, or raw pose landmarks.
- UI code should call domain actions rather than mutate mission or persistence state directly.
- New movements require registry, calibration/setup, detection, gameplay, accessibility, fixture, and browser evidence.
- Keep fallback behavior honest; do not imply an external provider or remote feature is active without evidence.
- Preserve keyboard access, reduced-motion behavior, readable status text, and responsive layouts.

## Reporting Bugs and Proposing Features

Use the repository's structured [bug report](https://github.com/stran1023/questfit/issues/new?template=bug_report.yml) or [feature request](https://github.com/stran1023/questfit/issues/new?template=feature_request.yml) form.

For a security or privacy concern, do not publish sensitive reproduction data. Open a minimal issue requesting a private contact channel without including vulnerability, identity, webcam, or health details.

## Contributor Recognition

Accepted contributors are recorded in [CONTRIBUTORS.md](CONTRIBUTORS.md). Add your preferred display name and GitHub profile to that file in your first accepted pull request.
