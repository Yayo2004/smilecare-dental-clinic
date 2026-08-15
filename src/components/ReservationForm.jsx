import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  PartyPopper,
  Phone,
  Send,
  User,
  Wrench,
} from 'lucide-react'
import Reveal from './Reveal'
import { buildWhatsAppLink, CLINIC_INFO } from '../config'

const PHONE_RE = /^[+0-9 ()/.-]{6,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: '',
  message: '',
}

/** Reservation form: validates client-side, then opens WhatsApp with a pre-filled message. */
export default function ReservationForm() {
  const { t } = useTranslation()

  const services = t('form.servicesOptions', { returnObjects: true })
  const timeSlots = t('form.timeOptions', { returnObjects: true })

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success

  // Minimum selectable date = today, formatted as YYYY-MM-DD
  const today = useMemo(() => {
    const d = new Date()
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 10)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    // Clear the error for this field once the user edits it
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  /** Client-side validation with translated error messages. */
  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) nextErrors.name = t('form.validation.name')
    if (!form.phone.trim()) nextErrors.phone = t('form.validation.phone')
    else if (!PHONE_RE.test(form.phone.trim())) nextErrors.phone = t('form.validation.phoneInvalid')
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      nextErrors.email = t('form.validation.email')
    }
    if (!form.service) nextErrors.service = t('form.validation.service')
    if (!form.date) nextErrors.date = t('form.validation.date')
    if (!form.time) nextErrors.time = t('form.validation.time')
    return nextErrors
  }

  /** Build the pre-filled WhatsApp message in the current language. */
  const buildMessage = () => {
    const n = t('form.notes', { returnObjects: true })
    const lines = [
      n.greeting,
      '',
      n.request,
      `${n.name}: ${form.name.trim()}`,
      `${n.phone}: ${form.phone.trim()}`,
      form.email.trim() ? `${n.email}: ${form.email.trim()}` : null,
      `${n.service}: ${form.service}`,
      `${n.date}: ${form.date}`,
      `${n.time}: ${form.time}`,
      form.message.trim() ? `${n.message}: ${form.message.trim()}` : null,
      '',
      `— ${n.from}`,
    ]
    return lines.filter(Boolean).join('\n')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('sending')

    // Small delay so the loading state is visible before opening WhatsApp
    window.setTimeout(() => {
      const message = buildMessage()
      window.open(buildWhatsAppLink(CLINIC_INFO.whatsappNumber, message), '_blank', 'noopener,noreferrer')
      setStatus('success')
      setForm(EMPTY_FORM)
    }, 900)
  }

  const resetForm = () => {
    setStatus('idle')
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const fieldError = (name) => (
    <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-500">
      {errors[name]}
    </p>
  )

  return (
    <section id="reservation" className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Soft gradient accents */}
      <div className="pointer-events-none absolute -right-40 top-10 -z-0 h-96 w-96 rounded-full bg-mint/70 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-10 -z-0 h-96 w-96 rounded-full bg-accent-light/60 blur-3xl" />

      <div className="container-site relative">
        {/* Section header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t('form.eyebrow')}
          </span>
          <h2 className="section-title mt-4">{t('form.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('form.subtitle')}</p>
        </Reveal>

        {/* Success panel (replaces the form once a request is sent) */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mx-auto mt-14 max-w-xl rounded-2xl border border-primary/20 bg-mint/60 p-10 text-center shadow-soft"
              role="status"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PartyPopper className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-navy">
                {t('form.successTitle')}
              </h3>
              <p className="mt-3 text-navy/70">{t('form.successMessage')}</p>
              <p className="mt-2 text-sm text-navy/50">{t('form.successSub')}</p>
              <button type="button" onClick={resetForm} className="btn-secondary mt-7">
                {t('form.tryAgain')}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto mt-14 max-w-3xl rounded-2xl border border-navy/5 bg-white p-6 shadow-soft sm:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label htmlFor="name" className="label">
                    {t('form.name')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                      className={`field pl-11 ${errors.name ? 'field-error' : ''}`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </div>
                  {fieldError('name')}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="label">
                    {t('form.phone')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t('form.phonePlaceholder')}
                      className={`field pl-11 ${errors.phone ? 'field-error' : ''}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {fieldError('phone')}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="label">
                    {t('form.email')}
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('form.emailPlaceholder')}
                      className={`field pl-11 ${errors.email ? 'field-error' : ''}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {fieldError('email')}
                </div>

                {/* Service dropdown */}
                <div>
                  <label htmlFor="service" className="label">
                    {t('form.service')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Wrench
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`field appearance-none pl-11 pr-10 ${errors.service ? 'field-error' : ''}`}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? 'service-error' : undefined}
                    >
                      <option value="" disabled>
                        {t('form.servicePlaceholder')}
                      </option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {fieldError('service')}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="label">
                    {t('form.date')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    className={`field ${errors.date ? 'field-error' : ''}`}
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                  />
                  {fieldError('date')}
                </div>

                {/* Time dropdown */}
                <div>
                  <label htmlFor="time" className="label">
                    {t('form.time')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <select
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className={`field appearance-none pl-11 pr-10 ${errors.time ? 'field-error' : ''}`}
                      aria-invalid={!!errors.time}
                      aria-describedby={errors.time ? 'time-error' : undefined}
                    >
                      <option value="" disabled>
                        {t('form.timePlaceholder')}
                      </option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {fieldError('time')}
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="label">
                    {t('form.message')}
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-navy/35"
                      aria-hidden="true"
                    />
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      className="field resize-none pl-11"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy note */}
              <p className="mt-5 flex items-start gap-2 text-sm text-navy/50">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {t('form.privacy')}
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    {t('form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" aria-hidden="true" />
                    {t('form.submit')}
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
