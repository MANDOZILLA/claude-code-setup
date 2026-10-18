[CmdletBinding()]
param(
    [ValidateSet('fast', 'standard', 'strong')]
    [string]$Tier = 'standard',

    [Parameter(Mandatory, ValueFromRemainingArguments)]
    [string[]]$Prompt
)

$opencode = Get-Command opencode -ErrorAction SilentlyContinue
if ($null -eq $opencode) {
    Write-Error 'OpenCode CLI is not installed or is not on PATH. Install it with: npm install -g opencode-ai'
    exit 127
}

if ([string]::IsNullOrWhiteSpace($env:ARTIFICIAL_ANALYSIS_API_KEY)) {
    Write-Error 'ARTIFICIAL_ANALYSIS_API_KEY is required. Set it in your user environment; do not add it to a config file.'
    exit 78
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
    Write-Error 'Python is required for the Artificial Analysis model selector.'
    exit 127
}

. (Join-Path $PSScriptRoot 'agent-registry.ps1')

$selector = Join-Path $PSScriptRoot 'resolve-opencode-model.py'
$task = $Prompt -join ' '
$selectionJson = & $python.Source $selector --task $task --workload $Tier
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

try {
    $selection = $selectionJson | ConvertFrom-Json -ErrorAction Stop
} catch {
    Write-Error "Artificial Analysis selector returned invalid JSON: $($_.Exception.Message)"
    exit 70
}

Write-Host "[Artificial Analysis: $($selection.task_class); selected $($selection.model); $($selection.reason)]"

$run = New-AgentRun -Backend 'opencode' -Model $selection.model -Tier $Tier -Task $task
Write-Host "[run $($run.Id)]"
$eventsPath = Join-Path $run.Dir 'events.jsonl'
$text = [System.Text.StringBuilder]::new()
$errorMsg = $null

& $opencode.Source run --format json --model $selection.model --agent external-routed --auto --title $run.Meta.title -- $task 2>&1 |
    ForEach-Object {
        $line = "$_"
        Add-Content -Path $eventsPath -Value $line -Encoding utf8
        try {
            $ev = $line | ConvertFrom-Json -ErrorAction Stop
            if ($ev.type -eq 'text' -and $ev.part.text) { [void]$text.Append($ev.part.text) }
            elseif ($ev.type -eq 'error') { $errorMsg = ($ev.error | ConvertTo-Json -Compress -Depth 4) }
        } catch { }
    }
$code = $LASTEXITCODE

Complete-AgentRun -Run $run -ExitCode $code -Summary $text.ToString() -Error $errorMsg
if ($errorMsg) { Write-Error "OpenCode error: $errorMsg" }
$text.ToString()
if ($code -eq 0 -and $errorMsg) { exit 1 }
exit $code
