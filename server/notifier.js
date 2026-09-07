import nodemailer from 'nodemailer'
import { readReservations } from './db.js'
import { buildDailyEmail, buildImmediateEmail, buildResetEmail } from './emailTemplate.js'
import { log } from './logger.js'

/**
 * Send a reminder email to the clinic.
 *
 * variant:
 *  - 'tomorrow-morning': first reminder for tomorrow (09:00)
 *  - 'tomorrow-evening': second reminder for tomorrow (19:00)
 *  - 'today-overdue'   : escalation for all unverified reservations up to and
 *                        including today (08:00). Past dates are included so a
 *                        reservation is re-emailed every morning until checked.
 *
 * Only free (not yet reminded) reservations are included.
 */
export async function sendReminderEmail(targetDate, variant = 'tomorrow-morning') {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const emailTo = process.env.EMAIL_TO || emailUser
  const siteUrl = process.env.SITE_URL || 'http://localhost:5173'
  const adminUrl = `${siteUrl}/#/admin`

  if (!emailUser || !emailPass) {
    log('[email] EMAIL_USER / EMAIL_PASS not configured â€” skipping')
    return
  }

  const all = readReservations()
  const reservations =
    variant === 'today-overdue'
      ? all.filter((r) => !r.reminded && r.date <= targetDate)
      : all.filter((r) => r.date === targetDate && !r.reminded)

  if (reservations.length === 0) {
    log(`[email] No unverified reservations for ${targetDate} (variant ${variant}) â€” skipping`)
    return
  }

  const subjects = {
    'tomorrow-morning': `ðŸ”” SmileCare â€” ${reservations.length} RDV demain Ã  vÃ©rifier (${targetDate})`,
    'tomorrow-evening': `ðŸŒ™ SmileCare â€” Rappel : ${reservations.length} RDV demain non vÃ©rifiÃ©s (${targetDate})`,
    'today-overdue': `âš ï¸ SmileCare â€” ${reservations.length} RDV non vÃ©rifiÃ©s (${reservations.map((r) => r.date).filter((v, i, a) => a.indexOf(v) === i).join(', ')})`,
  }
  const subject = subjects[variant] || `ðŸ”” SmileCare â€” ${reservations.length} rendez-vous ${targetDate}`

  log(`[email] Sending reminder (${variant}) for ${targetDate} (${reservations.length} reservations)...`)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  const html = buildDailyEmail(reservations, targetDate, adminUrl, variant)

  await transporter.sendMail({
    from: `"SmileCare Dental Clinic" <${emailUser}>`,
    to: emailTo,
    subject,
    html,
    
  })

  log(`[email] âœ“ Reminder (${variant}) sent to ${emailTo} for ${targetDate}`)
}

/**
 * Send an immediate notification when a new reservation is booked
 * for today or tomorrow.
 */
export async function sendImmediateEmail(reservation) {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const emailTo = process.env.EMAIL_TO || emailUser
  const siteUrl = process.env.SITE_URL || 'http://localhost:5173'

  if (!emailUser || !emailPass) {
    log('[email] EMAIL_USER / EMAIL_PASS not configured â€” skipping')
    return
  }

  log(`[email] Sending new reservation notification for ${reservation.name}...`)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  const html = buildImmediateEmail(reservation, siteUrl)

  await transporter.sendMail({
    from: `"SmileCare Dental Clinic" <${emailUser}>`,
    to: emailTo,
    subject: `ðŸ“… SmileCare â€” Nouveau RDV: ${reservation.name} â€” ${reservation.date}`,
    html,
    
  })

  log(`[email] âœ“ Notification sent for ${reservation.name}`)
}

/**
 * Send a password reset code email to the doctor.
 */
export async function sendResetCode(email, code) {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER / EMAIL_PASS not configured')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  const html = buildResetEmail(code)

  await transporter.sendMail({
    from: `"SmileCare Dental Clinic" <${emailUser}>`,
    to: email,
    subject: 'ðŸ”‘ SmileCare â€” Code de rÃ©initialisation',
    html,
    
  })

  log(`[email] âœ“ Reset code sent to ${email}`)
}
