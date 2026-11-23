// Use relative /api paths so requests go through the development proxy.
// Pass plain data as json, or a native fetch body (such as FormData) as body.
export async function apiRequest(path, { json, ...options } = {}) {
  const headers = new Headers(options.headers)
  if (json !== undefined) {
    if (options.body !== undefined) {
      throw new Error('Provide either json or body, not both')
    }
    options.body = JSON.stringify(json)
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  }
  const response = await fetch(path, { ...options, headers })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const error = await response.json()
      if (typeof error?.message === 'string' && error.message.trim()) {
        message = error.message
      }
    } catch {
      // Servers may return an empty body or HTML instead of a JSON error.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text.trim() ? JSON.parse(text) : null
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: 'GET' })
}
