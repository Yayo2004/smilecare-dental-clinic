import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from './Reveal'

const CASES = [
  { before: '/images/before-1.webp', after: '/images/after-1.webp' },
  { before: '/images/before-2.webp', after: '/images/after-2.webp' },
  { before: '/images/before-3.webp', after: '/images/after-3.webp' },
]

/** Single before/after comparison: both images stacked, drag slider to reveal. */
function ComparisonSlider({ before, after, label, beforeLabel, afterLabel }) {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [imgWidth, setImgWidth] = useState(0)

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
    <div className="mx-auto max-w-2xl">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-2xl shadow-soft select-none"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {/* Before — always fully visible underneath */}
        <img
          src={before}
          alt={`${label} — ${beforeLabel}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* After — clipped to pos% from the left */}
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

        {/* Vertical divider */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${pos}%` }}
        >
          {/* Drag handle */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-white/50">
            <ArrowLeftRight className="h-5 w-5 text-navy" aria-hidden="true" />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-4 left-4 rounded-full bg-navy/70 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-primary/90 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      {/* Treatment label */}
      <p className="mt-4 text-center text-base font-bold text-navy">{label}</p>
    </div>
  )
}

/** Before/After gallery: one comparison at a time, full-width, with case navigation. */
export default function BeforeAfter() {
  const { t } = useTranslation()
  const cases = t('results.cases', { returnObjects: true })
  const [index, setIndex] = useState(0)

  const go = (dir) => setIndex((i) => (i + dir + CASES.length) % CASES.length)

  const current = CASES[index]

  return (
    <section id="results" className="overflow-hidden bg-mint/30 py-20 lg:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t('results.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('results.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('results.subtitle')}</p>
        </Reveal>

        <Reveal className="mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <ComparisonSlider
                before={current.before}
                after={current.after}
                label={cases[index]?.label}
                beforeLabel={t('results.before')}
                afterLabel={t('results.after')}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation: arrows + dots */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-sm transition-colors hover:border-primary hover:text-primary"
              aria-label={t('common.previous')}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label={t('results.title')}>
              {CASES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={cases[i]?.label}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-primary' : 'w-2.5 bg-navy/20 hover:bg-navy/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-sm transition-colors hover:border-primary hover:text-primary"
              aria-label={t('common.next')}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-navy/50">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            {t('results.dragHint')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
