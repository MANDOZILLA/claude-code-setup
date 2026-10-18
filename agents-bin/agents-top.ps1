# Live viewer for external subagent runs. Up/Down select, Enter = tail, Esc/Backspace = back, q = quit.
$root = Join-Path $env:USERPROFILE '.agents\runs'
$sel = 0; $detail = $null

function Get-Runs {
    if (-not (Test-Path $root)) { return @() }
    Get-ChildItem $root -Directory | Sort-Object Name -Descending | Select-Object -First 25 | ForEach-Object {
        $m = Get-Content (Join-Path $_.FullName 'meta.json') -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($m) {
            $log = Join-Path $_.FullName 'events.jsonl'
            if ($m.status -eq 'running' -and (Test-Path $log) -and ((Get-Date) - (Get-Item $log).LastWriteTime).TotalMinutes -gt 15) { $m.status = 'orphan' }
            $m | Add-Member dir $_.FullName -PassThru
        }
    }
}

function Get-Tail($dir) {
    $log = Join-Path $dir 'events.jsonl'
    if (-not (Test-Path $log)) { return @() }
    Get-Content $log -Tail 40 | ForEach-Object {
        try { $e = $_ | ConvertFrom-Json } catch { return $_ }
        switch -Wildcard ($e.type) {
            'text'   { "> $($e.part.text)" }
            'tool*'  { "[tool] $($e.part.tool)" }
            'error'  { "[error] $($e.error | ConvertTo-Json -Compress)" }
            'item.*' { if ($e.item.type -eq 'agent_message') { "> $($e.item.text)" } elseif ($e.item.command) { "[cmd] $($e.item.command)" } }
        }
    } | Where-Object { $_ }
}

[Console]::CursorVisible = $false
try {
    while ($true) {
        $runs = @(Get-Runs)
        if ($sel -ge $runs.Count) { $sel = [Math]::Max(0, $runs.Count - 1) }
        Clear-Host
        $n = @($runs | Where-Object status -eq 'running').Count
        Write-Host "agents-top: $n running / $($runs.Count) recent   (up/down, Enter, Esc, q)" -ForegroundColor Cyan
        if ($detail) {
            $r = $runs | Where-Object id -eq $detail | Select-Object -First 1
            if ($r) {
                Write-Host "$($r.backend) $($r.model) [$($r.status)] $($r.title)" -ForegroundColor Yellow
                Get-Tail $r.dir | Select-Object -Last ([Console]::WindowHeight - 5) | ForEach-Object { Write-Host $_ }
            }
        } else {
            for ($i = 0; $i -lt $runs.Count; $i++) {
                $r = $runs[$i]
                $age = [Math]::Round(((Get-Date).ToUniversalTime() - [DateTimeOffset]::FromUnixTimeMilliseconds($r.startedAt).UtcDateTime).TotalSeconds)
                $color = switch ($r.status) { 'running' { 'Green' } 'failed' { 'Red' } 'orphan' { 'DarkYellow' } default { 'DarkGray' } }
                $mark = if ($i -eq $sel) { '>' } else { ' ' }
                Write-Host ("{0} {1,-8} {2,-8} {3,6}s  {4}" -f $mark, $r.status, $r.backend, $age, $r.title) -ForegroundColor $color
            }
        }
        $until = (Get-Date).AddSeconds(1.5)
        while ((Get-Date) -lt $until) {
            if ([Console]::KeyAvailable) {
                $k = [Console]::ReadKey($true)
                switch ($k.Key) {
                    'UpArrow'   { if (-not $detail -and $sel -gt 0) { $sel-- } }
                    'DownArrow' { if (-not $detail -and $sel -lt $runs.Count - 1) { $sel++ } }
                    'Enter'     { if ($runs.Count) { $detail = $runs[$sel].id } }
                    'Escape'    { $detail = $null }
                    'Backspace' { $detail = $null }
                    'Q'         { return }
                }
                break
            }
            Start-Sleep -Milliseconds 80
        }
    }
} finally { [Console]::CursorVisible = $true }
