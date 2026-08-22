#requires -Version 5.1
<#
  Lance Karma (tests unitaires + coverage) sur front-portfolio en mode headless,
  puis delegue le resume a .github/scripts/test-summary.mjs (source unique du parsing).
#>

$ErrorActionPreference = 'Continue'
$front = Join-Path $PSScriptRoot 'front-portfolio'

Push-Location $front
try {
    & npx ng test --no-watch --code-coverage --browsers=ChromeHeadless 2>&1 |
        Tee-Object -FilePath (Join-Path $front 'karma.log')
    $testExit = $LASTEXITCODE
}
finally {
    Pop-Location
}

& node (Join-Path $PSScriptRoot '.github/scripts/test-summary.mjs') `
    (Join-Path $front 'karma.log') `
    (Join-Path $front 'coverage/front-portfolio/coverage-summary.json')

exit $testExit
