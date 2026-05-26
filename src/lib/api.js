export const API_BASE = 'http://localhost:3001'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(path, options = {}) {
  let res
  try {
    res = await fetch(API_BASE + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
  } catch (e) {
    throw new ApiError(`Cannot reach backend at ${API_BASE}. Is "npm run server" running?`, 0)
  }
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.text()).trim() } catch { /* ignore */ }
    if (res.status === 404) {
      throw new ApiError(`Not found: ${path}`, 404)
    }
    throw new ApiError(`${res.status} ${detail || res.statusText}`, res.status)
  }
  if (res.status === 204) return null
  return res.json()
}
