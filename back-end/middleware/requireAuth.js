const users = require('../data/users')

function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('Authorization') ?? '').split(' ')
  const user = scheme === 'Bearer' && token ? users.userForToken(token) : null

  if (!user) {
    return res.status(401).json({ message: 'Please log in again.' })
  }

  req.user = user
  req.token = token
  next()
}

module.exports = requireAuth
