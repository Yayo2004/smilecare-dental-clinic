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

/** A single before/after image pair with a draggable comparison slider. */
function ComparisonCard({ before, after, label, beforeLabel, afterLabel }) {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [width, setWidth] = useState(0)

  // Track container width so the clipped "after" image stays pixel-aligned
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const updatePos = useCallback(
    (clientX) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      setPos((x / rect.width) * 100)
    },
    [],
  )

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
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-[300px] flex-shrink-0 snap-center sm:w-[380px]"
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-2xl shadow-soft select-none"
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {/* Before — full width, underneath */}
        <img
          src={before}
          alt={`${label} — ${beforeLabel}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* After — clipped overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <img
            src={after}
            alt={`${label} — ${afterLabel}`}
            className="absolute inset-0 h-full object-cover"
            style={{ width: width || '100%' }}
            draggable={false}
          />
        </div>

        {/* Vertical divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
          style={{ left: `${pos}%` }}
        >
          {/* Drag handle */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <ArrowLeftRight className="h-4 w-4 text-navy" aria-hidden="true" />
          </div>
        </div>

        {/* Before label (left side) */}
        <span className="absolute bottom-3 left-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {beforeLabel}
        </span>

        {/* After label (right side) */}
        <span className="absolute bottom-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      {/* Treatment name */}
      <p className="mt-3 text-center text-sm font-bold text-navy">{label}</p>
    </motion.article>
  )
}

/** Before/After horizontal scrollable comparison gallery. */
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

        <Reveal className="mt-14">
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 scroll-smooth sm:justify-center"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A9D8F transparent' }}
          >
            {CASES.map((c, i) => (
              <ComparisonCard
                key={i}
                before={c.before}
                after={c.after}
                label={cases[i]?.label}
                beforeLabel={t('results.before')}
                afterLabel={t('results.after')}
              />
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-navy/50">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            {t('results.dragHint')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
