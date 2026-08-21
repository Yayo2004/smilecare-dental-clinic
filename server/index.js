import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { CronJob } from 'cron'
import { addReservation, readReservations, markReminded, deleteReservation, deleteReminded } from './db.js'
import { sendDailyEmail, sendImmediateEmail } from './notifier.js'
import { getAdminPass, setAdminPass } from './config.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Helper: get current password (reads from config.json, falls back to .env)
function currentPass() {
  return getAdminPass()
}

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

    // Send immediate email if reservation is for today or tomorrow
    sendImmediateEmail(entry).catch((err) =>
      console.error('[api] Immediate email failed:', err.message)
    )
  } catch (err) {
    console.error('[api] Error saving reservation:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/** Admin: list all reservations (password protected) */
app.get('/api/reservations', (req, res) => {
  const pass = req.query.pass
  if (pass !== currentPass()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json(readReservations())
})

/** Admin: mark a reservation as reminded */
app.patch('/api/reservations/:id/remind', (req, res) => {
  const pass = req.query.pass
  if (pass !== currentPass()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  markReminded(req.params.id)
  res.json({ ok: true })
})

/** Admin: delete all reminded reservations */
app.delete('/api/reservations/reminded', (req, res) => {
  const pass = req.query.pass
  if (pass !== currentPass()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  deleteReminded()
  res.json({ ok: true })
})

/** Admin: delete a single reservation */
app.delete('/api/reservations/:id', (req, res) => {
  const pass = req.query.pass
  if (pass !== currentPass()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  deleteReservation(req.params.id)
  res.json({ ok: true })
})

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

/** Admin: change password */
app.put('/api/admin/password', (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  if (currentPassword !== currentPass()) {
    return res.status(401).json({ error: 'Wrong current password' })
  }
  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'Password too short' })
  }
  setAdminPass(newPassword)
  console.log('[api] Admin password changed')
  res.json({ ok: true })
})

// ─── Daily Email Cron: runs every day at 09:00 (Europe/Paris) ─────
const emailCron = new CronJob('0 9 * * *', async () => {
  console.log('[cron] Running daily email notification...')
  try {
    await sendDailyEmail()
  } catch (err) {
    console.error('[cron] Email notification failed:', err.message)
  }
}, null, false, 'Europe/Paris')

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] SmileCare server running on port ${PORT}`)
  console.log(`[cron]   Daily email notifications scheduled at 09:00 (Europe/Paris)`)

  // Start the cron job
  emailCron.start()

  // Also send once on startup (so you can test immediately)
  sendDailyEmail().catch(() => {})
})
