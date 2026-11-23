const express = require('express')
const path = require('node:path')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const app = express()

app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

module.exports = app
