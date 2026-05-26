import { api, ApiError } from './api'
import { Workflow } from '../domain/Workflow'
import { v4 as uuid } from 'uuid'

const RESOURCE = '/workflows/main'

const defaultButton = () => {
  const wf = new Workflow()
  wf.addStep('send_email', { to: 'alice@example.com', subject: 'Welcome', body: 'Hello there.' })
  return {
    id: 'btn-' + uuid().slice(0, 8),
    label: 'Click me',
    workflow: wf.toJSON(),
  }
}

export async function loadButton() {
  try {
    const row = await api(RESOURCE)
    if (row && row.button) return row.button
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e
  }
  const button = defaultButton()
  await api('/workflows', {
    method: 'POST',
    body: JSON.stringify({ id: 'main', button }),
  })
  return button
}

export async function saveButton(button) {
  await api(RESOURCE, {
    method: 'PUT',
    body: JSON.stringify({ id: 'main', button }),
  })
}
