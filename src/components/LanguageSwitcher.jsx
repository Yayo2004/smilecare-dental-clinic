import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
]

/**
 * FR / EN toggle with smooth flip animation on language change.
 */
export default function LanguageSwitcher({ onSwitch }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  const switchLanguage = (code) => {
    if (code === current) return
    i18n.changeLanguage(code)
    onSwitch?.()
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-navy/10 bg-white/80 p-1 shadow-sm backdrop-blur"
      role="group"
      aria-label="Language switcher / Sélecteur de langue"
    >
      <Globe className="ml-1.5 hidden h-4 w-4 text-primary sm:block" aria-hidden="true" />
      {LANGUAGES.map((lang) => {
        const active = lang.code === current
        return (
          <motion.button
            key={lang.code}
            type="button"
            onClick={() => switchLanguage(lang.code)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-colors ${
              active
                ? 'text-white'
                : 'text-navy/60 hover:text-primary'
            }`}
            aria-pressed={active}
            aria-label={lang.name}
            title={lang.name}
          >
            {/* Animated active pill background */}
            <AnimatePresence>
              {active && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{lang.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
