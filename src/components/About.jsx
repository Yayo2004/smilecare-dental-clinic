import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CalendarCheck, Quote } from 'lucide-react'
import {
  fadeInRight,
  fadeInUp,
  staggerContainer,
  viewport,
} from '../animations'

/** Animated counter that counts up when it becomes visible. */
function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-primary sm:text-5xl">
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

const DENTIST_PHOTOS = [
  { src: '/images/dr-1.png', alt: 'Dr Youssef Amrani' },
  { src: '/images/dr-2.png', alt: 'Dr Karim Idrissi' },
  { src: '/images/dr-3.png', alt: 'Dr Nadia Chraibi' },
]

/** About section — slides in FROM THE RIGHT, stat counters + team cards stagger in. */
export default function About() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const stats = t('about.stats', { returnObjects: true })
  const team = t('about.team', { returnObjects: true })

  return (
    <section id="about" key={lang} className="relative overflow-hidden bg-mint/50 py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

      <div className="container-site">
        {/* Section header — right entrance */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('about.title')}</h2>
        </motion.div>

        {/* Clinic intro */}
        <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center">
          <motion.p
            className="text-lg leading-relaxed text-navy/70"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ delay: 0.1 }}
          >
            {t('about.paragraph1')}
          </motion.p>
          <motion.p
            className="text-lg leading-relaxed text-navy/70"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ delay: 0.2 }}
          >
            {t('about.paragraph2')}
          </motion.p>
        </div>

        {/* Animated counters — stagger in from right */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInRight}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-navy/5 bg-white p-6 text-center shadow-soft"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-navy/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team */}
        <motion.h3
          className="mt-20 text-center font-display text-2xl font-bold text-navy sm:text-3xl"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {t('about.teamTitle')}
        </motion.h3>

        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-3"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              variants={fadeInRight}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative h-full rounded-2xl border border-navy/5 bg-white p-7 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="absolute left-5 top-5 rounded-full bg-mint/70 p-2 text-primary">
                <Quote className="h-4 w-4" aria-hidden="true" />
              </span>
              <img
                src={DENTIST_PHOTOS[i % DENTIST_PHOTOS.length].src}
                alt={DENTIST_PHOTOS[i % DENTIST_PHOTOS.length].alt}
                className="mx-auto h-44 w-44 rounded-full object-cover object-top shadow-card sm:h-52 sm:w-52"
                loading="lazy"
              />
              <h4 className="mt-5 font-display text-lg font-bold text-navy">{member.name}</h4>
              <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
              <p className="mt-3 leading-relaxed text-navy/65">{member.bio}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ delay: 0.3 }}
        >
          <motion.a
            href="#reservation"
            className="btn-primary inline-flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            {t('about.cta')}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
