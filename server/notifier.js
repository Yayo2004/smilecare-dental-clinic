import nodemailer from 'nodemailer'
import { readReservations } from './db.js'
import { buildDailyEmail } from './emailTemplate.js'

/**
 * Send a daily reservation summary email to the clinic.
 * Checks for reservations scheduled for tomorrow and sends a
 * beautifully formatted HTML email.
 */
export async function sendDailyEmail() {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const emailTo = process.env.EMAIL_TO || emailUser
  const siteUrl = process.env.SITE_URL || 'http://localhost:5173'
  const adminUrl = `${siteUrl}/#/admin`

  if (!emailUser || !emailPass) {
    console.log('[email] EMAIL_USER / EMAIL_PASS not configured — skipping')
    return
  }

  // Calculate tomorrow's date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  const reservations = readReservations().filter((r) => r.date === tomorrowStr)

  if (reservations.length === 0) {
    console.log(`[email] No reservations for ${tomorrowStr} — skipping`)
    return
  }

  // Sort by time
  reservations.sort((a, b) => a.time.localeCompare(b.time))

  console.log(`[email] Sending daily email for ${tomorrowStr} (${reservations.length} reservations)...`)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  const html = buildDailyEmail(reservations, tomorrowStr, adminUrl)

  await transporter.sendMail({
    from: `"SmileCare Dental Clinic" <${emailUser}>`,
    to: emailTo,
    subject: `🔔 SmileCare — ${reservations.length} rendez-vous ${tomorrowStr}`,
    html,
  })

  console.log(`[email] ✓ Sent to ${emailTo} for ${tomorrowStr}`)
}
