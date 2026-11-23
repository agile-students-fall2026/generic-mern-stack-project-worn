const crypto = require('node:crypto')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

let users = []
let sessions = new Map()
let nextUserNumber = 1

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(normalizeEmail(email))
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function passwordMatches(password, stored) {
  const [salt, hash] = stored.split(':')
  const attempt = Buffer.from(hashPassword(password, salt).split(':')[1], 'hex')
  return crypto.timingSafeEqual(attempt, Buffer.from(hash, 'hex'))
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function findUserByEmail(email) {
  const wanted = normalizeEmail(email)
  return users.find((user) => user.email === wanted) ?? null
}

function findUserById(id) {
  return users.find((user) => user.id === id) ?? null
}

function createUser({ email, password, name }) {
  const cleanEmail = normalizeEmail(email)
  const user = {
    id: `user-${nextUserNumber++}`,
    name: typeof name === 'string' && name.trim() ? name.trim() : cleanEmail.split('@')[0],
    email: cleanEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  return user
}

function createSession(userId) {
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, userId)
  return token
}

function userForToken(token) {
  const userId = sessions.get(token)
  return userId ? findUserById(userId) : null
}

function endSession(token) {
  sessions.delete(token)
}

function updatePassword(userId, newPassword, keepToken) {
  const user = findUserById(userId)
  user.passwordHash = hashPassword(newPassword)
  for (const [token, sessionUserId] of sessions) {
    if (sessionUserId === userId && token !== keepToken) sessions.delete(token)
  }
}

function deleteUser(userId) {
  users = users.filter((user) => user.id !== userId)
  for (const [token, sessionUserId] of sessions) {
    if (sessionUserId === userId) sessions.delete(token)
  }
}

function resetUsers() {
  users = []
  sessions = new Map()
  nextUserNumber = 1
  createUser({ name: 'Demo User', email: 'demo@worn.app', password: 'password123' })
}

resetUsers()

module.exports = {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  isValidPassword,
  passwordMatches,
  hashPassword,
  publicUser,
  findUserByEmail,
  createUser,
  createSession,
  userForToken,
  endSession,
  deleteUser,
  updatePassword,
  resetUsers,
}
