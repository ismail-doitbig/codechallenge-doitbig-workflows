import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import { Workflow } from '../domain/Workflow'

const initialButton = () => {
  const wf = new Workflow()
  wf.addStep('send_email', { to: '', subject: 'Welcome', body: '' })
  return {
    id: 'btn-' + uuid().slice(0, 8),
    label: 'Click me',
    workflow: wf.toJSON(),
  }
}

const withWorkflow = (button, mutate) => {
  const wf = Workflow.fromJSON(button.workflow)
  mutate(wf)
  return { ...button, workflow: wf.toJSON() }
}

export const useBuilderStore = create(
  persist(
    (set, get) => ({
      mode: 'design',
      button: initialButton(),
      selectedId: null,
      expandedStepId: null,

      setMode: (mode) => set({ mode, selectedId: mode === 'preview' ? null : get().selectedId }),
      selectButton: () => set({ selectedId: get().button.id }),
      clearSelection: () => set({ selectedId: null, expandedStepId: null }),
      setLabel: (label) => set({ button: { ...get().button, label } }),

      addStep: (actionId, defaults = {}) => {
        const button = withWorkflow(get().button, (wf) => wf.addStep(actionId, defaults))
        const lastStep = button.workflow.steps[button.workflow.steps.length - 1]
        set({ button, expandedStepId: lastStep ? lastStep.id : null })
      },
      removeStep: (stepId) => {
        const button = withWorkflow(get().button, (wf) => wf.removeStep(stepId))
        set({ button, expandedStepId: get().expandedStepId === stepId ? null : get().expandedStepId })
      },
      reorderSteps: (fromIndex, toIndex) => {
        const button = withWorkflow(get().button, (wf) => wf.reorder(fromIndex, toIndex))
        set({ button })
      },
      updateStepConfig: (stepId, patch) => {
        const button = withWorkflow(get().button, (wf) => wf.updateConfig(stepId, patch))
        set({ button })
      },
      expandStep: (stepId) => set({
        expandedStepId: get().expandedStepId === stepId ? null : stepId,
      }),
    }),
    {
      name: 'builder-state-v1',
      partialize: (state) => ({ button: state.button }),
    },
  ),
)

export const selectWorkflow = (state) => Workflow.fromJSON(state.button.workflow)
