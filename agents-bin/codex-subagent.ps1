[CmdletBinding()]
param(
    [Parameter(Mandatory, ValueFromRemainingArguments)]
    [string[]]$Prompt
)

$codex = Get-Command codex -ErrorAction SilentlyContinue
if ($null -eq $codex) {
    Write-Error 'Codex CLI is not installed or is not on PATH.'
    exit 127
}

. (Join-Path $PSScriptRoot 'agent-registry.ps1')

$task = $Prompt -join ' '
$run = New-AgentRun -Backend 'codex' -Model 'codex' -Tier 'n/a' -Task $task
Write-Host "[run $($run.Id)]"
$eventsPath = Join-Path $run.Dir 'events.jsonl'
$lastPath = Join-Path $run.Dir 'last-message.txt'
$errorMsg = $null

& $codex.Source exec --json --skip-git-repo-check -o $lastPath -- $task 2>&1 |
    ForEach-Object {
        $line = "$_"
        Add-Content -Path $eventsPath -Value $line -Encoding utf8
        try {
            $ev = $line | ConvertFrom-Json -ErrorAction Stop
            if ($ev.type -eq 'error' -or $ev.type -eq 'turn.failed') { $errorMsg = $line }
        } catch { }
    }
$code = $LASTEXITCODE

$summary = if (Test-Path $lastPath) { Get-Content -Raw $lastPath } else { '' }
Complete-AgentRun -Run $run -ExitCode $code -Summary $summary -Error $errorMsg
if ($errorMsg) { Write-Error "Codex error: $errorMsg" }
$summary
exit $code
