#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  const data = parseInput(raw);
  process.stdout.write(renderLine(data));
  writeCache(data);
});

function parseInput(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

// Matches the warn/critical thresholds from the retired ccusage-based
// usage_guard.py hook, so color bands mean the same thing everywhere.
const WARN_PCT = 70;
const CRITICAL_PCT = 85;

function colorFor(pct) {
  if (pct >= CRITICAL_PCT) return RED;
  if (pct >= WARN_PCT) return YELLOW;
  return GREEN;
}

function bar(pct, width) {
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// Also guards against the known epoch-leak bug (used_percentage briefly
// showing a raw resets_at timestamp instead of 0/null) since a real
// percentage can never exceed 100.
function isValidPct(pct) {
  return typeof pct === 'number' && Number.isFinite(pct) && pct >= 0 && pct <= 100;
}

function fiveHourSegment(pct) {
  if (!isValidPct(pct)) return `${DIM}5h --${RESET}`;
  const c = colorFor(pct);
  return `${c}5h [${bar(pct, 10)}] ${pct.toFixed(0)}%${RESET}`;
}

function sevenDaySegment(pct) {
  if (!isValidPct(pct)) return `${DIM}7d --${RESET}`;
  return `${colorFor(pct)}7d ${pct.toFixed(0)}%${RESET}`;
}

function renderLine(data) {
  const rl = data && data.rate_limits;
  if (!rl) return `${DIM}usage: n/a${RESET}`;
  const five = rl.five_hour ? rl.five_hour.used_percentage : undefined;
  const seven = rl.seven_day ? rl.seven_day.used_percentage : undefined;
  return `${fiveHourSegment(five)}  ${DIM}·${RESET}  ${sevenDaySegment(seven)}`;
}

// Hooks (e.g. usage_guard.py) can't see the statusLine JSON payload
// directly, so this line renderer doubles as the write side of a small
// cache the UserPromptSubmit hook reads instead of shelling out to ccusage.
const CACHE_DIR = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'claude-usage-guard');
const CACHE_PATH = path.join(CACHE_DIR, 'live.json');

function writeCache(data) {
  try {
    const rl = data && data.rate_limits;
    const five = rl && rl.five_hour ? rl.five_hour.used_percentage : undefined;
    if (!isValidPct(five)) return; // don't overwrite a good cached reading with garbage/missing data
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const payload = {
      five_hour_pct: five,
      five_hour_resets_at: rl.five_hour.resets_at,
      seven_day_pct: isValidPct(rl.seven_day && rl.seven_day.used_percentage) ? rl.seven_day.used_percentage : null,
      seven_day_resets_at: rl.seven_day ? rl.seven_day.resets_at : null,
      updated_at: Math.floor(Date.now() / 1000),
    };
    const tmpPath = CACHE_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(payload));
    fs.renameSync(tmpPath, CACHE_PATH);
  } catch {
    // best-effort — never let cache writing break the status line itself
  }
}
