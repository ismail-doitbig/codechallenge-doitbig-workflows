import { useBuilderStore } from '../store/builderStore'

export default function TopBar({ onTest }) {
  const mode = useBuilderStore((s) => s.mode)
  const setMode = useBuilderStore((s) => s.setMode)

  return (
    <header className="h-14 flex items-center justify-between px-5 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 grid place-items-center text-white text-sm font-bold">W</div>
        <span className="font-semibold text-slate-800">Workflow Builder</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="?view=user"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 rounded"
          title="Open the end user view in a new tab"
        >
          ↗ Open user view
        </a>
        {mode === 'design' && (
          <button
            type="button"
            onClick={onTest}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          >
            ▶ Test
          </button>
        )}
        <ModePill mode={mode} setMode={setMode} />
      </div>
    </header>
  )
}

function ModePill({ mode, setMode }) {
  const opts = [
    { id: 'design', label: 'Design' },
    { id: 'preview', label: 'Preview' },
  ]
  return (
    <div className="inline-flex bg-slate-100 rounded-full p-1">
      {opts.map((o) => {
        const active = o.id === mode
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setMode(o.id)}
            className={
              'px-3 py-1 text-sm rounded-full transition ' +
              (active ? 'bg-white shadow-sm text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700')
            }
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
