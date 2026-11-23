import { apiRequest } from './api'

const TOKEN_KEY = 'worn-token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
  }
}

export function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function signUp({ email, password }) {
  const { user, token } = await apiRequest('/api/auth/signup', {
    method: 'POST',
    json: { email: email.trim(), password },
  })
  saveToken(token)
  return user
}
