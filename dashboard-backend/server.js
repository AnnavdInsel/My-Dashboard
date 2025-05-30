import express from 'express'
import cors from 'cors'
import dashboardRoutes from './routes/dashboard.js'
import todosRoutes from './routes/todos.js'
import notesRoutes from './routes/notes.js'
import fileRoutes from './routes/files.js'
import timerRoutes from './routes/timer.js'
import productivityRoutes from './routes/productivity.js'
import exportRoutes from './routes/export.js'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use('/api', dashboardRoutes)
app.use('/api', todosRoutes)
app.use('/api', notesRoutes)
app.use('/api', fileRoutes)
app.use('/uploads', express.static('uploads')) // damit Dateien öffentlich abrufbar sind
app.use('/api', timerRoutes)
app.use('/api', productivityRoutes)
app.use('/api', exportRoutes)

app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`)
})
