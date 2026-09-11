import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Stethoscope } from 'lucide-react'
import { fadeInUp, staggerContainer, viewport } from '../animations'

const HERO_BACKGROUNDS = [
  '/images/back1.webp',
  '/images/back2.webp',
  '/images/back3.webp',
]

const HERO_PHONE_BACKGROUNDS = [
  '/images/backphone1.webp',
  '/images/backphone2.webp',
  '/images/backphone3.webp',
]

const SLIDE_DURATION = 5500 // ms per image (crossfade overlap covered inside the fade)

/** Crossfading background — loops endlessly via a timed index.
 *  All images stay mounted as stacked layers: the next one fades UP over
 *  the current one which fades DOWN (fully overlapped, no blank frame). */
function HeroBackground({ images }) {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [reducedMotion, images.length])

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => {
        const isActive = i === index
        return (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: reducedMotion ? 1 : isActive ? 1.08 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: { duration: isActive ? SLIDE_DURATION / 1000 : 1.2, ease: isActive ? 'linear' : 'easeInOut' },
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      })}
    </div>
  )
}

/** Hero section with static headline, staggered subtitle & CTAs. */
export default function Hero({ splashDone = false }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  // Subtitle/CTAs wait for the splash before appearing
  const ready = splashDone

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* Rotating background images — desktop */}
      <div className="absolute inset-0 -z-10 hidden sm:block">
        <HeroBackground images={HERO_BACKGROUNDS} />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
      </div>

      {/* Background images — phone only */}
      <div className="absolute inset-0 -z-10 sm:hidden">
        <HeroBackground images={HERO_PHONE_BACKGROUNDS} />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="container-site">
        {/* Text content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge — fades in immediately */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft"
          >
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
            {t('hero.badge')}
          </motion.div>

          {/* Profile photo — centered under the badge, rounded, matches home style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative mx-auto mt-8 block w-fit"
          >
            <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-accent-light via-mint to-primary/20 blur-2xl" aria-hidden="true" />

            {/* Pulse rings — pure CSS animation, expands smoothly, fades out, then hides before repeating */}
            <span className="pulse-ring absolute -inset-1 rounded-full border-2 border-primary/70" aria-hidden="true" />
            <span className="pulse-ring-delayed absolute -inset-1 rounded-full border-2 border-primary/70" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-full bg-gradient-to-tr from-primary via-accent to-primary-dark p-1.5 shadow-card">
              <div className="overflow-hidden rounded-full">
                <img
                  src="/images/profile-hero.webp"
                  alt={t('hero.profileAlt')}
                  className="h-44 w-44 object-cover sm:h-56 sm:w-56"
                />
              </div>
            </div>

            {/* Verified badge — bottom-right edge, white bg, gold check, pop-in bounce, fixed in place */}
            <motion.span
              className="absolute bottom-4 right-3 z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 1.1 }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card sm:h-10 sm:w-10">
                <BadgeCheck className="h-6 w-6 fill-primary text-white sm:h-7 sm:w-7" aria-hidden="true" />
              </span>
            </motion.span>
          </motion.div>

          {/* Static headline — stable height, one-time fade+rise on mount */}
          <motion.h1
            key={lang}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
            className="mt-6 min-h-[5.5rem] font-display text-4xl font-bold leading-tight text-navy sm:min-h-[6.5rem] lg:min-h-[7rem] sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.title1')}{' '}
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </motion.h1>

          {/* Subtitle — fades in after splash */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-navy/70"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs — stagger in after subtitle */}
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate={ready ? 'visible' : 'hidden'}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <motion.a href="#reservation" className="btn-primary w-full sm:w-auto" variants={fadeInUp}>
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </motion.a>
            <motion.a href="#services" className="btn-secondary w-full sm:w-auto" variants={fadeInUp}>
              {t('hero.ctaSecondary')}
            </motion.a>
          </motion.div>

          {/* Trust features — stagger in last */}
          <motion.ul
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate={ready ? 'visible' : 'hidden'}
            className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3"
          >
            {['feature1', 'feature2', 'feature3'].map((key) => (
              <motion.li
                key={key}
                variants={fadeInUp}
                className="flex items-center gap-2 text-sm font-medium text-navy/70"
              >
                <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {t(`hero.${key}`)}
              </motion.li>
            ))}
          </motion.ul>

          {/* Google rating badge */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={ready ? 'visible' : 'hidden'}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/5 bg-white px-4 py-2 shadow-soft"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.62H1.29a12.01 12.01 0 0 0 0 10.76l3.98-3.09z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.95 11.95 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.85 8.87 4.75 12 4.75z" />
            </svg>
            <span className="text-amber-400" aria-hidden="true">★★★★★</span>
            <span className="text-sm font-bold text-navy">5,0/5</span>
            <span className="text-sm text-navy/70">· {t('hero.googleReviews')}</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
