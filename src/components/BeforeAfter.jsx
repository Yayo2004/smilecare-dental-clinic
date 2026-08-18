import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'lucide-react'
import {
  fadeInLeft,
  staggerContainer,
  viewport,
} from '../animations'

const CASES = [
  { before: '/images/before-1.webp', after: '/images/after-1.webp' },
  { before: '/images/before-2.webp', after: '/images/after-2.webp' },
  { before: '/images/before-3.webp', after: '/images/after-3.webp' },
]

/**
 * Both images sit in the exact same spot.
 * Left half = before, right half = after.
 * Auto-animates on load, then user can drag to compare.
 */
function ComparisonSlider({ before, after, label, beforeLabel, afterLabel }) {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [imgWidth, setImgWidth] = useState(0)
  const autoRef = useRef(true)
  const resumeTimer = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setImgWidth(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf
    const start = performance.now()
    const animate = (now) => {
      if (!autoRef.current) return
      const elapsed = (now - start) / 1000
      const cycle = Math.sin(elapsed * 1.2) * 0.5 + 0.5
      setPos(8 + cycle * 84)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [dragging])

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPos((x / rect.width) * 100)
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault()
      autoRef.current = false
      clearTimeout(resumeTimer.current)
      setDragging(true)
      updatePos(e.clientX ?? e.touches?.[0]?.clientX)
    },
    [updatePos],
  )

  useEffect(() => {
    if (dragging) return
    resumeTimer.current = setTimeout(() => {
      autoRef.current = true
    }, 6000)
    return () => clearTimeout(resumeTimer.current)
  }, [dragging])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      e.preventDefault()
      updatePos(e.clientX ?? e.touches?.[0]?.clientX)
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, updatePos])

  return (
    <div>
      <p className="mb-4 text-center text-base font-bold text-navy">{label}</p>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-2xl shadow-soft select-none"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <img
          src={before}
          alt={`${label} — ${beforeLabel}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <img
            src={after}
            alt={`${label} — ${afterLabel}`}
            className="absolute inset-0 h-full object-cover"
            style={{ width: imgWidth || '100%' }}
            draggable={false}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-white/50">
            <ArrowLeftRight className="h-5 w-5 text-navy" aria-hidden="true" />
          </div>
        </div>

        <span className="absolute bottom-4 left-4 rounded-full bg-navy/70 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-primary/90 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}

/** Before/After section — slides in FROM THE LEFT, cards stagger + shine overlay. */
export default function BeforeAfter() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const cases = t('results.cases', { returnObjects: true })

  return (
    <section id="results" key={lang} className="overflow-hidden bg-mint/30 py-20 lg:py-28">
      <div className="container-site">
        {/* Header — left entrance */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <span className="eyebrow">{t('results.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('results.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('results.subtitle')}</p>
        </motion.div>

        {/* Cards — staggered left entrance with shine overlay */}
        <motion.div
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeInLeft}
              className="relative overflow-hidden"
            >
              {/* Shine overlay on scroll reveal */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-10 -translate-x-full rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent"
                whileInView={{ translateX: ['−100%', '100%'] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12 + 0.4, ease: 'easeInOut' }}
              />
              <ComparisonSlider
                before={c.before}
                after={c.after}
                label={cases[i]?.label}
                beforeLabel={t('results.before')}
                afterLabel={t('results.after')}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-navy/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ delay: 0.5 }}
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          {t('results.dragHint')}
        </motion.p>
      </div>
    </section>
  )
}
