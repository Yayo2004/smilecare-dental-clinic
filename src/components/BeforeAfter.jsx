import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeftRight } from 'lucide-react'
import Reveal from './Reveal'

const CASES = [
  { before: '/images/before-1.webp', after: '/images/after-1.webp' },
  { before: '/images/before-2.webp', after: '/images/after-2.webp' },
  { before: '/images/before-3.webp', after: '/images/after-3.webp' },
]

/**
 * Both images sit in the exact same spot.
 * Left half = before, right half = after.
 * Drag anywhere on the image to move the dividing line.
 */
function ComparisonSlider({ before, after, label, beforeLabel, afterLabel }) {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [imgWidth, setImgWidth] = useState(0)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setImgWidth(el.getBoundingClientRect().width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const updatePos = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPos((x / rect.width) * 100)
    setHint(false)
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(true)
      updatePos(e.clientX ?? e.touches?.[0]?.clientX)
    },
    [updatePos],
  )

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
      {/* Treatment label */}
      <p className="mb-4 text-center text-base font-bold text-navy">{label}</p>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-2xl shadow-soft select-none"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {/* BEFORE — full width underneath */}
        <img
          src={before}
          alt={`${label} — ${beforeLabel}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* AFTER — same exact size, clipped to pos% from left */}
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

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-white/50">
            <ArrowLeftRight className="h-5 w-5 text-navy" aria-hidden="true" />
          </div>
        </div>

        {/* Avant label — left side */}
        <span className="absolute bottom-4 left-4 rounded-full bg-navy/70 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {beforeLabel}
        </span>

        {/* Après label — right side */}
        <span className="absolute bottom-4 right-4 rounded-full bg-primary/90 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {afterLabel}
        </span>

        {/* Animated hint: slides automatically on first load */}
        {hint && (
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-white/80"
            initial={{ left: '10%' }}
            animate={{ left: ['10%', '90%', '50%'] }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.8 }}
          />
        )}
      </div>
    </div>
  )
}

/** All cases stacked vertically — each one is a full-width comparison slider. */
export default function BeforeAfter() {
  const { t } = useTranslation()
  const cases = t('results.cases', { returnObjects: true })

  return (
    <section id="results" className="overflow-hidden bg-mint/30 py-20 lg:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t('results.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('results.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('results.subtitle')}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <ComparisonSlider
                before={c.before}
                after={c.after}
                label={cases[i]?.label}
                beforeLabel={t('results.before')}
                afterLabel={t('results.after')}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="flex items-center justify-center gap-2 text-center text-sm text-navy/50">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            {t('results.dragHint')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
