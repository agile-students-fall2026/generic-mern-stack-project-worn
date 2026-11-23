import { apiRequest } from './api'
import { authHeaders, clearToken } from './authService'

export async function getProfile() {
  const { user } = await apiRequest('/api/profile', { headers: authHeaders() })
  return user
}

export function changePassword({ newPassword, confirmPassword }) {
  return apiRequest('/api/profile/password', {
    method: 'POST',
    headers: authHeaders(),
    json: { newPassword, confirmPassword },
  })
}

export async function deleteAccount() {
  await apiRequest('/api/profile', { method: 'DELETE', headers: authHeaders() })
  clearToken()
}
