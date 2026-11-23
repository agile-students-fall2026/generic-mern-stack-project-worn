import express from 'express'
import { apiNotFound, errorHandler } from './middleware/errors.js'

const app = express()

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiNotFound)
app.use(errorHandler)

export default app
