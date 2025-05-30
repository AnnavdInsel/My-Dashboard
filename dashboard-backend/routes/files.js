import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { logAction } from '../utils/logger.js'
import fs from 'fs'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.resolve(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
})

const upload = multer({ storage })

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen' })

  logAction('Datei hochgeladen', {
    name: req.file.originalname,
    savedAs: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size,
  })

  res.json({ success: true, filename: req.file.filename })
})

router.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Lesen der Dateien' })
    res.json(files)
  })
})

export default router
