// Use relative /api paths so requests go through the development proxy.
export async function apiGet(path) {
  const response = await fetch(path)

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
  return response.json()
}
