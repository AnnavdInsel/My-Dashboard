import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { readJSON, writeJSON } from '../utils/fileHelpers.js'
import { logAction } from '../utils/logger.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.resolve(__dirname, '../data/productivity.json')

// POST /api/productivity → Zeit hinzufügen
router.post('/productivity', (req, res) => {
  const { category, durationSec } = req.body

  if (!category || typeof durationSec !== 'number') {
    return res.status(400).json({ error: 'Ungültige Daten' })
  }

  const data = readJSON(dataPath, {})

  if (!data[category]) {
    data[category] = 0
  }

  data[category] += durationSec
  writeJSON(dataPath, data)

  logAction('Produktivität getrackt', {
    kategorie: category,
    dauer: durationSec + ' Sek.',
  })

  res.json({ success: true })
})

// GET /api/productivity → gesamte Statistik abrufen
router.get('/productivity', (req, res) => {
  const data = readJSON(dataPath, {})
  res.json(data)
})

export default router
