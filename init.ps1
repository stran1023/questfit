$ErrorActionPreference = 'Stop'

Write-Host '=== Harness Initialization ==='

Write-Host '=== npm install ==='
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '=== npm run verify ==='
npm run verify
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '=== Verification Complete ==='
Write-Host 'Read lifecycle state and the active plan, work only on the in-progress feature, then record verification evidence.'
