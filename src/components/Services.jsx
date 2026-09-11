import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Baby, Brush, CalendarCheck, Pill, ShieldCheck, Sparkles, Stethoscope, Siren, X } from 'lucide-react'
import {
  fadeInLeft,
  fadeInUp,
  staggerContainer,
  viewport,
} from '../animations'
import Tooth from './Tooth'

const ICONS = [Stethoscope, Pill, Sparkles, ShieldCheck, Baby, Siren]

const IMAGES = [
  '/images/treat-facettes.webp',
  '/images/treat-implants.webp',
  '/images/treat-esthetique.webp',
  '/images/treat-ortho.webp',
  '/images/treat-canal.webp',
  '/images/treat-composite.webp',
]

/** Services grid — photo cards, click opens an animated detail modal. */
export default function Services() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const services = t('services.items', { returnObjects: true })
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!active) return undefined
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

  return (
    <section id="services" key={lang} className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Decorative teeth */}
      <Tooth className="pointer-events-none absolute -right-10 top-16 hidden h-56 w-56 opacity-10 object-contain lg:block" />
      <Tooth className="pointer-events-none absolute -left-8 bottom-10 hidden h-40 w-40 opacity-10 object-contain md:block" />

      <div className="container-site relative">
        {/* Section header — left entrance */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">
            <Brush className="h-4 w-4" aria-hidden="true" />
            {t('services.eyebrow')}
          </span>
          <h2 className="section-title mt-4">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('services.subtitle')}</p>
        </motion.div>

{/* Photo cards — staggered entrance, one after the other */}
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {services.map((service, i) => {
            const Icon = ICONS[i % ICONS.length]
            const image = IMAGES[i]
            return (
              <motion.div
                key={service.name}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
<motion.button
                  type="button"
                  onClick={() => setActive({ ...service, icon: Icon, image })}
                  style={{ borderRadius: '1rem 1rem 2.5rem 2.5rem' }}
                  className="block aspect-[4/3] w-full cursor-zoom-in overflow-hidden border border-navy/5 bg-white text-left shadow-soft transition-shadow duration-300 hover:shadow-card"
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt={service.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </>
                  ) : (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <span className="font-display text-xl font-bold text-navy">
                        {service.name}
                      </span>
                    </span>
                  )}
                </motion.button>

                {/* Badge icon — sits on the corner, sticking out of the card */}
                <span className="absolute -left-4 -top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-4 ring-white/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Detail modal — smooth popup with title, description and CTA */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
          >
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy shadow-lg transition-all duration-200 hover:rotate-90 hover:scale-110"
                aria-label={t('services.modalClose')}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              {active.image && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={active.image}
                    alt={active.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
                  <span className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
                    <active.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-navy">{active.name}</h3>
                <p className="mt-3 leading-relaxed text-navy/70">{active.description}</p>

                <a
                  href="#reservation"
                  onClick={() => setActive(null)}
                  className="btn-primary mt-6 w-full"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  {t('services.ctaPrimary')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
</section>
  )
}
