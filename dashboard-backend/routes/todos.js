import express from 'express'
import { readJSON, writeJSON } from '../utils/fileHelpers.js'
import { logAction } from '../utils/logger.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const todosPath = path.resolve(__dirname, '../data/todos.json')

router.get('/todos', (req, res) => {
  const todos = readJSON(todosPath, [])
  res.json(todos)
})

router.post('/todos', (req, res) => {
  const { todos } = req.body
  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: 'Ungültige Daten' })
  }

  writeJSON(todosPath, todos)

  // Protokoll erweitert: wie viele sind erledigt?
  const erledigt = todos.filter((t) => t.done).length
  const offen = todos.length - erledigt

  logAction('ToDos aktualisiert', {
    gesamt: todos.length,
    erledigt,
    offen,
  })

  res.json({ success: true })
})

export default router
