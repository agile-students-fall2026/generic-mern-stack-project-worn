const express = require('express')
const users = require('../data/users')

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

module.exports = router
