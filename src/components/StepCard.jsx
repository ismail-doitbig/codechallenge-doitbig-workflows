import { findActionClass, instantiate } from '../domain/registry'
import FieldRenderer from './FieldRenderer'

export default function StepCard({
  step,
  index,
  expanded,
  readOnly,
  onToggle,
  onRemove,
  onUpdateConfig,
  dragHandlers,
}) {
  const cls = findActionClass(step.actionId)
  const inst = instantiate(step.actionId)

  if (!cls || !inst) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
        Unknown action: {step.actionId}
      </div>
    )
  }

  const summary = inst.summary(step.config)

  return (
    <div
      className="rounded-xl bg-white border border-slate-200 shadow-soft overflow-hidden"
      style={{ borderLeft: `4px solid ${cls.color}` }}
      {...(dragHandlers || {})}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 text-left"
      >
        {!readOnly && (
          <span className="cursor-grab text-slate-300 select-none" title="Drag to reorder">⋮⋮</span>
        )}
        <span
          className="w-6 h-6 rounded-full grid place-items-center text-white text-xs font-semibold"
          style={{ background: cls.color }}
        >
          {index + 1}
        </span>
        <span className="text-lg" style={{ color: cls.color }}>{cls.icon}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-slate-800 truncate">{cls.label}</span>
          <span className="block text-xs text-slate-500 truncate">{summary}</span>
        </span>
        {!readOnly && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="text-slate-300 hover:text-rose-500 px-1 text-base"
            title="Remove step"
          >
            ×
          </span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
          {cls.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={step.config[field.key]}
              readOnly={readOnly}
              onChange={(v) => onUpdateConfig({ [field.key]: v })}
            />
          ))}
          {cls.fields.length === 0 && (
            <div className="text-xs text-slate-400 italic">No configuration for this action.</div>
          )}
        </div>
      )}
    </div>
  )
}
