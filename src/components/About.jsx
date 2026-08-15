import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CalendarCheck, Quote } from 'lucide-react'
import Reveal from './Reveal'

/**
 * Animated counter that counts up when it becomes visible.
 */
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
      // Ease-out curve for a satisfying count-up
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

/** Avatar initials circle used in dentist bio cards. */
function Avatar({ name }) {
  const initials = name
    .replace(/^(Dr|Docteur)\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  const gradients = [
    'from-primary to-primary-light',
    'from-[#4FB3BF] to-[#2A9D8F]',
    'from-[#3B82F6] to-[#4FB3BF]',
  ]

  return (
    <span
      className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white shadow-card ${gradients[Math.abs(name.length) % gradients.length]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

/** About / Team section with animated stats and dentist bios. */
export default function About() {
  const { t } = useTranslation()
  const stats = t('about.stats', { returnObjects: true })
  const team = t('about.team', { returnObjects: true })

  return (
    <section id="about" className="relative overflow-hidden bg-mint/50 py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

      <div className="container-site">
        {/* Section header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('about.title')}</h2>
        </Reveal>

        {/* Clinic intro */}
        <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-navy/70">{t('about.paragraph1')}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-lg leading-relaxed text-navy/70">{t('about.paragraph2')}</p>
          </Reveal>
        </div>

        {/* Animated counters */}
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-navy/5 bg-white p-6 text-center shadow-soft">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-navy/60">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Team */}
        <Reveal className="mt-20 text-center">
          <h3 className="font-display text-2xl font-bold text-navy sm:text-3xl">
            {t('about.teamTitle')}
          </h3>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.12}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative h-full rounded-2xl border border-navy/5 bg-white p-7 text-center shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="absolute left-5 top-5 rounded-full bg-mint/70 p-2 text-primary">
                  <Quote className="h-4 w-4" aria-hidden="true" />
                </span>
                <Avatar name={member.name} />
                <h4 className="mt-5 font-display text-lg font-bold text-navy">{member.name}</h4>
                <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
                <p className="mt-3 leading-relaxed text-navy/65">{member.bio}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-14 text-center">
          <a href="#reservation" className="btn-primary">
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            {t('about.cta')}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
