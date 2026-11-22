// JSON 404 for unknown /api routes. Mount after all API routes.
export function apiNotFound(req, res) {
  res.status(404).json({ message: `No API route for ${req.method} ${req.originalUrl}` })
}

// Sends errors as { message } JSON, the shape the front-end API helper reads.
// Server errors get a generic message so internal details are not exposed.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  const status = err.status || err.statusCode || 500
  if (status >= 500) {
    console.error(err)
    return res.status(status).json({ message: 'Something went wrong on the server' })
  }
  res.status(status).json({ message: err.message })
}
