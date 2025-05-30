import express from 'express'
import { readJSON, writeJSON } from '../utils/fileHelpers.js'
import { logAction } from '../utils/logger.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const notesPath = path.resolve(__dirname, '../data/notes.json')

router.get('/notes', (req, res) => {
  const notes = readJSON(notesPath, {})
  res.json(notes)
})

router.post('/notes', (req, res) => {
  const { date, note } = req.body
  if (!date || typeof note !== 'string') {
    return res.status(400).json({ error: 'Ungültige Daten' })
  }

  const notes = readJSON(notesPath, {})
  notes[date] = note
  writeJSON(notesPath, notes)
  logAction('Notiz gesetzt', { date, note })
  res.json({ success: true })
})

export default router
