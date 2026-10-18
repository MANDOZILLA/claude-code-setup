import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { RunView } from '../types'
import { RUNS_DIR, effectiveStatus, elapsed, parseMeta, statusText, tailLines } from './runs'

const PANE = 'agent-monitor'
const MAX_RUNS = 30
const runs = atom({ plugin: 'agent-monitor', key: 'runs' } as const, [] as RunView[])
const selected = atom({ plugin: 'agent-monitor', key: 'selected' } as const, null as string | null)
const tail = atom({ plugin: 'agent-monitor', key: 'tail' } as const, [] as string[])

const ICON: Record<RunView['status'], string> = { running: '●', done: '✓', failed: '✗', orphan: '?' }

const prev = new Map<string, RunView['status']>()

async function poll($: any) {
  const now = await $.clock.now()
  let names: string[] = []
  try {
    const entries = await $.fs.list(RUNS_DIR)
    names = entries.filter((e: any) => e.kind === 'directory').map((e: any) => e.name).sort().reverse().slice(0, MAX_RUNS)
  } catch {
    /* no runs dir yet */
  }
  const next: RunView[] = []
  for (const name of names) {
    let meta
    try {
      meta = parseMeta(await $.fs.read(`${RUNS_DIR}/${name}/meta.json`))
    } catch {
      continue
    }
    if (!meta) continue
    let last = meta.startedAt
    if (meta.status === 'running') {
      try {
        last = (await $.fs.stat(`${RUNS_DIR}/${name}/events.jsonl`)).mtimeMs
      } catch {
        /* keep startedAt */
      }
    }
    const status = effectiveStatus(meta.status, last, now)
    next.push({ ...meta, status })
    const before = prev.get(meta.id)
    if (before === 'running' && status !== 'running') {
      $.ui.toast(`${ICON[status]} ${meta.backend} ${status}: ${meta.title.slice(0, 50)}`)
    }
    prev.set(meta.id, status)
  }
  await update($, runs, () => next)
  $.ui.status(statusText(next))

  const sel = await read($, selected)
  if (sel) {
    try {
      const text = await $.fs.read(`${RUNS_DIR}/${sel}/events.jsonl`)
      await update($, tail, () => tailLines(text, 60))
    } catch {
      await update($, tail, () => ['(log unreadable or over 4 MiB)'])
    }
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'agents', description: 'Open the OpenCode/Codex subagent monitor pane' })
    void $.ui.open({ id: PANE, title: 'External agents' })
    $.clock.every(1500, () => void poll($).catch(() => {}))
    return next(e)
  })

  on('command.run', { command: 'agents' }, async $ => {
    await $.ui.open({ id: PANE, title: 'External agents', focus: true })
    return { text: 'Agents pane opened. Arrows walk the rows, Enter opens one.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, runs)
    const sel = await read($, selected)
    const now = await $.clock.now()
    const rows = Math.max(3, (e.viewport?.rows ?? 24) - 5)

    if (sel) {
      const run = list.find(r => r.id === sel)
      const lines = await read($, tail)
      return (
        <Box flexDirection="column">
          <Button
            key="back"
            label="← back"
            onPress={() => update($, selected, () => null)}
          />
          <Text bold>
            {run ? `${ICON[run.status]} ${run.backend} ${run.model}` : sel}
          </Text>
          <Text dimColor>{run?.title}</Text>
          {lines.length === 0 && <Text dimColor>No events yet.</Text>}
          {lines.slice(-rows).map(l => (
            <Text>{l}</Text>
          ))}
        </Box>
      )
    }

    const running = list.filter(r => r.status === 'running').length
    return (
      <Box flexDirection="column">
        <Text bold>
          {running} running · {list.length} recent
        </Text>
        {list.length === 0 && <Text dimColor>No runs yet. Delegate via opencode-subagent.ps1 / codex-subagent.ps1.</Text>}
        {list.slice(0, rows).map(r => (
          <Button
            key={r.id}
            plain
            onPress={() => {
              void update($, tail, () => [])
              void update($, selected, () => r.id)
            }}
          >
            {ICON[r.status]} {r.backend.padEnd(8)} {elapsed((r.endedAt ?? now) - r.startedAt).padStart(7)}{' '}
            <Text dimColor>
              {r.model.replace('opencode/', '')} · {r.title}
            </Text>
          </Button>
        ))}
      </Box>
    )
  })
}
