import { useEffect, useCallback } from 'react'
import { useBuilderStore, selectWorkflowJSON } from './store/builderStore'
import { useLogStore } from './store/logStore'
import { useWorkflowRunner } from './engine/useWorkflowRunner'
import { Workflow } from './domain/Workflow'
import TopBar from './components/TopBar'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import RunLog from './components/RunLog'

export default function App() {
  const mode = useBuilderStore((s) => s.mode)
  const loaded = useBuilderStore((s) => s.loaded)
  const load = useBuilderStore((s) => s.load)
  const serverError = useBuilderStore((s) => s.serverError)
  const selectButton = useBuilderStore((s) => s.selectButton)
  const workflowJSON = useBuilderStore(selectWorkflowJSON)

  const append = useLogStore((s) => s.append)
  const setRunning = useLogStore((s) => s.setRunning)

  useEffect(() => { load() }, [load])

  const onEvent = useCallback((event) => append(event), [append])
  const { run, running, flash, progress } = useWorkflowRunner({ onEvent })

  useEffect(() => { setRunning(running) }, [running, setRunning])

  const runWf = () => run(Workflow.fromJSON(workflowJSON))

  const onCanvasButtonClick = () => {
    if (mode === 'design') selectButton()
    else runWf()
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      <TopBar onTest={runWf} />
      {serverError && <BackendBanner message={serverError} />}
      {!loaded && <LoadingBanner />}
      <div className="flex-1 flex min-h-0">
        <Canvas onButtonClick={onCanvasButtonClick} flash={flash} running={running} progress={progress} />
        <Sidebar />
      </div>
      <RunLog />
    </div>
  )
}

function BackendBanner({ message }) {
  return (
    <div className="px-4 py-2 bg-rose-50 text-rose-700 text-sm border-b border-rose-200">
      Backend: {message}
    </div>
  )
}

function LoadingBanner() {
  return (
    <div className="px-4 py-2 bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
      Loading workflow...
    </div>
  )
}
