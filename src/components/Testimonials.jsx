import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Star } from 'lucide-react'
import { fadeInRight, viewport } from '../animations'
import { CLINIC_INFO } from '../config'
import { GOOGLE_REVIEWS } from '../data/googleReviews'

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

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.62H1.29a12.01 12.01 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.95 11.95 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.85 8.87 4.75 12 4.75z" />
    </svg>
  )
}

const MAX_TEXT_LENGTH = 150
const BASE_SPEED = 45 // px/s auto-scroll
const PAUSE_MS = 2800 // idle pause before auto-scroll resumes after release
const MOMENTUM_DECAY = 0.003 // per ms

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

function ReviewCard({ review, expanded, onToggle }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const date = typeof review.date === 'string' ? review.date : review.date?.[lang]
  const isLong = review.text.length > MAX_TEXT_LENGTH
  const text = expanded ? review.text : `${review.text.slice(0, MAX_TEXT_LENGTH)}${isLong ? '…' : ''}`

  return (
    <figure className="flex w-[300px] shrink-0 flex-col rounded-xl bg-white p-5 shadow-soft transition-shadow hover:shadow-card sm:w-[340px]">
      <div className="flex items-center justify-between">
        <Stars count={review.rating} />
        <GoogleIcon className="h-5 w-5" />
      </div>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-navy/80">
        &ldquo;{text}&rdquo;
      </blockquote>
      {isLong && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 inline-flex items-center gap-1 self-start text-sm font-semibold text-primary hover:text-primary-dark"
        >
          {expanded ? t('testimonials.showLess') : t('testimonials.readMore')}
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      )}
      <figcaption className="mt-3 flex items-center gap-3 border-t border-navy/10 pt-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xs font-bold text-white">
          {review.name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">{review.name}</p>
          <p className="text-xs text-navy/55">{date}</p>
        </div>
      </figcaption>
    </figure>
  )
}

/** Real Google reviews — manual swipe/drag carousel with inertia + resume auto-scroll. */
export default function Testimonials() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(null)
  const reduced = usePrefersReducedMotion()

  const x = useMotionValue(0)
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const halfRef = useRef(0)
  const modeRef = useRef('auto') // 'auto' | 'drag' | 'momentum' | 'pause' | 'idle'
  const velRef = useRef(0)
  const pauseUntilRef = useRef(0)
  const dragRef = useRef(null)
  const hoverRef = useRef(false)

  // Measure one pass width (track = reviews duplicated once)
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current
      if (el) halfRef.current = el.scrollWidth / 2
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Main animation loop
  useAnimationFrame((time, delta) => {
    const now = performance.now()
    switch (modeRef.current) {
      case 'auto': {
        if (reduced || hoverRef.current) break
        let nx = x.get() - (BASE_SPEED * delta) / 1000
        if (nx < -halfRef.current) nx += halfRef.current
        x.set(nx)
        break
      }
      case 'momentum': {
        let nx = x.get() + (velRef.current * delta) / 1000
        velRef.current *= Math.exp(-MOMENTUM_DECAY * delta)
        if (nx > 0) nx = 0
        if (nx < -halfRef.current) nx += halfRef.current
        x.set(nx)
        if (Math.abs(velRef.current) < 12) {
          modeRef.current = reduced ? 'idle' : 'pause'
          pauseUntilRef.current = now + PAUSE_MS
        }
        break
      }
      case 'pause': {
        if (now >= pauseUntilRef.current) modeRef.current = reduced ? 'idle' : 'auto'
        break
      }
      default:
        break
    }
  })

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const container = containerRef.current
    container.setPointerCapture?.(e.pointerId)
    dragRef.current = { pointerId: e.pointerId, startX: x.get(), startPageX: e.clientX, lastPageX: e.clientX, lastTime: performance.now() }
    modeRef.current = 'drag'
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const now = performance.now()
    const dt = Math.max(now - drag.lastTime, 1)
    const dx = e.clientX - drag.lastPageX
    drag.lastPageX = e.clientX
    drag.lastTime = now
    velRef.current = (dx / dt) * 1000 // px/s
    const nx = clamp(drag.startX + (e.clientX - drag.startPageX), -halfRef.current, 0)
    x.set(nx)
  }

  const endDrag = (e) => {
    if (!dragRef.current) return
    const deltaX = e.clientX - dragRef.current.startPageX
    const wasTap = Math.abs(deltaX) < 6
    dragRef.current = null
    if (wasTap) {
      modeRef.current = reduced ? 'idle' : 'auto'
    } else {
      modeRef.current = 'momentum'
      pauseUntilRef.current = performance.now() + PAUSE_MS
    }
  }

  const onPointerUp = (e) => {
    endDrag(e)
  }
  const onPointerCancel = (e) => {
    dragRef.current = null
    modeRef.current = reduced ? 'idle' : 'auto'
  }

  return (
    <section id="testimonials" className="overflow-hidden bg-mint/40 py-20 lg:py-28">
      <div className="container-site">
        {/* Header */}
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

          {/* Overall rating — top of reviews */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-navy/5 bg-white px-5 py-2.5 shadow-soft">
            <GoogleIcon className="h-5 w-5" />
            <span className="text-sm font-bold text-navy">5,0/5</span>
            <span className="text-amber-400" aria-hidden="true">★★★★★</span>
            <span className="text-sm text-navy/60">· {t('testimonials.googleReviews')}</span>
          </div>
        </motion.div>

        {/* Draggable carousel */}
        <motion.div
          className="mt-14"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
        >
          <div
            ref={containerRef}
            className="marquee-mask cursor-grab select-none touch-pan-y active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onMouseEnter={() => { hoverRef.current = true }}
            onMouseLeave={() => { hoverRef.current = false }}
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex w-max gap-5"
            >
              {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS.map((r, i) => ({ ...r, uid: i }))].map((review, i) => (
                <ReviewCard
                  key={`${review.name}-${i}`}
                  review={review}
                  expanded={expanded === i}
                  onToggle={() => setExpanded(expanded === i ? null : i)}
                />
              ))}
            </motion.div>
          </div>

          {/* See-all button */}
          <div className="mt-10 flex justify-center">
            <motion.a
              href={CLINIC_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <GoogleIcon className="h-5 w-5" />
              {t('testimonials.seeAll')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}