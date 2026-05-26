import { useEffect, useState } from 'react'
import { Workflow } from './domain/Workflow'
import { loadButton } from './lib/workflowApi'
import { useWorkflowRunner } from './engine/useWorkflowRunner'

export default function UserApp() {
  const [button, setButton] = useState(null)
  const [error, setError] = useState(null)
  const { run, running, flash } = useWorkflowRunner()

  useEffect(() => {
    loadButton()
      .then(setButton)
      .catch((e) => setError(e.message))
  }, [])

  const onClick = () => {
    if (!button) return
    run(Workflow.fromJSON(button.workflow))
  }

  return (
    <div className="h-full w-full grid place-items-center bg-slate-50 p-10">
      <div className="flex flex-col items-center gap-6">
        {error ? <BackendError message={error} /> : <UserButton button={button} flash={flash} running={running} onClick={onClick} />}
      </div>
    </div>
  )
}

function UserButton({ button, flash, running, onClick }) {
  const label = button ? button.label : 'Loading...'
  const base = 'px-7 py-3.5 rounded-xl font-medium text-base transition shadow-soft select-none disabled:cursor-wait'
  let look
  if (flash === 'error') {
    look = 'bg-rose-500 text-white border border-rose-500'
  } else if (flash === 'success') {
    look = 'bg-emerald-500 text-white border border-emerald-500'
  } else {
    look = 'bg-indigo-500 text-white border border-indigo-500 hover:bg-indigo-600'
  }
  const fx =
    (flash === 'error' ? ' wb-shake' : '') +
    (flash === 'success' ? ' wb-pulse-success' : '')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!button || running}
      className={base + ' ' + look + fx}
    >
      {running ? 'Working...' : label}
    </button>
  )
}

function BackendError({ message }) {
  return (
    <div className="max-w-sm text-center text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-4">
      <div className="font-semibold mb-1">Cannot load this button</div>
      <div className="text-xs">{message}</div>
    </div>
  )
}
