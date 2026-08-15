import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Sparkles, Stethoscope } from 'lucide-react'

/** Animated tooth + medical cross illustration drawn with SVG. */
function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      {/* Soft gradient blob behind the illustration */}
      <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-br from-accent-light via-mint to-primary/10 blur-2xl" />

      {/* Floating decorative cards */}
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

      {/* Main tooth illustration */}
      <motion.svg
        viewBox="0 0 400 400"
        className="w-full animate-float"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <defs>
          <linearGradient id="toothGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#DFF0EF" />
          </linearGradient>
          <linearGradient id="rootGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A9D8F" />
            <stop offset="100%" stopColor="#21867A" />
          </linearGradient>
        </defs>

        {/* Sparkles */}
        <path d="M70 90 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill="#2A9D8F" opacity="0.5" />
        <path d="M330 120 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#4FB3BF" opacity="0.6" />

        {/* Dental roots */}
        <path d="M180 220 q-6 55 -38 92 q8 -2 12 -10 q6 36 8 56 q1 10 8 10 q7 0 8 -10 q2 -28 2 -28 q0 0 2 28 q1 10 8 10 q7 0 8 -10 q2 -20 8 -56 q4 8 12 10 q-32 -37 -38 -92 z" fill="url(#rootGrad)" opacity="0.9" />
        <path d="M180 220 q-6 55 -38 92 q8 -2 12 -10 q6 36 8 56 q1 10 8 10 q7 0 8 -10 q2 -28 2 -28 q0 0 2 28 q1 10 8 10 q7 0 8 -10 q2 -20 8 -56 q4 8 12 10 q-32 -37 -38 -92 z" fill="url(#rootGrad)" opacity="0.15" transform="translate(40 0) scale(0.8 0.9) translate(-60 0)" />

        {/* Tooth crown */}
        <path d="M200 78 q-70 -22 -112 14 q-38 33 -18 88 q12 34 42 46 q22 9 88 10 q66 -1 88 -10 q30 -12 42 -46 q20 -55 -18 -88 q-42 -36 -112 -14 z" fill="url(#toothGrad)" stroke="#2A9D8F" strokeWidth="3" />

        {/* Tooth shine */}
        <ellipse cx="160" cy="130" rx="34" ry="18" fill="#FFFFFF" opacity="0.7" transform="rotate(-18 160 130)" />
        <circle cx="252" cy="108" r="5" fill="#FFFFFF" opacity="0.9" />

        {/* Medical cross on the crown */}
        <g>
          <rect x="224" y="84" width="12" height="36" rx="3" fill="#2A9D8F" />
          <rect x="212" y="96" width="36" height="12" rx="3" fill="#2A9D8F" />
        </g>
      </motion.svg>
    </div>
  )
}

/** Hero section with headline, CTAs and animated illustration. */
export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-accent-light blur-3xl" />
      </div>

      <div className="container-site grid items-center gap-14 lg:grid-cols-2">
        {/* Text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft"
          >
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.title1')}{' '}
            <span className="relative inline-block text-primary">
              {t('hero.titleHighlight')}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C60 3 160 2 298 7"
                  stroke="#BDE0DF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a href="#reservation" className="btn-primary">
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#services" className="btn-secondary">
              {t('hero.ctaSecondary')}
            </a>
          </motion.div>

          {/* Trust features */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {['feature1', 'feature2', 'feature3'].map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm font-medium text-navy/70">
                <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {t(`hero.${key}`)}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  )
}
