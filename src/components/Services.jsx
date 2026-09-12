import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Anchor, Braces, ShieldCheck, Sparkles, Syringe } from 'lucide-react'
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
              <motion.div
                key={service.name}
                variants={cardUp}
                className="group relative bg-white p-8 sm:p-10"
              >
                {/* Subtle number, top-right */}
                <span className="absolute right-8 top-8 text-sm font-semibold tracking-widest text-navy/30">
                  {number}
                </span>

                {/* Small line icon — scales up on hover */}
                <Icon className="h-8 w-8 text-primary transition-transform duration-300 ease-out group-hover:scale-110" />

                <h3 className="mt-6 font-display text-2xl font-bold text-navy transition-colors duration-300 group-hover:text-primary">
                  {service.name}
                </h3>

                <p className="mt-3 line-clamp-2 leading-relaxed text-navy/70">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}