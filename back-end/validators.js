// Input validators shared by the API routes. Rules match the front-end forms.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8
export const WEAR_PERIODS = ['this-year', 'last-year', 'all-time']

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_PATTERN.test(email.trim())
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH
}

// Accepts numbers and numeric strings, since form values often arrive as strings.
export function isPositiveInteger(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return false
  if (typeof value === 'string' && value.trim() === '') return false
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0
}

export function isValidWearPeriod(period) {
  return WEAR_PERIODS.includes(period)
}
