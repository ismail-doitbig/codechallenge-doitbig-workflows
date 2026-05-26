import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { Workflow } from '../domain/Workflow'
import { loadButton, saveButton } from '../lib/workflowApi'

const blankButton = () => ({
  id: 'btn-' + uuid().slice(0, 8),
  label: 'Click me',
  workflow: new Workflow().toJSON(),
})

const withWorkflow = (button, mutate) => {
  const wf = Workflow.fromJSON(button.workflow)
  mutate(wf)
  return { ...button, workflow: wf.toJSON() }
}

let saveTimer = null
const scheduleSave = (button) => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveButton(button).catch((e) => useBuilderStore.setState({ serverError: e.message }))
  }, 300)
}

const update = (set, get, mutator) => {
  const button = mutator(get().button)
  set({ button, serverError: null })
  scheduleSave(button)
}

export const useBuilderStore = create((set, get) => ({
  mode: 'design',
  button: blankButton(),
  selectedId: null,
  expandedStepId: null,
  loaded: false,
  serverError: null,

  load: async () => {
    try {
      const button = await loadButton()
      set({ button, loaded: true, serverError: null })
    } catch (e) {
      set({ loaded: true, serverError: e.message })
    }
  },

  setMode: (mode) => set({ mode, selectedId: mode === 'preview' ? null : get().selectedId }),
  selectButton: () => set({ selectedId: get().button.id }),
  clearSelection: () => set({ selectedId: null, expandedStepId: null }),

  setLabel: (label) => update(set, get, (b) => ({ ...b, label })),

  addStep: (actionId, defaults = {}) => {
    update(set, get, (b) => withWorkflow(b, (wf) => wf.addStep(actionId, defaults)))
    const steps = get().button.workflow.steps
    set({ expandedStepId: steps[steps.length - 1]?.id || null })
  },
  removeStep: (stepId) => {
    update(set, get, (b) => withWorkflow(b, (wf) => wf.removeStep(stepId)))
    if (get().expandedStepId === stepId) set({ expandedStepId: null })
  },
  reorderSteps: (fromIndex, toIndex) => {
    update(set, get, (b) => withWorkflow(b, (wf) => wf.reorder(fromIndex, toIndex)))
  },
  updateStepConfig: (stepId, patch) => {
    update(set, get, (b) => withWorkflow(b, (wf) => wf.updateConfig(stepId, patch)))
  },
  expandStep: (stepId) => set({
    expandedStepId: get().expandedStepId === stepId ? null : stepId,
  }),
}))

export const selectWorkflowJSON = (state) => state.button.workflow
