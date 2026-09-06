import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
]

/**
 * Compact language dropdown (select).
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
    <div className="relative shrink-0">
      <Globe
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
        aria-hidden="true"
      />
      <select
        value={current}
        onChange={(e) => switchLanguage(e.target.value)}
        aria-label="Language / Langue"
        className="appearance-none rounded-full border border-navy/10 bg-white/80 py-2 pl-8 pr-7 text-xs font-bold text-navy shadow-sm outline-none backdrop-blur focus:border-primary"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy/50"
        aria-hidden="true"
      />
    </div>
  )
}