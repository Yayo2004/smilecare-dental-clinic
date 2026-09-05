import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { CronJob } from 'cron'
import { addReservation, readReservations, markReminded, deleteReservation, deleteReminded } from './db.js'
import { sendDailyEmail, sendImmediateEmail, sendResetCode } from './notifier.js'
import { getAdminPass, setAdminPass } from './config.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Helper: get current password (reads from config.json, falls back to .env)
function currentPass() {
  return getAdminPass()
}

// In-memory reset codes: email -> { code, expiresAt }
const resetCodes = new Map()
const RESET_TTL_MIN = 15

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function doctorEmails() {
  return [process.env.EMAIL_TO, process.env.EMAIL_USER].filter(Boolean)
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

/** Admin: request a password reset code (sent to doctor's email automatically) */
app.post('/api/admin/forgot-password', async (_req, res) => {
  const recipients = doctorEmails()
  if (recipients.length === 0) {
    return res.status(500).json({ error: 'No doctor email configured' })
  }

  const target = recipients[0]
  const code = generateCode()
  resetCodes.set(target, { code, expiresAt: Date.now() + RESET_TTL_MIN * 60 * 1000 })
  console.log(`[api] Reset code generated for ${target}`)

  try {
    await sendResetCode(target, code)
    res.json({ ok: true })
  } catch (err) {
    console.error('[api] Failed to send reset code:', err.message)
    res.status(500).json({ error: 'Email not sent' })
  }
})

/** Admin: verify reset code and set new password */
app.post('/api/admin/reset-password', (req, res) => {
  const { code, newPassword } = req.body || {}
  if (!code || !newPassword) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const recipients = doctorEmails()
  if (recipients.length === 0) {
    return res.status(500).json({ error: 'No doctor email configured' })
  }
  const target = recipients[0]
  const entry = resetCodes.get(target)

  if (!entry || entry.code !== code.trim()) {
    return res.status(401).json({ error: 'Invalid or expired code' })
  }
  if (Date.now() > entry.expiresAt) {
    resetCodes.delete(target)
    return res.status(401).json({ error: 'Invalid or expired code' })
  }
  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'Password too short' })
  }

  setAdminPass(newPassword)
  resetCodes.delete(target)
  console.log('[api] Password reset via email code')
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
