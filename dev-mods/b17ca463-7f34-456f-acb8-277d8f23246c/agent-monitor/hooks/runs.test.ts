import { test, expect } from 'claude-code/testing'
import { counts, effectiveStatus, parseMeta, statusText, summarizeEvent } from './runs'

test('parseMeta tolerates BOM and junk', () => {
  expect(parseMeta('\uFEFF{"id":"a","backend":"codex","status":"done"}')?.backend).toBe('codex')
  expect(parseMeta('nope')).toBeNull()
})

test('stale running run becomes orphan', () => {
  expect(effectiveStatus('running', 0, 20 * 60 * 1000)).toBe('orphan')
  expect(effectiveStatus('running', 0, 1000)).toBe('running')
  expect(effectiveStatus('done', 0, 99e9)).toBe('done')
})

test('status text counts by backend', () => {
  const r = (backend: string, status: any) => ({ id: backend + status, backend, model: '', title: '', status, startedAt: 0 })
  const runs = [r('opencode', 'running'), r('opencode', 'running'), r('codex', 'running'), r('codex', 'done')]
  expect(counts(runs)).toEqual({ total: 3, oc: 2, cx: 1 })
  expect(statusText(runs)).toBe('⚙ 3 running (2 oc · 1 cx)')
  expect(statusText([r('codex', 'done')])).toBeUndefined()
})

test('summarizeEvent', () => {
  expect(summarizeEvent('{"type":"step_start"}')).toBeNull()
  expect(summarizeEvent('{"type":"text","part":{"text":"hi"}}')).toBe('» hi')
})
