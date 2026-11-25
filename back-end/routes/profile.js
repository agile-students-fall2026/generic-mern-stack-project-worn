const express = require('express')
const users = require('../data/users')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', (req, res) => {
  res.json({ user: users.publicUser(req.user) })
})

router.post('/password', (req, res) => {
  const { newPassword, confirmPassword } = req.body ?? {}

  if (!users.isValidPassword(newPassword)) {
    return res
      .status(400)
      .json({ message: `Use at least ${users.MIN_PASSWORD_LENGTH} characters.` })
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match." })
  }

  users.updatePassword(req.user.id, newPassword, req.token)
  res.json({ message: 'Password updated.' })
})

router.post('/email', (req, res) => {
  const { newEmail, confirmEmail } = req.body ?? {}

  if (!users.isValidEmail(newEmail)) {
    return res.status(400).json({ message: 'Enter a valid email address.' })
  }
  if (typeof confirmEmail !== 'string' || confirmEmail.trim().toLowerCase() !== newEmail.trim().toLowerCase()) {
    return res.status(400).json({ message: "Emails don't match." })
  }

  const existingUser = users.findUserByEmail(newEmail)
  if (existingUser && existingUser.id === req.user.id) {
    return res.status(409).json({ message: 'That is already your email.' })
  }
  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists.' })
  }

  users.updateEmail(req.user.id, newEmail)
  res.json({ user: users.publicUser(req.user) })
})

router.delete('/', (req, res) => {
  users.deleteUser(req.user.id)
  res.status(204).end()
})

module.exports = router