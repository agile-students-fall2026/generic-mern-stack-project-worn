const express = require('express')
const path = require('node:path')

const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))

module.exports = app
