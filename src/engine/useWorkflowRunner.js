import { useCallback, useEffect, useRef, useState } from 'react'
import { runWorkflow } from './runner'

const emptyProgress = { runningIndex: null, results: {} }

export function useWorkflowRunner({ onEvent } = {}) {
  const [running, setRunning] = useState(false)
  const [flash, setFlash] = useState(null)
  const [progress, setProgress] = useState(emptyProgress)
  const flashTimer = useRef(null)
  const subRef = useRef(null)

  const armFlash = useCallback((kind) => {
    setFlash(kind)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => {
      setFlash(null)
      setProgress(emptyProgress)
    }, 500)
  }, [])

  const run = useCallback((workflow) => {
    if (subRef.current) return
    setRunning(true)
    setProgress({ runningIndex: null, results: {} })
    let failed = false
    subRef.current = runWorkflow(workflow).subscribe({
      next: (event) => {
        if (event.type === 'step_started') {
          setProgress((p) => ({ ...p, runningIndex: event.index }))
        } else if (event.type === 'step_succeeded') {
          setProgress((p) => ({ runningIndex: p.runningIndex, results: { ...p.results, [event.stepId]: 'success' } }))
        } else if (event.type === 'step_failed') {
          failed = true
          setProgress((p) => ({ runningIndex: p.runningIndex, results: { ...p.results, [event.stepId]: 'error' } }))
        }
        onEvent && onEvent(event)
      },
      complete: () => {
        subRef.current = null
        setRunning(false)
        setProgress((p) => ({ ...p, runningIndex: null }))
        armFlash(failed ? 'error' : 'success')
      },
      error: () => {
        subRef.current = null
        setRunning(false)
        setProgress((p) => ({ ...p, runningIndex: null }))
        armFlash('error')
      },
    })
  }, [onEvent, armFlash])

  useEffect(() => () => {
    if (subRef.current) subRef.current.unsubscribe()
    if (flashTimer.current) clearTimeout(flashTimer.current)
  }, [])

  return { run, running, flash, progress }
}
