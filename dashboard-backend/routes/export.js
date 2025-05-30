import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const allowedFiles = {
  todos: 'todos.json',
  notes: 'notes.json',
  protokoll: 'data/protokoll.json',
  productivity: 'data/productivity.json',
}

router.get('/export/:type', (req, res) => {
  const { type } = req.params
  const filename = allowedFiles[type]

  if (!filename) {
    return res.status(400).json({ error: 'Unbekannter Export-Typ' })
  }

  const filePath = path.resolve(__dirname, '..', filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Datei nicht gefunden' })
  }

  res.download(filePath, `${type}.json`, (err) => {
    if (err) {
      console.error('Fehler beim Download:', err)
      res.status(500).send('Download fehlgeschlagen')
    }
  })
})

export default router
