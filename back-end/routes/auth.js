const express = require('express')
const users = require('../data/users')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/signup', (req, res) => {
  const { email, password } = req.body ?? {}

  if (!users.isValidEmail(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' })
  }
  if (!users.isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: `Use at least ${users.MIN_PASSWORD_LENGTH} characters.` })
  }
  if (users.findUserByEmail(email)) {
    return res.status(409).json({ message: 'An account with that email already exists.' })
  }

  const user = users.createUser({ email, password })
  const token = users.createSession(user.id)
  res.status(201).json({ user: users.publicUser(user), token })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {}

  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Enter your email and password.' })
  }

  const user = users.findUserByEmail(email)
  if (!user || !users.passwordMatches(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Email or password is incorrect.' })
  }

  const token = users.createSession(user.id)
  res.json({ user: users.publicUser(user), token })
})

router.post('/logout', requireAuth, (req, res) => {
  users.endSession(req.token)
  res.status(204).end()
})

router.post('/forgot-password', (req, res) => {
  const { email } = req.body ?? {}

  if (!users.isValidEmail(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' })
  }

  const user = users.findUserByEmail(email)
  if (user) {
    console.log('Reset email sent to ' + user.email)
  }

  res.json({ message: 'If an account exists for that email, a reset link has been sent.' })
})

module.exports = router
