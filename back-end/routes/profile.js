const express = require('express')
const users = require('../data/users')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', (req, res) => {
  res.json({ user: users.publicUser(req.user) })
})

router.delete('/', (req, res) => {
  users.deleteUser(req.user.id)
  res.status(204).end()
})

module.exports = router
