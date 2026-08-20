import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { addReservation, readReservations, markReminded, deleteReservation, deleteReminded } from './db.js'

const app = express()
const PORT = process.env.PORT || 3001
const ADMIN_PASS = process.env.ADMIN_PASS || 'smilecare2024'

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

/** Admin: list all reservations (password protected) */
app.get('/api/reservations', (req, res) => {
  const pass = req.query.pass
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json(readReservations())
})

/** Admin: mark a reservation as reminded */
app.patch('/api/reservations/:id/remind', (req, res) => {
  const pass = req.query.pass
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  markReminded(req.params.id)
  res.json({ ok: true })
})

/** Admin: delete a single reservation */
app.delete('/api/reservations/:id', (req, res) => {
  const pass = req.query.pass
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  deleteReservation(req.params.id)
  res.json({ ok: true })
})

/** Admin: delete all reminded reservations */
app.delete('/api/reservations/reminded', (req, res) => {
  const pass = req.query.pass
  if (pass !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  deleteReminded()
  res.json({ ok: true })
})

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] SmileCare server running on port ${PORT}`)
})
