import { useEffect, useRef, useState } from 'react'
import { ACTION_REGISTRY } from '../domain/registry'
import { useBuilderStore } from '../store/builderStore'

export default function ActionPicker() {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef(null)
  const addStep = useBuilderStore((s) => s.addStep)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const pick = (id) => {
    addStep(id)
    setOpen(false)
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40"
      >
        + Add step
      </button>

      {open && (
        <div className="absolute z-20 mt-2 left-0 right-0 rounded-xl bg-white border border-slate-200 shadow-lg p-2 space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Choose an action
          </div>
          {ACTION_REGISTRY.map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={() => pick(cls.id)}
              className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 text-left"
            >
              <span
                className="w-8 h-8 shrink-0 rounded-lg grid place-items-center text-white text-base"
                style={{ background: cls.color }}
              >
                {cls.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-800">{cls.label}</span>
                <span className="block text-xs text-slate-500">{cls.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
