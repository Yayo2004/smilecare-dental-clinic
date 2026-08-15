import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Baby,
  Brush,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Siren,
} from 'lucide-react'
import Reveal from './Reveal'

// Icon per service, matched by index (kept in the same order as the JSON)
const ICONS = [Stethoscope, Pill, Sparkles, ShieldCheck, Baby, Siren]

const colors = [
  'bg-primary/10 text-primary',
  'bg-accent/40 text-primary-dark',
  'bg-[#FFF4E0] text-[#E08A00]',
  'bg-[#E8F0FF] text-[#3B82F6]',
  'bg-[#FFEAF0] text-[#EC4899]',
  'bg-[#FDE8E8] text-[#EF4444]',
]

/** Services grid with animated cards. */
export default function Services() {
  const { t } = useTranslation()
  const services = t('services.items', { returnObjects: true })

  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="container-site">
        {/* Section header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <Brush className="h-4 w-4" aria-hidden="true" />
            {t('services.eyebrow')}
          </span>
          <h2 className="section-title mt-4">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('services.subtitle')}</p>
        </Reveal>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <Reveal key={service.name} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
                >
                  {/* Soft hover gradient */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mint opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colors[i % colors.length]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold text-navy">
                    {service.name}
                  </h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-navy/65">
                    {service.description}
                  </p>

                  <a
                    href="#reservation"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary-dark"
                  >
                    {t('services.learnMore')}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
