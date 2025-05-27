// server.js
import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Simpler Speicher für den Dashboard-Namen
let dashboardTitle = '📚 Mein Dashboard'

// GET: Titel abrufen
app.get('/api/dashboard-title', (req, res) => {
  res.json({ title: dashboardTitle })
})

// POST: Titel setzen
app.post('/api/dashboard-title', (req, res) => {
  const { title } = req.body
  if (typeof title === 'string') {
    dashboardTitle = title
    res.json({ success: true })
  } else {
    res.status(400).json({ error: 'Kein gültiger Titel' })
  }
})

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`)
})
