import type { RunView } from '../types'

export const RUNS_DIR = 'C:/Users/whyhe/.agents/runs'
const ORPHAN_AFTER_MS = 15 * 60 * 1000

export function parseMeta(text: string): Omit<RunView, 'status'> & { status: string } | null {
  try {
    const m = JSON.parse(text.replace(/^\uFEFF/, ''))
    if (!m || typeof m.id !== 'string') return null
    return {
      id: m.id,
      backend: String(m.backend ?? '?'),
      model: String(m.model ?? '?'),
      title: String(m.title ?? ''),
      status: String(m.status ?? 'running'),
      startedAt: Number(m.startedAt ?? 0),
      endedAt: m.endedAt === undefined ? undefined : Number(m.endedAt),
    }
  } catch {
    return null
  }
}

/** A run still marked running whose log went quiet is an orphan (wrapper died). */
export function effectiveStatus(status: string, lastActivityMs: number, now: number): RunView['status'] {
  if (status === 'done' || status === 'failed') return status
  return now - lastActivityMs > ORPHAN_AFTER_MS ? 'orphan' : 'running'
}

export function counts(runs: RunView[]) {
  const running = runs.filter(r => r.status === 'running')
  return {
    total: running.length,
    oc: running.filter(r => r.backend === 'opencode').length,
    cx: running.filter(r => r.backend === 'codex').length,
  }
}

export function statusText(runs: RunView[]): string | undefined {
  const c = counts(runs)
  return c.total === 0 ? undefined : `⚙ ${c.total} running (${c.oc} oc · ${c.cx} cx)`
}

export function elapsed(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s`
}

const clip = (s: string, n = 160) => {
  const one = s.replace(/\s+/g, ' ').trim()
  return one.length > n ? one.slice(0, n) + '…' : one
}

/** One readable line per OpenCode / Codex JSONL event; null = not worth showing. */
export function summarizeEvent(line: string): string | null {
  let ev: any
  try {
    ev = JSON.parse(line)
  } catch {
    return line.trim() ? clip(line) : null
  }
  const t = ev.type as string
  if (t === 'step_start' || t === 'step_finish') return null
  if (t === 'text') return `» ${clip(ev.part?.text ?? '')}`
  if (t === 'tool_use' || t === 'tool') {
    const p = ev.part ?? {}
    return `🔧 ${p.tool ?? '?'} ${clip(JSON.stringify(p.state?.input ?? {}), 100)}`
  }
  if (t === 'error') return `✗ ${clip(JSON.stringify(ev.error ?? ev))}`
  if (t?.startsWith('item.')) {
    const it = ev.item ?? {}
    if (it.type === 'agent_message') return `» ${clip(it.text ?? '')}`
    if (it.type === 'command_execution') return `🔧 ${t === 'item.started' ? 'run' : 'ran'} ${clip(it.command ?? '', 120)}`
    if (it.type === 'reasoning') return `… ${clip(it.text ?? '', 100)}`
    return `· ${it.type ?? t}`
  }
  if (t === 'turn.failed') return `✗ ${clip(JSON.stringify(ev))}`
  if (t === 'thread.started' || t === 'turn.started' || t === 'turn.completed') return null
  return `· ${t ?? 'event'}`
}

export function tailLines(text: string, max: number): string[] {
  const out: string[] = []
  for (const line of text.split('\n')) {
    const s = summarizeEvent(line)
    if (s) out.push(s)
  }
  return out.slice(-max)
}
