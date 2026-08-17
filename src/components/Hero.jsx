import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Sparkles, Stethoscope } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'
import { fadeInUp, staggerContainer, viewport } from '../animations'

/** Hero right-side image with floating stat cards. */
function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-accent-light via-mint to-primary/10 blur-2xl" />

      <motion.div
        className="absolute -left-2 top-8 z-10 hidden rounded-2xl bg-white px-4 py-3 shadow-card sm:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-primary">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold text-navy">98%</p>
            <p className="text-[10px] text-navy/60">Satisfaction</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-2 bottom-10 z-10 hidden rounded-2xl bg-white px-4 py-3 shadow-card sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold text-navy">15000+</p>
            <p className="text-[10px] text-navy/60">Smiles</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="overflow-hidden rounded-3xl shadow-card"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <img
          src="/images/dr-1.png"
          alt="SmileCare dental team"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  )
}

/** Parallax floating shapes behind the hero */
function ParallaxShapes() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 600], [0, -120])
  const y2 = useTransform(scrollY, [0, 600], [0, -60])
  const y3 = useTransform(scrollY, [0, 600], [0, -90])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-accent-light blur-3xl"
        style={{ y: y2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-mint/60 blur-3xl"
        style={{ y: y3 }}
      />
      {/* Subtle tooth outlines */}
      <motion.svg
        className="absolute right-12 top-20 h-16 w-16 text-primary/8"
        style={{ y: y2 }}
        viewBox="0 0 64 64"
      >
        <path
          fill="currentColor"
          d="M32 46c-1.2 0-2.2-.5-3.2-1.4-3.4-3-8.5-7.7-8.5-14.9 0-4.7 3.6-8.4 8.3-8.4 2.1 0 3.7 1.1 4.5 2.2.7-1.1 2.3-2.2 4.4-2.2 4.7 0 8.3 3.7 8.3 8.4 0 7.2-5.1 11.9-8.5 14.9-.9.9-2 1.4-3.3 1.4z"
        />
      </motion.svg>
      <motion.svg
        className="absolute bottom-24 left-8 h-10 w-10 text-primary/6"
        style={{ y: y1 }}
        viewBox="0 0 64 64"
      >
        <path
          fill="currentColor"
          d="M32 46c-1.2 0-2.2-.5-3.2-1.4-3.4-3-8.5-7.7-8.5-14.9 0-4.7 3.6-8.4 8.3-8.4 2.1 0 3.7 1.1 4.5 2.2.7-1.1 2.3-2.2 4.4-2.2 4.7 0 8.3 3.7 8.3 8.4 0 7.2-5.1 11.9-8.5 14.9-.9.9-2 1.4-3.3 1.4z"
        />
      </motion.svg>
    </div>
  )
}

/** Hero section with typewriter headline, staggered subtitle & CTAs, parallax bg. */
export default function Hero() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  // Full headline text (used for typewriter)
  const fullHeadline = `${t('hero.title1')} ${t('hero.titleHighlight')}`
  const title1 = t('hero.title1')

  // Typewriter: re-triggers on language change via `lang` dependency
  const { displayed, isComplete } = useTypewriter(fullHeadline, 32, true)

  // Determine how many chars of the displayed text belong to title1 vs highlight
  const title1Len = title1.length + 1 // +1 for the space separator
  const title1Part = displayed.slice(0, title1Len)
  const highlightPart = displayed.slice(title1Len)

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      <ParallaxShapes />

      <div className="container-site grid items-center gap-14 lg:grid-cols-2">
        {/* Text content */}
        <div>
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

          {/* Typewriter headline */}
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            {displayed && (
              <>
                <span>{title1Part}</span>
                {highlightPart && (
                  <span className="relative inline-block text-primary">
                    {highlightPart}
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M2 9C60 3 160 2 298 7" stroke="#BDE0DF" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
                {/* Blinking cursor */}
                {!isComplete && (
                  <span className="animate-blink ml-0.5 text-primary">|</span>
                )}
              </>
            )}
          </h1>

          {/* Subtitle — fades in AFTER typewriter completes */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs — stagger in after subtitle */}
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate={isComplete ? 'visible' : 'hidden'}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <motion.a href="#reservation" className="btn-primary" variants={fadeInUp}>
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </motion.a>
            <motion.a href="#services" className="btn-secondary" variants={fadeInUp}>
              {t('hero.ctaSecondary')}
            </motion.a>
          </motion.div>

          {/* Trust features — stagger in last */}
          <motion.ul
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate={isComplete ? 'visible' : 'hidden'}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
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
        </div>

        {/* Illustration */}
        <HeroIllustration />
      </div>
    </section>
  )
}
