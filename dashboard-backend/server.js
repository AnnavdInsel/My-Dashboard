// server.js
import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

let dashboardTitle = 'Mein Dashboard'

app.get('/api/dashboard-title', (req, res) => {
  res.json({ title: dashboardTitle })
})

app.post('/api/dashboard-title', (req, res) => {
  const { title } = req.body
  if (typeof title === 'string') {
    dashboardTitle = title
    console.log(`✅ Neuer Titel gespeichert: ${title}`)
    res.json({ success: true })
  } else {
    console.log('❌ Fehler: Kein gültiger Titel erhalten.')
    res.status(400).json({ error: 'Kein gültiger Titel' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`)
})
