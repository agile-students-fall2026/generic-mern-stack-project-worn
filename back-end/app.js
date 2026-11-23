const express = require('express')
const path = require('node:path')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', authRoutes)

module.exports = app
