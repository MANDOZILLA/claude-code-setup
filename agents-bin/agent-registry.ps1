# Shared run registry for external subagents (OpenCode, Codex).
# Each run lives in ~/.agents/runs/<id>/ : meta.json, events.jsonl, summary.txt
# Viewers (Claude Code `agent-monitor` mod, agents-top.ps1) read these files.

$script:RunsRoot = Join-Path $env:USERPROFILE '.agents\runs'

function Write-RunMeta {
    param([string]$Dir, [hashtable]$Meta)
    $tmp = Join-Path $Dir 'meta.json.tmp'
    $Meta | ConvertTo-Json -Depth 4 | Set-Content -Path $tmp -Encoding utf8
    Move-Item -Path $tmp -Destination (Join-Path $Dir 'meta.json') -Force
}

function New-AgentRun {
    param([string]$Backend, [string]$Model, [string]$Tier, [string]$Task)
    $id = '{0}-{1}' -f (Get-Date -Format 'yyyyMMdd-HHmmss'), ([guid]::NewGuid().ToString('N').Substring(0, 4))
    $dir = Join-Path $script:RunsRoot $id
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $title = ($Task -replace '\s+', ' ').Trim()
    if ($title.Length -gt 70) { $title = $title.Substring(0, 70) + '...' }
    $meta = [ordered]@{
        id        = $id
        backend   = $Backend
        model     = $Model
        tier      = $Tier
        title     = $title
        pid       = $PID
        cwd       = (Get-Location).Path
        startedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
        status    = 'running'
    }
    Write-RunMeta -Dir $dir -Meta $meta
    New-Item -ItemType File -Force -Path (Join-Path $dir 'events.jsonl') | Out-Null
    return [pscustomobject]@{ Id = $id; Dir = $dir; Meta = $meta }
}

function Complete-AgentRun {
    param($Run, [int]$ExitCode, [string]$Summary, [string]$Error)
    $Run.Meta.status = if ($ExitCode -eq 0 -and -not $Error) { 'done' } else { 'failed' }
    $Run.Meta.exitCode = $ExitCode
    $Run.Meta.endedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    if ($Error) { $Run.Meta.error = $Error }
    if ($Summary) { Set-Content -Path (Join-Path $Run.Dir 'summary.txt') -Value $Summary -Encoding utf8 }
    Write-RunMeta -Dir $Run.Dir -Meta $Run.Meta
}
