import { useBuilderStore } from '../store/builderStore'
import StepList from './StepList'
import ActionPicker from './ActionPicker'

export default function Sidebar() {
  const mode = useBuilderStore((s) => s.mode)
  const button = useBuilderStore((s) => s.button)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const setLabel = useBuilderStore((s) => s.setLabel)

  const isPreview = mode === 'preview'
  const showWorkflow = isPreview || selectedId === button.id

  return (
    <aside className="w-[380px] shrink-0 border-l border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          {isPreview ? 'Preview' : 'Configure'}
        </div>
        <div className="text-sm text-slate-600 mt-0.5">
          {showWorkflow ? 'Button workflow' : 'Nothing selected'}
        </div>
      </div>

      {isPreview && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-800">
          Preview mode is read only. Click the button to run the workflow.
        </div>
      )}

      {!showWorkflow && <EmptyState />}

      {showWorkflow && (
        <div className="flex-1 overflow-auto p-5 space-y-5">
          <LabelField value={button.label} onChange={setLabel} readOnly={isPreview} />
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              When clicked
            </div>
            <StepList readOnly={isPreview} />
            {!isPreview && (
              <div className="mt-3">
                <ActionPicker />
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 grid place-items-center p-6 text-center">
      <div className="text-slate-500 text-sm max-w-[260px] leading-relaxed">
        Click the button on the canvas to configure what happens when it is pressed.
      </div>
    </div>
  )
}

function LabelField({ value, onChange, readOnly }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1.5">Button label</span>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 read-only:bg-slate-50"
      />
    </label>
  )
}
