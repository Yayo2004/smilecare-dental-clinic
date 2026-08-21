import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Filter,
  KeyRound,
  LogIn,
  MessageCircle,
  Phone,
  RefreshCw,
  Trash2,
  User,
  X,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const TABS = ['all', 'sent', 'pending', 'overdue']

export default function AdminPanel() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null) // null | 'all-sent' | reservation id
  const [showChangePass, setShowChangePass] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')
  const [changePassError, setChangePassError] = useState('')
  const [changePassSuccess, setChangePassSuccess] = useState(false)

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

  const isPast = (date) => new Date(date + 'T23:59:59') < new Date()

  const getFiltered = () => {
    switch (activeTab) {
      case 'sent': return reservations.filter((r) => r.reminded)
      case 'pending': return reservations.filter((r) => !r.reminded && !isPast(r.date))
      case 'overdue': return reservations.filter((r) => !r.reminded && isPast(r.date))
      default: return reservations
    }
  }

  const filtered = getFiltered()
  const countPending = reservations.filter((r) => !r.reminded && !isPast(r.date)).length
  const countOverdue = reservations.filter((r) => !r.reminded && isPast(r.date)).length
  const countSent = reservations.filter((r) => r.reminded).length

  const handleRemind = async (reservation) => {
    const greeting = lang === 'fr' ? `Bonjour ${reservation.name},` : `Hello ${reservation.name},`
    const body = lang === 'fr'
      ? `Nous vous rappelons votre rendez-vous chez SmileCare:\n\nService: ${reservation.service}\nDate: ${reservation.date}\nHeure: ${reservation.time}\n\nMerci de confirmer votre présence.`
      : `This is a reminder about your appointment at SmileCare:\n\nService: ${reservation.service}\nDate: ${reservation.date}\nTime: ${reservation.time}\n\nPlease confirm your attendance.`
    const message = `${greeting}\n\n${body}`

    let phone = reservation.phone.replace(/[^0-9]/g, '')
    if (phone.startsWith('0')) phone = '212' + phone.slice(1)
    if (!phone.startsWith('212')) phone = '212' + phone

    window.open(`whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank')

    try {
      await fetch(`${API_URL}/api/reservations/${reservation.id}/remind?pass=${pass}`, { method: 'PATCH' })
      setReservations((prev) => prev.map((r) => (r.id === reservation.id ? { ...r, reminded: true } : r)))
    } catch { /* ignore */ }
  }

  const handleRemindAll = async () => {
    const pending = reservations.filter((r) => !r.reminded && !isPast(r.date))
    const overdue = reservations.filter((r) => !r.reminded && isPast(r.date))
    const all = [...pending, ...overdue]
    for (const r of all) {
      await handleRemind(r)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const handleDelete = async (id) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = async () => {
    if (confirmDelete === 'all-sent') {
      try {
        await fetch(`${API_URL}/api/reservations/reminded?pass=${pass}`, { method: 'DELETE' })
        setReservations((prev) => prev.filter((r) => !r.reminded))
      } catch { /* ignore */ }
    } else if (confirmDelete) {
      try {
        await fetch(`${API_URL}/api/reservations/${confirmDelete}?pass=${pass}`, { method: 'DELETE' })
        setReservations((prev) => prev.filter((r) => r.id !== confirmDelete))
      } catch { /* ignore */ }
    }
    setConfirmDelete(null)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangePassError('')
    setChangePassSuccess(false)
    if (newPass !== confirmNewPass) {
      setChangePassError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }
    if (newPass.length < 4) {
      setChangePassError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 4 caractères' : 'Password must be at least 4 characters')
      return
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pass, newPassword: newPass }),
      })
      if (res.status === 401) {
        setChangePassError(lang === 'fr' ? 'Mot de passe actuel incorrect' : 'Wrong current password')
        return
      }
      if (!res.ok) {
        setChangePassError(lang === 'fr' ? 'Erreur' : 'Error')
        return
      }
      setPass(newPass)
      setNewPass('')
      setConfirmNewPass('')
      setChangePassSuccess(true)
      setTimeout(() => { setShowChangePass(false); setChangePassSuccess(false) }, 2000)
    } catch {
      setChangePassError(lang === 'fr' ? 'Erreur de connexion' : 'Connection error')
    }
  }

  // ── Login screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <section className="min-h-screen bg-mint/30 px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-sm">
          <div className="rounded-2xl border border-navy/5 bg-white p-8 shadow-soft">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LogIn className="h-7 w-7" />
              </span>
            </div>
            <h1 className="mt-5 text-center font-display text-2xl font-bold text-navy">{t('admin.title')}</h1>
            <p className="mt-2 text-center text-sm text-navy/60">{t('admin.subtitle')}</p>
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">{error}</p>
            )}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setError('') }}
                  placeholder={t('admin.passwordPlaceholder')}
                  className="field w-full pr-11" autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 transition-colors hover:text-navy/60"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <motion.button type="submit" className="btn-primary w-full" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading}>
                {loading ? t('admin.loading') : t('admin.login')}
              </motion.button>
            </form>
            <button
              type="button"
              onClick={() => setShowChangePass(true)}
              className="mt-4 block w-full text-center text-xs text-primary/70 transition-colors hover:text-primary hover:underline"
            >
              {t('admin.forgotPassword')}
            </button>
          </div>
        </motion.div>
      </section>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-mint/30 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">{t('admin.dashboard')}</h1>
            <p className="mt-1 text-sm text-navy/60">{t('admin.total', { count: reservations.length })}</p>
          </div>
          <div className="flex gap-2">
            {(countPending + countOverdue) > 0 && (
              <motion.button onClick={handleRemindAll} className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Bell className="h-4 w-4" />
                {t('admin.remindAll', { count: countPending + countOverdue })}
              </motion.button>
            )}
            <motion.button onClick={fetchReservations} className="flex items-center gap-2 rounded-xl border border-navy/10 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const counts = { all: reservations.length, sent: countSent, pending: countPending, overdue: countOverdue }
            return (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-navy/60 border border-navy/10 hover:bg-navy/5'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab === 'all' && <Filter className="h-3.5 w-3.5" />}
                {tab === 'sent' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {tab === 'pending' && <Bell className="h-3.5 w-3.5" />}
                {tab === 'overdue' && <AlertTriangle className="h-3.5 w-3.5" />}
                {t(`admin.tab.${tab}`)}
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab ? 'bg-white/25' : 'bg-navy/10'}`}>
                  {counts[tab]}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Delete All Sent button — only on sent tab */}
        {activeTab === 'sent' && countSent > 0 && (
          <div className="mt-4">
            <motion.button
              onClick={() => setConfirmDelete('all-sent')}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Trash2 className="h-4 w-4" />
              {t('admin.deleteAllSent')}
            </motion.button>
          </div>
        )}

        {/* Reservation list */}
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onRemind={handleRemind}
                onDelete={handleDelete}
                lang={lang}
                isPast={isPast(r.date)}
                showDelete={r.reminded || isPast(r.date)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg text-navy/40">{t('admin.empty')}</p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <Trash2 className="h-6 w-6" />
                </span>
              </div>
              <h3 className="mt-4 text-center font-display text-lg font-bold text-navy">
                {confirmDelete === 'all-sent' ? t('admin.confirmDeleteAll') : t('admin.confirmDelete')}
              </h3>
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-xl border border-navy/10 px-4 py-2.5 text-sm font-semibold text-navy/60 transition-colors hover:bg-navy/5"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t('admin.cancel')}
                </motion.button>
                <motion.button
                  onClick={confirmDeleteAction}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t('admin.delete')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change password modal */}
      <AnimatePresence>
        {showChangePass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={() => { setShowChangePass(false); setChangePassError(''); setChangePassSuccess(false); setNewPass(''); setConfirmNewPass('') }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <KeyRound className="h-6 w-6" />
                </span>
              </div>
              <h3 className="mt-4 text-center font-display text-lg font-bold text-navy">
                {t('admin.changePassword')}
              </h3>
              {changePassSuccess ? (
                <p className="mt-4 rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-600">
                  {lang === 'fr' ? 'Mot de passe modifié !' : 'Password changed!'}
                </p>
              ) : (
                <form onSubmit={handleChangePassword} className="mt-6 space-y-3">
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => { setNewPass(e.target.value); setChangePassError('') }}
                      placeholder={t('admin.newPassword')}
                      className="field w-full pr-11"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmNewPass}
                      onChange={(e) => { setConfirmNewPass(e.target.value); setChangePassError('') }}
                      placeholder={t('admin.confirmPassword')}
                      className="field w-full pr-11"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {changePassError && (
                    <p className="rounded-xl bg-red-50 p-2.5 text-center text-sm font-medium text-red-600">{changePassError}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => { setShowChangePass(false); setChangePassError(''); setNewPass(''); setConfirmNewPass('') }}
                      className="flex-1 rounded-xl border border-navy/10 px-4 py-2.5 text-sm font-semibold text-navy/60 transition-colors hover:bg-navy/5"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t('admin.cancel')}
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t('admin.save')}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/** Calculate days until/from a reservation date */
function getDaysLabel(dateStr, lang) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const resDate = new Date(dateStr + 'T00:00:00')
  const diffMs = resDate - today
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return lang === 'fr' ? "Aujourd'hui" : 'Today'
  } else if (diffDays === 1) {
    return lang === 'fr' ? 'Demain' : 'Tomorrow'
  } else if (diffDays === -1) {
    return lang === 'fr' ? 'Hier' : 'Yesterday'
  } else if (diffDays > 0) {
    return lang === 'fr' ? `Dans ${diffDays} jours` : `In ${diffDays} days`
  } else {
    return lang === 'fr' ? `Il y a ${Math.abs(diffDays)} jours` : `${Math.abs(diffDays)} days ago`
  }
}

