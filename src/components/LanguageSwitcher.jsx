import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
]

/**
 * Fixed FR / EN toggle used in the navbar. Updates i18n, the
 * <html lang> attribute and localStorage via src/i18n.js.
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
            whileTap={{ scale: 0.92 }}
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-colors ${
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-navy/60 hover:text-primary'
            }`}
            aria-pressed={active}
            aria-label={lang.name}
            title={lang.name}
          >
            {lang.label}
          </motion.button>
        )
      })}
    </div>
  )
}
