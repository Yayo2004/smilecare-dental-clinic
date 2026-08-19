import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { CronJob } from 'cron'
import { addReservation, readReservations } from './db.js'
import { sendReminders } from './reminder.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ─── API Routes ───────────────────────────────────────────────────

/** Save a new reservation */
app.post('/api/reservations', (req, res) => {
  try {
    const { name, phone, email, service, date, time, message } = req.body

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const entry = addReservation({ name, phone, email, service, date, time, message })
    console.log(`[api] New reservation: ${name} — ${date} ${time}`)
    res.status(201).json({ ok: true, id: entry.id })
  } catch (err) {
    console.error('[api] Error saving reservation:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/** List all reservations (for admin/debug) */
app.get('/api/reservations', (_req, res) => {
  res.json(readReservations())
})

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ─── Daily Cron Job: runs every day at 09:00 ─────────────────────
const cron = new CronJob('0 9 * * *', async () => {
  console.log('[cron] Running daily reminder check...')
  await sendReminders()
}, null, false, 'Europe/Paris')

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] SmileCare server running on port ${PORT}`)
  console.log(`[cron]   Daily reminders scheduled at 09:00 (Europe/Paris)`)
  // Also run once on startup to catch any pending reminders
  sendReminders()
})
