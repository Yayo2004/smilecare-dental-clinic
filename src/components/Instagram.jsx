import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Instagram } from 'lucide-react'
import { fadeInUp, viewport } from '../animations'

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/dr.myriam_lahlou/'

const REELS = [
  { url: 'https://www.instagram.com/reel/DWlwgGQjW3P/', caption: 'Reel 1' },
  { url: 'https://www.instagram.com/reel/DWQ6JJvjbrb/', caption: 'Reel 2' },
]

const EMBED_SCRIPT_SRC = '//www.instagram.com/embed.js'
let embedScriptAdded = false

function usePrefersReducedMotion() {
  const ref = useRef(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    ref.current = mq.matches
    const onChange = (e) => {
      ref.current = e.matches
    }
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return ref
}

/** Renders a single Instagram reel via the official embed script. */
function ReelEmbed({ url, caption }) {
  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow duration-300 hover:shadow-card">
        <div className="p-1.5">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ margin: '0', minWidth: '0', width: '100%' }}
          />
        </div>
        <p className="sr-only">{caption}</p>
      </div>
    </div>
  )
}

/** Instagram section — two embedded reels + gradient CTA to the profile. */
export default function InstagramSection() {
  const { t } = useTranslation()
  const reducedRef = usePrefersReducedMotion()
  const reduced = reducedRef.current

  // Load Instagram's embed.js exactly once, then render the blockquotes.
  useEffect(() => {
    if (!window.__instgrmLoaded && !embedScriptAdded) {
      embedScriptAdded = true
      const script = document.createElement('script')
      script.async = true
      script.src = EMBED_SCRIPT_SRC
      script.onload = () => {
        window.__instgrmLoaded = true
        window.instgrm?.Embeds?.process?.()
      }
      document.body.appendChild(script)
    } else {
      window.instgrm?.Embeds?.process?.()
    }
  }, [])

  return (
    <section id="instagram" className="bg-white py-20 lg:py-28">
      <div className="container-site">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <Instagram
            className="mx-auto h-10 w-10 text-primary"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h2 className="section-title mt-4">{t('instagram.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('instagram.subtitle')}</p>
        </motion.div>

        {/* Reels — 2 columns desktop, stacked mobile, staggered entrance */}
        <div className="mt-14 grid justify-items-center gap-8 sm:grid-cols-2 lg:gap-10">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.url}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15 * i,
              }}
            >
              <ReelEmbed url={reel.url} caption={`${t('instagram.reelLabel')} ${i + 1}`} />
            </motion.div>
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-white"
            style={{
              backgroundImage: 'linear-gradient(120deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
            }}
            whileHover={{ scale: reduced ? 1 : 1.06 }}
            whileTap={{ scale: reduced ? 1 : 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-label={t('instagram.cta')}
          >
            {!reduced && (
              <motion.span
                className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                style={{ boxShadow: '0 0 0 0 rgba(221, 42, 123, 0.45)' }}
                animate={{ boxShadow: ['0 0 0 0 rgba(221, 42, 123, 0.45)', '0 0 0 18px rgba(221, 42, 123, 0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                aria-hidden="true"
              />
            )}
            {/* Shimmer sweep on hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </span>
            {t('instagram.cta')}
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}