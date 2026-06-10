#requires -Version 5.1
<#
  Lance Karma (tests unitaires + coverage) sur front-portfolio en mode headless,
  puis affiche un resume : nombre de tests reussis X/Y et pourcentage de coverage.
#>

$ErrorActionPreference = 'Continue'
$front = Join-Path $PSScriptRoot 'front-portfolio'

Push-Location $front
try {
    # --no-watch : single run / --code-coverage : reporters html + text-summary (cf angular.json)
    & npx ng test --no-watch --code-coverage --browsers=ChromeHeadless 2>&1 |
        Tee-Object -Variable runOutput
    $testExit = $LASTEXITCODE
}
finally {
    Pop-Location
}

$log = ($runOutput | Out-String)

# --- Tests : "Executed X of Y (N FAILED)" (derniere occurrence) ---
$passed = $null; $total = $null; $failed = 0
$execMatches = [regex]::Matches($log, 'Executed\s+(\d+)\s+of\s+(\d+)')
if ($execMatches.Count -gt 0) {
    $m = $execMatches[$execMatches.Count - 1]
    $executed = [int]$m.Groups[1].Value
    $total = [int]$m.Groups[2].Value
    $failMatches = [regex]::Matches($log, '\((\d+)\s+FAILED\)')
    if ($failMatches.Count -gt 0) {
        $failed = [int]$failMatches[$failMatches.Count - 1].Groups[1].Value
    }
    $passed = $executed - $failed
}

# --- Coverage : bloc istanbul text-summary ---
function Get-Metric([string]$name) {
    $mm = [regex]::Match($log, "$name\s*:\s*([\d.]+)%")
    if ($mm.Success) { return $mm.Groups[1].Value } else { return $null }
}
$stmts = Get-Metric 'Statements'
$branch = Get-Metric 'Branches'
$funcs = Get-Metric 'Functions'
$lines = Get-Metric 'Lines'

$sep = ('=' * 52)
Write-Host ''
Write-Host $sep -ForegroundColor DarkGray
Write-Host '  RESUME' -ForegroundColor Cyan
Write-Host $sep -ForegroundColor DarkGray

if ($null -ne $total) {
    $color = if ($failed -eq 0) { 'Green' } else { 'Red' }
    Write-Host ("  Tests reussis : {0}/{1}" -f $passed, $total) -ForegroundColor $color
    if ($failed -gt 0) { Write-Host ("  Tests echoues : {0}" -f $failed) -ForegroundColor Red }
}
else {
    Write-Host '  Tests reussis : indetermine (sortie Karma non reconnue)' -ForegroundColor Yellow
}

if ($null -ne $lines) {
    Write-Host ("  Coverage      : {0}% (lignes)" -f $lines) -ForegroundColor Green
    Write-Host ("                  stmts {0}% | branch {1}% | funcs {2}%" -f $stmts, $branch, $funcs) -ForegroundColor DarkGray
}
else {
    Write-Host '  Coverage      : indetermine (resume istanbul absent)' -ForegroundColor Yellow
}
Write-Host $sep -ForegroundColor DarkGray
Write-Host ''

if ($null -ne $total -and $failed -gt 0) { exit 1 }
exit $testExit
