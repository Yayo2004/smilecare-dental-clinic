import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Anchor, Braces, CalendarCheck, ShieldCheck, Sparkles, X, Syringe } from 'lucide-react'
import { fadeInUp, staggerContainer, viewport } from '../animations'

/** Simple line icon for the tooth service (no lucide Tooth icon) — matches lucide stroke style. */
function ToothIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5.5c-1.5-1-3-1.5-4.5-1.5C5 4 3.5 5.5 3.5 8c0 4 2 11 4 11 1 0 1-2 2-3s1.5-.5 2.5-.5 1.5-.5 2.5.5 1 3 2 3c2 0 4-7 4-11 0-2.5-1.5-4-4-4-1.5 0-3 .5-4.5 1.5z" />
    </svg>
  )
}

/** Matches each service theme: tooth, implant, sparkle, braces, root canal, shield. */
const ICONS = [ToothIcon, Anchor, Sparkles, Braces, Syringe, ShieldCheck]

/** Gel per-card entrance — subtle rise, per spec (opacity 0→1, y 20→0). */
const cardUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Services grid — clean minimal numbered cells, thin hairline separators. */
export default function Services() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const services = t('services.items', { returnObjects: true })
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  const handleReserve = () => {
    setActive(null)
    setTimeout(() => {
      const el = document.getElementById('reservation')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 350)
  }

  const activeService = active !== null ? services[active] : null

  return (
    <section id="services" key={lang} className="bg-white py-20 lg:py-28">
      <div className="container-site">
        {/* Section header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">{t('services.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('services.subtitle')}</p>
        </motion.div>

        {/* Numbered grid — hairline dividers via gap-px + tinted background */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-navy/10 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service, i) => {
            const Icon = ICONS[i % ICONS.length]
            const number = String(i + 1).padStart(2, '0')
            return (
              <motion.button
                key={service.name}
                type="button"
                variants={cardUp}
                onClick={() => setActive(i)}
                className="group relative bg-white p-8 text-left transition-colors duration-300 hover:bg-mint/60 sm:p-10"
                aria-haspopup="dialog"
                aria-expanded={active === i}
              >
                {/* Subtle number, top-right */}
                <span className="absolute right-8 top-8 text-sm font-semibold tracking-widest text-navy/30 transition-colors duration-300 group-hover:text-primary/60">
                  {number}
                </span>

                {/* Decorative arrow, revealed on hover */}
                <span className="absolute right-8 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>

                {/* Small line icon — scales up on hover */}
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 text-primary transition-transform duration-300 ease-out group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </span>

                <h3 className="mt-6 font-display text-2xl font-bold text-navy transition-colors duration-300 group-hover:text-primary">
                  {service.name}
                </h3>

                <p className="mt-3 line-clamp-2 leading-relaxed text-navy/70">
                  {service.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t('services.learnMore')}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* Service popup — smooth, attractive */}
      <AnimatePresence>
        {active !== null && activeService && (
          <motion.div
            key="service-modal"
            className="fixed inset-0 z-[90] flex items-end justify-center bg-navy/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top band */}
              <div className="relative bg-gradient-to-tr from-primary to-primary-light px-7 pb-8 pt-7 sm:px-9">
                <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15" />
                <div className="pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-white/10" />

                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:rotate-90 hover:bg-white/30"
                  aria-label={t('services.modalClose')}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="relative">
                  <span className="text-sm font-semibold tracking-widest text-white/70">
                    {String(active + 1).padStart(2, '0')} — {t('services.eyebrow')}
                  </span>
                  <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                    {(() => {
                      const Icon = ICONS[active % ICONS.length]
                      return <Icon className="h-7 w-7" />
                    })()}
                  </div>
                  <h3 id="service-modal-title" className="mt-5 font-display text-3xl font-bold text-white">
                    {activeService.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="px-7 py-7 sm:px-9">
                <p className="max-h-56 overflow-y-auto text-[1.05rem] leading-relaxed text-navy/80">
                  {activeService.detail}
                </p>

                <button
                  type="button"
                  onClick={handleReserve}
                  className="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 py-4 font-semibold text-white shadow-soft transition-all duration-300 hover:bg-primary-dark hover:shadow-card active:scale-95"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  {t('services.ctaPrimary')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}