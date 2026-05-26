import { useRef, useState } from 'react'
import { useBuilderStore, selectWorkflow } from '../store/builderStore'
import StepCard from './StepCard'

export default function StepList({ readOnly }) {
  const workflow = useBuilderStore(selectWorkflow)
  const expandedStepId = useBuilderStore((s) => s.expandedStepId)
  const expandStep = useBuilderStore((s) => s.expandStep)
  const removeStep = useBuilderStore((s) => s.removeStep)
  const updateStepConfig = useBuilderStore((s) => s.updateStepConfig)
  const reorderSteps = useBuilderStore((s) => s.reorderSteps)

  const dragFrom = useRef(null)
  const [overIndex, setOverIndex] = useState(null)

  if (workflow.steps.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
        No steps yet. Add one below.
      </div>
    )
  }

  const dragHandlersFor = (index) => readOnly ? {} : {
    draggable: true,
    onDragStart: (e) => {
      dragFrom.current = index
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver: (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setOverIndex(index)
    },
    onDragLeave: () => setOverIndex((cur) => (cur === index ? null : cur)),
    onDrop: (e) => {
      e.preventDefault()
      const from = dragFrom.current
      dragFrom.current = null
      setOverIndex(null)
      if (from === null || from === index) return
      reorderSteps(from, index)
    },
    onDragEnd: () => { dragFrom.current = null; setOverIndex(null) },
  }

  return (
    <div className="space-y-2">
      {workflow.steps.map((step, i) => (
        <div key={step.id}>
          <div className={overIndex === i ? 'ring-2 ring-indigo-300 rounded-xl' : ''}>
            <StepCard
              step={step}
              index={i}
              expanded={expandedStepId === step.id}
              readOnly={readOnly}
              onToggle={() => expandStep(step.id)}
              onRemove={() => removeStep(step.id)}
              onUpdateConfig={(patch) => updateStepConfig(step.id, patch)}
              dragHandlers={dragHandlersFor(i)}
            />
          </div>
          {i < workflow.steps.length - 1 && (
            <div className="flex justify-center py-1 text-slate-300 text-xs">↓</div>
          )}
        </div>
      ))}
    </div>
  )
}
