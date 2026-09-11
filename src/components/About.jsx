import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Play, X, ZoomIn } from 'lucide-react'
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer, viewport } from '../animations'
import { CLINIC_INFO } from '../config'

/** Animated counter that counts up when it becomes visible. */
function Counter({ value, suffix, className = 'text-4xl sm:text-5xl' }) {
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
    <span ref={ref} className={`font-display font-bold text-primary ${className}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

const CABINET_PHOTOS = [
  { src: '/images/cab-1.webp', alt: 'Salle de soins du cabinet du Dr Myriam Lahlou à Casablanca' },
  { src: '/images/cab-2.webp', alt: "Espace d'accueil du cabinet dentaire Dr Myriam Lahlou à Casablanca" },
  { src: '/images/cab-3.webp', alt: "Salle d'attente du cabinet du Dr Myriam Lahlou à Casablanca" },
]

/** Rotating cabinet gallery — desktop only. Photos swap positions smoothly. */
function RotatingGallery({ onPhotoClick }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setOffset((o) => o + 1), 3500)
    return () => window.clearInterval(id)
  }, [])

  const order = [0, 1, 2].map((i) => CABINET_PHOTOS[(i + offset) % CABINET_PHOTOS.length])
  const [main, rightTop, rightBottom] = order

  return (
    <div className="grid grid-cols-2 gap-4" aria-live="polite">
      {[main, rightTop, rightBottom].map((photo, slot) => (
        <motion.button
          key={photo.src}
          type="button"
          layout
          onClick={() => onPhotoClick(photo)}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative cursor-zoom-in overflow-hidden rounded-2xl shadow-card text-left ${slot === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-[4/3]'}`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/10" />
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-navy shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </span>
        </motion.button>
      ))}
    </div>
  )
}

// Embed of the real Instagram Reel of the clinic interior.
const INSTAGRAM_REEL_EMBED_URL = 'https://www.instagram.com/reel/C-VbJ0XqaOG/embed'

/** About — brand story, cabinet photos, animated stats + Instagram Reel modal. */
export default function About() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const stats = t('about.stats', { returnObjects: true })
  const [reelOpen, setReelOpen] = useState(false)
  const [zoomPhoto, setZoomPhoto] = useState(null)

  useEffect(() => {
    if (!reelOpen && !zoomPhoto) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setReelOpen(false)
        setZoomPhoto(null)
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [reelOpen, zoomPhoto])

  return (
    <section id="about" key={lang} className="relative overflow-hidden bg-mint/50 py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

      <div className="container-site">
        {/* Section header — À propos — fade in up */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="section-title">{t('about.sectionTitle')}</h2>
        </motion.div>

        {/* Practitioner block — photo left, text right */}
        <div className="mt-16 grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          {/* Photo — slides in from the left */}
          <motion.div
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Decorative blurred shapes behind the photo */}
            <div className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
            <div className="group relative overflow-hidden rounded-2xl border border-navy/5 shadow-soft transition-shadow duration-300 hover:shadow-card">
              <motion.img
                src="/images/practitioner.webp"
                alt={t('about.practitioner.name')}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
                whileHover={{ scale: 1.045 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/25" />
            </div>
          </motion.div>

          {/* Text — slides in from the right, slightly delayed */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            >
              {t('about.practitioner.eyebrow')}
            </motion.span>
            <motion.h3
              className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
            >
              {t('about.practitioner.name')}
            </motion.h3>
            <motion.p
              className="mt-3 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-primary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            >
              {t('about.practitioner.specialties')}
            </motion.p>
            <motion.p
              className="mt-6 text-lg leading-relaxed text-navy/75 text-justify"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            >
              {t('about.practitioner.paragraph1')}
            </motion.p>
            <motion.p
              className="mt-4 text-lg leading-relaxed text-navy/75 text-justify"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.28 }}
            >
              {t('about.practitioner.paragraph2')}
            </motion.p>
          </motion.div>
        </div>

        {/* Cabinet header — Cabinet Dentaire Dr Myriam Lahlou */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="mt-3 text-lg font-medium text-primary">{t('about.subtitle')}</p>
        </motion.div>

        {/* Text (left) + Photos (right) */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              className="text-lg leading-relaxed text-navy/75 text-justify"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {t('about.paragraph1')}
            </motion.p>
            <motion.p
              className="mt-5 text-lg leading-relaxed text-navy/75 text-justify"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: 0.15 }}
            >
              {t('about.paragraph2')}
            </motion.p>
            <motion.p
              className="mt-5 text-lg leading-relaxed text-navy/75 text-justify"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ delay: 0.3 }}
            >
              {t('about.paragraph3')}
            </motion.p>

            {/* Stats under the text */}
            <motion.div
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
              variants={staggerContainer(0.12)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl border border-navy/5 bg-white p-5 text-center shadow-soft sm:col-span-1 ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <Counter value={stat.value} suffix={stat.suffix} className="text-3xl sm:text-4xl" />
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-navy/60">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Photo gallery — slides in from the right */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Rotating gallery (positions swap smoothly) — all screen sizes */}
            <RotatingGallery onPhotoClick={setZoomPhoto} />
          </motion.div>
        </div>

        {/* Instagram Reel button — below the photos */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            type="button"
            onClick={() => setReelOpen(true)}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(221,42,123,0.45)] focus:outline-none focus:ring-2 focus:ring-[#DD2A7B] focus:ring-offset-2 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <motion.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden="true" />
            </motion.span>
            {t('about.reelButton')}
          </motion.button>
        </motion.div>
      </div>

      {/* Photo zoom modal — fullscreen, animated, X to close */}
      <AnimatePresence>
        {zoomPhoto && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label={zoomPhoto.alt}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomPhoto(null)}
                className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-lg transition-all duration-200 hover:rotate-90 hover:scale-110"
                aria-label={t('about.reelClose')}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <motion.img
                key={zoomPhoto.src}
                src={zoomPhoto.src}
                alt={zoomPhoto.alt}
                className="max-h-[82vh] w-full rounded-2xl object-contain shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram Reel modal — 9:16 vertical video */}
      <AnimatePresence>
        {reelOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReelOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t('about.reelModalTitle')}
          >
            <motion.div
              className="relative w-full max-w-[420px]"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
                <div className="flex items-center justify-between bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{t('about.reelModalTitle')}</p>
                  <button
                    type="button"
                    onClick={() => setReelOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:rotate-90 hover:bg-white/25 hover:text-white"
                    aria-label={t('about.reelClose')}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="aspect-[9/16] w-full">
                  <iframe
                    src={INSTAGRAM_REEL_EMBED_URL}
                    title={t('about.reelModalTitle')}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}