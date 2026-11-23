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

router.delete('/', (req, res) => {
  users.deleteUser(req.user.id)
  res.status(204).end()
})

module.exports = router
