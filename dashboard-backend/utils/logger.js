import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const protokollPath = path.resolve(__dirname, '../data/protokoll.json')

export function logAction(aktion, detail) {
  const eintrag = {
    zeit: dayjs().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss (CEST)'),
    aktion,
    detail,
  }

  let log = []
  try {
    const raw = fs.readFileSync(protokollPath, 'utf-8')
    log = JSON.parse(raw)
  } catch {
    // leer lassen
  }

  log.push(eintrag)
  fs.writeFileSync(protokollPath, JSON.stringify(log, null, 2))
}
