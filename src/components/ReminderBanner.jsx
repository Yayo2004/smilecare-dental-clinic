import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Bell, MessageCircle, X } from 'lucide-react'
import { buildWhatsAppLink, CLINIC_INFO } from '../config'

const STORAGE_KEY = 'clinic_reservations'

/**
 * Checks localStorage for reservations whose date was yesterday
 * (or earlier) and haven't been reminded yet.
 * Returns the list of pending reservations.
 */
function getPendingReminders() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return all.filter((r) => {
      if (r.reminded) return false
      const reservationDate = new Date(r.date + 'T00:00:00')
      return reservationDate <= today
    })
  } catch {
    return []
  }
}

/** Mark a reservation as reminded */
function markReminded(index) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    // Find the matching reservation and mark it
    let count = 0
    for (let i = 0; i < all.length; i++) {
      if (!all[i].reminded) {
        if (count === index) {
          all[i].reminded = true
          break
        }
        count++
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

/** Dismiss all pending reminders (user closed the banner) */
function dismissAll() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    all.forEach((r) => { r.reminded = true })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

/**
 * Floating reminder banner: appears if a reservation date has passed
 * and the user hasn't been reminded yet. Shows a WhatsApp button to
 * send a follow-up message to the clinic.
 */
export default function ReminderBanner() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const [pending, setPending] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reminders = getPendingReminders()
    if (reminders.length > 0) {
      setPending(reminders)
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  if (pending.length === 0) return null

  // Build a WhatsApp reminder message for all pending reservations
  const buildReminderMessage = () => {
    const greeting = lang === 'fr'
      ? 'Bonjour, je souhaite confirmer ma réservation.'
      : 'Hello, I would like to confirm my reservation.'
    const lines = [greeting, '']
    pending.forEach((r, i) => {
      lines.push(`${lang === 'fr' ? 'Réservation' : 'Reservation'} ${i + 1}:`)
      lines.push(`  ${lang === 'fr' ? 'Patient' : 'Patient'}: ${r.name}`)
      lines.push(`  ${lang === 'fr' ? 'Date' : 'Date'}: ${r.date}`)
      lines.push(`  ${lang === 'fr' ? 'Heure' : 'Time'}: ${r.time}`)
      lines.push(`  ${lang === 'fr' ? 'Service' : 'Service'}: ${r.service}`)
      lines.push('')
    })
    lines.push(lang === 'fr'
      ? 'Merci de bien vouloir confirmer.'
      : 'Thank you for confirming.')
    return lines.join('\n')
  }

  const handleRemind = () => {
    const msg = buildReminderMessage()
    window.open(buildWhatsAppLink(CLINIC_INFO.whatsappNumber, msg), '_blank', 'noopener,noreferrer')
    // Mark all as reminded
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      all.forEach((r) => { r.reminded = true })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    } catch { /* ignore */ }
    setVisible(false)
  }

  const handleDismiss = () => {
    dismissAll()
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
        >
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-navy/40 transition-colors hover:bg-navy/5 hover:text-navy"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Bell className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-navy">
                {t('reminder.title')}
              </p>
              <p className="mt-1 text-sm text-navy/60">
                {pending.length === 1
                  ? t('reminder.single', { name: pending[0].name, date: pending[0].date })
                  : t('reminder.multiple', { count: pending.length })
                }
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <motion.button
              type="button"
              onClick={handleRemind}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="h-4 w-4" />
              {t('reminder.confirm')}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl border border-navy/10 px-4 py-2.5 text-sm font-semibold text-navy/60 transition-colors hover:bg-navy/5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('reminder.later')}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
