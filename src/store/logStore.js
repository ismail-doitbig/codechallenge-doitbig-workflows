import { create } from 'zustand'
import { findActionClass } from '../domain/registry'

export const useLogStore = create((set, get) => ({
  entries: [],
  running: false,
  setRunning: (running) => set({ running }),
  append: (event) => set({ entries: [...get().entries, formatEvent(event)] }),
  clear: () => set({ entries: [] }),
}))

export const formatEvent = (event) => {
  const time = new Date(event.ts).toLocaleTimeString()
  const cls = event.actionId ? findActionClass(event.actionId) : null
  const labelFor = (idx) => cls ? `${cls.label} #${idx + 1}` : `step #${idx + 1}`
  let level = 'info'
  let text = ''

  switch (event.type) {
    case 'workflow_started':
      text = `Workflow started (${event.total} step${event.total === 1 ? '' : 's'})`
      break
    case 'step_started':
      text = `→ ${labelFor(event.index)} running...`
      break
    case 'step_succeeded':
      level = 'success'
      text = `✓ ${labelFor(event.index)}: ${event.message}`
      break
    case 'step_failed':
      level = 'error'
      text = `✗ ${labelFor(event.index)}: ${event.message}`
      break
    case 'workflow_completed':
      level = event.ok ? 'success' : 'error'
      text = event.ok ? 'Workflow completed' : `Workflow aborted: ${event.message || ''}`
      break
    default:
      text = JSON.stringify(event)
  }
  return { id: `${event.runId}-${event.ts}-${Math.random().toString(36).slice(2, 5)}`, time, level, text }
}
