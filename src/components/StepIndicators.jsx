import { findActionClass } from '../domain/registry'

export default function StepIndicators({ steps, runningIndex, results, onBlueprint }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2 max-w-72">
      {steps.map((step, i) => (
        <Chip
          key={step.id}
          index={i}
          step={step}
          status={results ? results[step.id] : undefined}
          active={runningIndex === i}
          onBlueprint={onBlueprint}
        />
      ))}
    </div>
  )
}

function Chip({ step, index, status, active, onBlueprint }) {
  const cls = findActionClass(step.actionId)
  const color = cls ? cls.color : '#94a3b8'
  const icon = status === 'error' ? '✗' : status === 'success' ? '✓' : (cls ? cls.icon : '•')
  const title = (cls ? `${index + 1}. ${cls.label}` : `Step ${index + 1}`)
    + (status === 'success' ? ' (done)' : status === 'error' ? ' (failed)' : active ? ' (running)' : '')
  const base = 'w-6 h-6 rounded-full grid place-items-center text-white text-md font-bold shadow-sm transition'
  let state = ''
  if (status === 'error') state = ' ring-2 ring-rose-400'
  else if (status === 'success') state = ' ring-2 ring-emerald-400'
  else if (!active) state = ' opacity-70'

  const flashStyle = active
    ? { background: color, ['--wb-ring']: hexToRgba(color, 0.65) }
    : { background: color }

  return (
    <div className="flex flex-col items-center gap-0.5 select-none pointer-events-none">
      <div
        className={base + state + (active ? ' wb-step-flash' : '')}
        style={flashStyle}
        title={title}
      >
        {icon}
      </div>
      <span className={'text-[10px] leading-none ' + (onBlueprint ? 'text-white/60' : 'text-slate-400')}>
        {index + 1}
      </span>
    </div>
  )
}

function hexToRgba(hex, alpha) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return `rgba(99,102,241,${alpha})`
  const r = parseInt(m[1], 16)
  const g = parseInt(m[2], 16)
  const b = parseInt(m[3], 16)
  return `rgba(${r},${g},${b},${alpha})`
}
