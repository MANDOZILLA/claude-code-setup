export type RunView = {
  id: string
  backend: string
  model: string
  title: string
  status: 'running' | 'done' | 'failed' | 'orphan'
  startedAt: number
  endedAt?: number
}

declare module 'claude-code' {
  interface PluginState {
    'agent-monitor': {
      runs: RunView[]
      selected: string | null
      tail: string[]
    }
  }
}
