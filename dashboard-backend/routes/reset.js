import express from 'express'
import { writeJSON } from '../utils/fileHelpers.js'
import { logAction } from '../utils/logger.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.delete('/reset', (req, res) => {
  const dataDir = path.resolve(__dirname, '../data')

  writeJSON(path.join(dataDir, 'todos.json'), [])
  writeJSON(path.join(dataDir, 'notes.json'), {})
  writeJSON(path.join(dataDir, 'productivity.json'), {})
  writeJSON(path.join(dataDir, 'settings.json'), { dashboardTitle: 'Mein Dashboard' })

  logAction('Board komplett zurueckgesetzt', {})

  res.json({ success: true })
})

export default router
