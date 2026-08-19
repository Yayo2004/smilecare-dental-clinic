import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'reservations.json')

/** Read all reservations from the JSON file */
export function readReservations() {
  try {
    if (!fs.existsSync(DB_PATH)) return []
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

/** Write the full reservations array to the JSON file */
export function writeReservations(reservations) {
  fs.writeFileSync(DB_PATH, JSON.stringify(reservations, null, 2), 'utf-8')
}

/** Add a new reservation */
export function addReservation(reservation) {
  const all = readReservations()
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...reservation,
    reminded: false,
    createdAt: new Date().toISOString(),
  }
  all.push(entry)
  writeReservations(all)
  return entry
}