/** Color class for the countdown badge */
function getDaysColor(diffDays) {
  if (diffDays === 0) return 'bg-blue-100 text-blue-700'
  if (diffDays === 1) return 'bg-amber-100 text-amber-700'
  if (diffDays > 1) return 'bg-primary/10 text-primary'
  return 'bg-navy/10 text-navy/50'
}

/** Single reservation card */
function ReservationCard({ reservation: r, onRemind, onDelete, lang, isPast: isPastDate, showDelete }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const resDate = new Date(r.date + 'T00:00:00')
  const diffDays = Math.round((resDate - today) / (1000 * 60 * 60 * 24))
  const daysLabel = getDaysLabel(r.date, lang)
  const daysColor = getDaysColor(diffDays)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`rounded-2xl border bg-white p-5 shadow-soft ${
        r.reminded ? 'border-green-200 opacity-70' : isPastDate ? 'border-amber-200' : 'border-navy/5'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-navy/40" />
            <span className="font-bold text-navy">{r.name}</span>
            {r.reminded && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                {lang === 'fr' ? 'Envoyé' : 'Sent'}
              </span>
            )}
            {isPastDate && !r.reminded && (
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
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${daysColor}`}>
              {daysLabel}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {r.service}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showDelete && (
            <motion.button
              onClick={() => onDelete(r.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-navy/10 text-navy/40 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={lang === 'fr' ? 'Supprimer' : 'Delete'}
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}

          <motion.button
            onClick={() => onRemind(r)}
            className={`flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm ${
              r.reminded ? 'bg-navy/30' : 'bg-[#25D366] hover:bg-[#20bd5a]'
            }`}
            whileHover={r.reminded ? {} : { scale: 1.05 }}
            whileTap={r.reminded ? {} : { scale: 0.95 }}
          >
            <MessageCircle className="h-4 w-4" />
            {r.reminded
              ? (lang === 'fr' ? 'Renvoyer' : 'Resend')
              : (lang === 'fr' ? 'Rappeler' : 'Remind')
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
