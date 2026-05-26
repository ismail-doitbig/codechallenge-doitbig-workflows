import { useBuilderStore } from '../store/builderStore'
import StepIndicators from './StepIndicators'

export default function Canvas({ onButtonClick, flash, running, progress }) {
  const mode = useBuilderStore((s) => s.mode)
  const button = useBuilderStore((s) => s.button)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const clearSelection = useBuilderStore((s) => s.clearSelection)

  const isDesign = mode === 'design'
  const selected = selectedId === button.id
  const steps = button.workflow?.steps || []

  const wrapperClass = isDesign
    ? 'flex-1 blueprint-bg relative overflow-auto'
    : 'flex-1 bg-slate-50 relative overflow-auto'

  return (
    <div className={wrapperClass} onClick={isDesign ? clearSelection : undefined}>
      {isDesign && (
        <div className="absolute top-4 left-5 text-xs uppercase tracking-widest text-white/60 font-medium">
          Design mode
        </div>
      )}
      <div className="h-full w-full grid place-items-center p-10">
        <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <CanvasButton
            label={button.label || 'Untitled button'}
            isDesign={isDesign}
            selected={selected}
            flash={flash}
            running={running}
            onClick={onButtonClick}
          />
          <StepIndicators
            steps={steps}
            runningIndex={progress?.runningIndex ?? null}
            results={progress?.results || {}}
            onBlueprint={isDesign}
          />
        </div>
      </div>
    </div>
  )
}

function CanvasButton({ label, isDesign, selected, flash, running, onClick }) {
  const base = 'px-6 py-3 rounded-xl font-medium text-sm transition select-none disabled:cursor-wait'
  let look
  if (flash === 'error') {
    look = 'bg-rose-500 text-white border border-rose-500 shadow-soft'
  } else if (flash === 'success') {
    look = 'bg-emerald-500 text-white border border-emerald-500 shadow-soft'
  } else if (isDesign) {
    look = 'bg-white text-slate-800 border-2 border-dashed border-white/70 shadow-soft hover:bg-white'
  } else {
    look = 'bg-indigo-500 text-white border border-indigo-500 shadow-soft hover:bg-indigo-600'
  }
  const ring = selected && isDesign ? ' ring-4 ring-indigo-300/70' : ''
  const fx =
    (flash === 'error' ? ' wb-shake' : '') +
    (flash === 'success' ? ' wb-pulse-success' : '')

  return (
    <button type="button" onClick={onClick} disabled={running} className={base + ' ' + look + ring + fx}>
      {running ? 'Running...' : label}
    </button>
  )
}
