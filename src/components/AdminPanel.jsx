import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  LogIn,
  MessageCircle,
  Phone,
  RefreshCw,
  Trash2,
  User,
} from 'lucide-react'
import { buildWhatsAppLink } from '../config'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Admin panel: login → see all reservations → send WhatsApp reminders with one click.
 */
export default function AdminPanel() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const [pass, setPass] = useState('')
  const [authed, setAuthed] = useState(false)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReservations = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/reservations?pass=${pass}`)
      if (res.status === 401) {
        setError(lang === 'fr' ? 'Mot de passe incorrect' : 'Wrong password')
        setAuthed(false)
        return
      }
      const data = await res.json()
      setReservations(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setAuthed(true)
    } catch {
      setError(lang === 'fr' ? 'Impossible de contacter le serveur' : 'Cannot reach server')
    }
    setLoading(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    fetchReservations()
  }

  const handleRemind = async (reservation) => {
    const greeting = lang === 'fr'
      ? `Bonjour ${reservation.name},`
      : `Hello ${reservation.name},`
    const body = lang === 'fr'
      ? `Nous vous rappelons votre rendez-vous chez SmileCare:\n\nService: ${reservation.service}\nDate: ${reservation.date}\nHeure: ${reservation.time}\n\nMerci de confirmer votre présence.`
      : `This is a reminder about your appointment at SmileCare:\n\nService: ${reservation.service}\nDate: ${reservation.date}\nTime: ${reservation.time}\n\nPlease confirm your attendance.`
    const message = `${greeting}\n\n${body}`

    // Ensure international format: strip spaces/dashes, add 212 if starts with 0
    let phone = reservation.phone.replace(/[^0-9]/g, '')
    if (phone.startsWith('0')) {
      phone = '212' + phone.slice(1)
    }
    if (!phone.startsWith('212')) {
      phone = '212' + phone
    }

    window.open(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank')

    // Mark as reminded in backend
    try {
      await fetch(`${API_URL}/api/reservations/${reservation.id}/remind?pass=${pass}`, { method: 'PATCH' })
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, reminded: true } : r))
      )
    } catch { /* ignore */ }
  }

  const handleRemindAll = async () => {
    const pending = reservations.filter((r) => !r.reminded)
    for (const r of pending) {
      await handleRemind(r)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/reservations/${id}?pass=${pass}`, { method: 'DELETE' })
      setReservations((prev) => prev.filter((r) => r.id !== id))
    } catch { /* ignore */ }
  }

  const handleDeleteAllReminded = async () => {
    if (!confirm(lang === 'fr' ? 'Supprimer toutes les réservations envoyées ?' : 'Delete all sent reservations?')) return
    try {
      await fetch(`${API_URL}/api/reservations/reminded?pass=${pass}`, { method: 'DELETE' })
      setReservations((prev) => prev.filter((r) => !r.reminded))
    } catch { /* ignore */ }
  }

  // ── Login screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <section className="min-h-screen bg-mint/30 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-sm"
        >
          <div className="rounded-2xl border border-navy/5 bg-white p-8 shadow-soft">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LogIn className="h-7 w-7" />
              </span>
            </div>
            <h1 className="mt-5 text-center font-display text-2xl font-bold text-navy">
              {t('admin.title')}
            </h1>
            <p className="mt-2 text-center text-sm text-navy/60">
              {t('admin.subtitle')}
            </p>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="password"
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError('') }}
                placeholder={t('admin.passwordPlaceholder')}
                className="field w-full"
                autoFocus
              />
              <motion.button
                type="submit"
                className="btn-primary w-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                {loading ? t('admin.loading') : t('admin.login')}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────
  const pending = reservations.filter((r) => !r.reminded)
  const reminded = reservations.filter((r) => r.reminded)

  return (
    <section className="min-h-screen bg-mint/30 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">
              {t('admin.dashboard')}
            </h1>
            <p className="mt-1 text-sm text-navy/60">
              {t('admin.total', { count: reservations.length })}
            </p>
          </div>
          <div className="flex gap-2">
            {pending.length > 0 && (
              <motion.button
                onClick={handleRemindAll}
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Bell className="h-4 w-4" />
                {t('admin.remindAll', { count: pending.length })}
              </motion.button>
            )}
            {reminded.length > 0 && (
              <motion.button
                onClick={handleDeleteAllReminded}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Trash2 className="h-4 w-4" />
                {t('admin.deleteAllSent')}
              </motion.button>
            )}
            <motion.button
              onClick={fetchReservations}
              className="flex items-center gap-2 rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Pending reservations */}
        {pending.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-navy">
              <Bell className="h-5 w-5 text-amber-500" />
              {t('admin.pending')} ({pending.length})
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {pending.map((r) => (
                  <ReservationCard
                    key={r.id}
                    reservation={r}
                    onRemind={handleRemind}
                    onDelete={handleDelete}
                    lang={lang}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Reminded reservations */}
        {reminded.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-navy/50">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {t('admin.done')} ({reminded.length})
            </h2>
            <div className="space-y-3">
              {reminded.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onRemind={handleRemind}
                  onDelete={handleDelete}
                  lang={lang}
                  reminded
                />
              ))}
            </div>
          </div>
        )}

        {reservations.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-lg text-navy/40">{t('admin.empty')}</p>
          </div>
        )}
      </div>
    </section>
  )
}

/** Single reservation card with WhatsApp reminder button */
function ReservationCard({ reservation: r, onRemind, onDelete, lang, reminded }) {
  const isPast = new Date(r.date + 'T23:59:59') < new Date()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`rounded-2xl border bg-white p-5 shadow-soft ${
        reminded ? 'border-green-200 opacity-70' : isPast ? 'border-amber-200' : 'border-navy/5'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-navy/40" />
            <span className="font-bold text-navy">{r.name}</span>
            {reminded && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                {lang === 'fr' ? 'Envoyé' : 'Sent'}
              </span>
            )}
            {isPast && !reminded && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {lang === 'fr' ? 'En retard' : 'Overdue'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-navy/60">
            <Phone className="h-3.5 w-3.5" />
            {r.phone}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-navy/60">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {r.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {r.time}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {r.service}
            </span>
          </div>
        </div>

        <motion.button
          onClick={() => onDelete(r.id)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-navy/10 text-navy/40 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={lang === 'fr' ? 'Supprimer' : 'Delete'}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>

        <motion.button
          onClick={() => onRemind(r)}
          className={`flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm ${
            reminded
              ? 'bg-navy/30'
              : 'bg-[#25D366] hover:bg-[#20bd5a]'
          }`}
          whileHover={reminded ? {} : { scale: 1.05 }}
          whileTap={reminded ? {} : { scale: 0.95 }}
        >
          <MessageCircle className="h-4 w-4" />
          {reminded
            ? (lang === 'fr' ? 'Renvoyer' : 'Resend')
            : (lang === 'fr' ? 'Rappeler' : 'Remind')
          }
        </motion.button>
      </div>
    </motion.div>
  )
}
