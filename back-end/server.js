import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Back-end listening on http://localhost:${PORT}`)
})
