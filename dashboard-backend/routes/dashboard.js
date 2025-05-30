import express from 'express'
import { readJSON, writeJSON } from '../utils/fileHelpers.js'
import { logAction } from '../utils/logger.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const settingsPath = path.resolve(__dirname, '../data/settings.json')

// Dashboard-Titel GET
router.get('/dashboard-title', (req, res) => {
  const settings = readJSON(settingsPath, { dashboardTitle: 'Mein Dashboard' })
  res.json({ title: settings.dashboardTitle })
})

// Dashboard-Titel POST
router.post('/dashboard-title', (req, res) => {
  const { title } = req.body
  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Kein gültiger Titel' })
  }

  writeJSON(settingsPath, { dashboardTitle: title })
  logAction('Dashboard-Titel geändert', title)
  res.json({ success: true })
})

export default router
