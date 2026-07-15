$ErrorActionPreference = 'Stop'

Write-Host '=== Harness Initialization ==='

Write-Host '=== npm install ==='
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '=== npm run build ==='
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '=== Verification Complete ==='
Write-Host 'Read feature_list.json, select one dependency-ready feature, and update evidence before marking it passing.'
