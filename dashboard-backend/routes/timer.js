import express from 'express'
import { logAction } from '../utils/logger.js'

const router = express.Router()

// Timer gestoppt -> Log-Eintrag
router.post('/timer-log', (req, res) => {
  const { duration } = req.body

  if (!duration || typeof duration !== 'string') {
    return res.status(400).json({ error: 'Ungültige Dauer' })
  }

  logAction('Timer gestoppt', `Dauer: ${duration}`)
  res.json({ success: true })
})

export default router
