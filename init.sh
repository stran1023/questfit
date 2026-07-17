#!/bin/bash
set -e

echo "=== Harness Initialization ==="

echo "=== npm install ==="
npm install

echo "=== npm run verify ==="
npm run verify

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read progress.md, session-handoff.md, and feature_list.json"
echo "2. Read docs/ARCHITECTURE.md and the active plan in docs/PLANS.md"
echo "3. Work only on the feature marked in_progress"
echo "4. Re-run this verification and record evidence before claiming done"
