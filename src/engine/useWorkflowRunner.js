import { useCallback, useEffect, useRef, useState } from 'react'
import { runWorkflow } from './runner'

export function useWorkflowRunner({ onEvent } = {}) {
  const [running, setRunning] = useState(false)
  const [flash, setFlash] = useState(null)
  const flashTimer = useRef(null)
  const subRef = useRef(null)

  const clearFlash = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 500)
  }, [])

  const run = useCallback((workflow) => {
    if (subRef.current) return
    setRunning(true)
    let failed = false
    subRef.current = runWorkflow(workflow).subscribe({
      next: (event) => {
        if (event.type === 'step_failed') failed = true
        onEvent && onEvent(event)
      },
      complete: () => {
        subRef.current = null
        setRunning(false)
        setFlash(failed ? 'error' : 'success')
        clearFlash()
      },
      error: () => {
        subRef.current = null
        setRunning(false)
        setFlash('error')
        clearFlash()
      },
    })
  }, [onEvent, clearFlash])

  useEffect(() => () => {
    if (subRef.current) subRef.current.unsubscribe()
    if (flashTimer.current) clearTimeout(flashTimer.current)
  }, [])

  return { run, running, flash }
}
