function apiNotFound(req, res) {
  res.status(404).json({ message: `No API route for ${req.method} ${req.originalUrl}` })
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  const status = err.status || err.statusCode || 500
  if (status >= 500) {
    console.error(err)
    return res.status(status).json({ message: 'Something went wrong on the server' })
  }
  res.status(status).json({ message: err.message })
}

module.exports = { apiNotFound, errorHandler }