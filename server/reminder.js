import twilio from 'twilio'
import { readReservations, writeReservations } from './db.js'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM // e.g. whatsapp:+14155238886
const clinicPhone = process.env.CLINIC_PHONE // e.g. 2120644356664

/**
 * Send a WhatsApp reminder to the clinic number
 * containing the reservation details of patients
 * whose appointment date is today or was yesterday.
 */
export async function sendReminders() {
  if (!accountSid || !authToken || !fromWhatsApp) {
    console.log('[reminder] Twilio credentials not configured — skipping')
    return
  }

  const client = twilio(accountSid, authToken)
  const reservations = readReservations()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find reservations where the date is today or yesterday and not yet reminded
  const due = reservations.filter((r) => {
    if (r.reminded) return false
    const resDate = new Date(r.date + 'T00:00:00')
    const diffDays = Math.floor((today - resDate) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 1
  })

  if (due.length === 0) {
    console.log('[reminder] No reservations to remind today')
    return
  }

  console.log(`[reminder] Sending ${due.length} reminder(s)...`)

  for (const reservation of due) {
    const isToday = new Date(reservation.date + 'T00:00:00').toDateString() === today.toDateString()
    const timing = isToday ? "aujourd'hui" : 'hier'

    const message = [
      `🔔 *Rappel de rendez-vous — SmileCare*`,
      ``,
      `Patient(e): *${reservation.name}*`,
      `Téléphone: ${reservation.phone}`,
      `Service: ${reservation.service}`,
      `Date prévue: ${reservation.date} à ${reservation.time}`,
      ``,
      `Ce rendez-vous était prévu ${timing}.`,
      `Veuillez contacter le patient(e) pour confirmer ou reprogrammer.`,
      ``,
      `— SmileCare Dental Clinic`,
    ].join('\n')

    try {
      // Send the reminder to the clinic's WhatsApp number
      await client.messages.create({
        from: fromWhatsApp,
        to: `whatsapp:+${clinicPhone}`,
        body: message,
      })

      // Mark as reminded
      reservation.reminded = true
      console.log(`[reminder] ✓ Sent for ${reservation.name} (${reservation.date})`)
    } catch (err) {
      console.error(`[reminder] ✗ Failed for ${reservation.name}:`, err.message)
    }
  }

  // Save the updated reminded status
  writeReservations(reservations)
  console.log(`[reminder] Done. ${due.length} reminder(s) processed.`)
}
