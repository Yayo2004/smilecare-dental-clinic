import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BadgeCheck, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import {
  fadeInRight,
  viewport,
} from '../animations'

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-navy/15'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/** Testimonials carousel — slides in FROM THE RIGHT. */
export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    if (paused) return undefined
    const id = window.setInterval(() => go(1), 6000)
    return () => window.clearInterval(id)
  }, [go, paused])

  const current = items[index]

  return (
    <section id="testimonials" className="bg-mint/40 py-20 lg:py-28">
      <div className="container-site">
        {/* Header — right entrance */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">{t('testimonials.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('testimonials.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('testimonials.subtitle')}</p>
        </motion.div>

        {/* Carousel — right entrance */}
        <motion.div
          className="mx-auto mt-14 max-w-3xl"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
        >
          <div
            className="relative rounded-2xl border border-navy/5 bg-white p-8 shadow-soft sm:p-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span className="absolute -top-5 left-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-card">
              <Quote className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-h-[220px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Stars count={current.rating} />
                  <blockquote className="mt-4 text-lg leading-relaxed text-navy/80">
                    &ldquo;{current.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light font-bold text-white">
                      {current.name[0]}
                    </span>
                    <div>
                      <p className="font-bold text-navy">{current.name}</p>
                      <p className="flex items-center gap-1 text-sm text-navy/55">
                        {current.date}
                        <span aria-hidden="true">&middot;</span>
                        <span className="flex items-center gap-1 text-primary">
                          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          {t('testimonials.verified')}
                        </span>
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2" role="tablist" aria-label={t('testimonials.title')}>
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`${i + 1} / ${items.length}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-primary' : 'w-2.5 bg-navy/20 hover:bg-navy/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => go(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-primary hover:text-primary"
                  aria-label={t('common.previous')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => go(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-primary hover:text-primary"
                  aria-label={t('common.next')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
