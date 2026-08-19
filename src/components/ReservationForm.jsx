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
import {
  fadeInUp,
  staggerContainer,
  viewport,
} from '../animations'
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

/** SVG checkmark that draws itself */
function AnimatedCheckmark() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-primary"
      viewBox="0 0 52 52"
      aria-hidden="true"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
      />
    </svg>
  )
}

/** Animated input wrapper with focus glow */
function AnimatedField({ children, error }) {
  return (
    <motion.div
      className={`relative rounded-xl border-2 transition-colors duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(42,157,143,0.15)] ${
        error ? 'border-red-400' : 'border-navy/10'
      }`}
      whileFocus={{ scale: 1.01 }}
    >
      {children}
    </motion.div>
  )
}

/** Reservation form with animated inputs, loading spinner, and SVG checkmark success. */
export default function ReservationForm() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const services = t('form.servicesOptions', { returnObjects: true })
  const timeSlots = t('form.timeOptions', { returnObjects: true })

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const today = useMemo(() => {
    const d = new Date()
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 10)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

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
    window.setTimeout(() => {
      const message = buildMessage()
      window.open(buildWhatsAppLink(CLINIC_INFO.whatsappNumber, message), '_blank', 'noopener,noreferrer')

      // Save reservation to localStorage for the reminder system
      try {
        const existing = JSON.parse(localStorage.getItem('clinic_reservations') || '[]')
        existing.push({
          name: form.name.trim(),
          phone: form.phone.trim(),
          service: form.service,
          date: form.date,
          time: form.time,
          reminded: false,
          createdAt: new Date().toISOString(),
        })
        localStorage.setItem('clinic_reservations', JSON.stringify(existing))
      } catch { /* silently ignore localStorage errors */ }

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

  const inputClass = (name) =>
    `w-full bg-transparent px-4 py-3 pl-11 text-sm text-navy outline-none placeholder:text-navy/40 ${errors[name] ? 'text-red-500' : ''}`

  return (
    <section id="reservation" key={lang} className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-40 top-10 -z-0 h-96 w-96 rounded-full bg-mint/70 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-10 -z-0 h-96 w-96 rounded-full bg-accent-light/60 blur-3xl" />

      <div className="container-site relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t('form.eyebrow')}
          </span>
          <h2 className="section-title mt-4">{t('form.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('form.subtitle')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-14 max-w-xl rounded-2xl border border-primary/20 bg-mint/60 p-10 text-center shadow-soft"
              role="status"
            >
              <AnimatedCheckmark />
              <h3 className="mt-5 font-display text-2xl font-bold text-navy">
                {t('form.successTitle')}
              </h3>
              <p className="mt-3 text-navy/70">{t('form.successMessage')}</p>
              <p className="mt-2 text-sm text-navy/50">{t('form.successSub')}</p>
              <motion.button
                type="button"
                onClick={resetForm}
                className="btn-secondary mt-7"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('form.tryAgain')}
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-14 max-w-3xl rounded-2xl border border-navy/5 bg-white p-6 shadow-soft sm:p-9"
            >
              <motion.div
                className="grid gap-5 sm:grid-cols-2"
                variants={staggerContainer(0.08)}
                initial="hidden"
                animate="visible"
              >
                {/* Full name */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="name" className="label">
                    {t('form.name')} <span className="text-red-500">*</span>
                  </label>
                  <AnimatedField error={errors.name}>
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
                      className={inputClass('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </AnimatedField>
                  {fieldError('name')}
                </motion.div>

                {/* Phone */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="phone" className="label">
                    {t('form.phone')} <span className="text-red-500">*</span>
                  </label>
                  <AnimatedField error={errors.phone}>
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
                      className={inputClass('phone')}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </AnimatedField>
                  {fieldError('phone')}
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeInUp} className="sm:col-span-2">
                  <label htmlFor="email" className="label">
                    {t('form.email')}
                  </label>
                  <AnimatedField error={errors.email}>
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
                      className={inputClass('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </AnimatedField>
                  {fieldError('email')}
                </motion.div>

                {/* Service dropdown */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="service" className="label">
                    {t('form.service')} <span className="text-red-500">*</span>
                  </label>
                  <AnimatedField error={errors.service}>
                    <Wrench
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`w-full appearance-none bg-transparent px-4 py-3 pl-11 pr-10 text-sm text-navy outline-none ${errors.service ? 'text-red-500' : ''}`}
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
                  </AnimatedField>
                  {fieldError('service')}
                </motion.div>

                {/* Date */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="date" className="label">
                    {t('form.date')} <span className="text-red-500">*</span>
                  </label>
                  <AnimatedField error={errors.date}>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={handleChange}
                      className={`w-full bg-transparent px-4 py-3 text-sm text-navy outline-none ${errors.date ? 'text-red-500' : ''}`}
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? 'date-error' : undefined}
                    />
                  </AnimatedField>
                  {fieldError('date')}
                </motion.div>

                {/* Time dropdown */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="time" className="label">
                    {t('form.time')} <span className="text-red-500">*</span>
                  </label>
                  <AnimatedField error={errors.time}>
                    <Clock
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                      aria-hidden="true"
                    />
                    <select
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className={`w-full appearance-none bg-transparent px-4 py-3 pl-11 pr-10 text-sm text-navy outline-none ${errors.time ? 'text-red-500' : ''}`}
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
                  </AnimatedField>
                  {fieldError('time')}
                </motion.div>

                {/* Message */}
                <motion.div variants={fadeInUp} className="sm:col-span-2">
                  <label htmlFor="message" className="label">
                    {t('form.message')}
                  </label>
                  <AnimatedField error={false}>
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
                      className="w-full resize-none bg-transparent px-4 py-3 pl-11 text-sm text-navy outline-none placeholder:text-navy/40"
                    />
                  </AnimatedField>
                </motion.div>
              </motion.div>

              <p className="mt-5 flex items-start gap-2 text-sm text-navy/50">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {t('form.privacy')}
              </p>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={status !== 'sending' ? { scale: 1.03 } : {}}
                whileTap={status !== 'sending' ? { scale: 0.97 } : {}}
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
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
