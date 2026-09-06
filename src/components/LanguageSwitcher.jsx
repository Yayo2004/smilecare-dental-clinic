import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

/**
 * Language switcher: a globe icon that opens an attractive dropdown.
 */
export default function LanguageSwitcher({ onSwitch }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const current = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLanguage = (code) => {
    setOpen(false)
    if (code === current) return
    i18n.changeLanguage(code)
    onSwitch?.()
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Language / Langue"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/10 bg-white/80 text-primary shadow-sm backdrop-blur transition-colors hover:bg-mint/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <Globe className="h-4.5 w-4.5" aria-hidden="true" />
        <ChevronDown
          className={`absolute bottom-1 right-1 h-2.5 w-2.5 text-navy/50 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute left-0 top-full z-50 mt-2 w-44 origin-top-left overflow-hidden rounded-2xl border border-navy/10 bg-white p-1.5 shadow-soft-lg lg:left-auto lg:right-0 lg:origin-top-right"
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => switchLanguage(lang.code)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-mint text-primary'
                    : 'text-navy/80 hover:bg-mint/60 hover:text-primary'
                }`}
              >
                {lang.label}
                {isActive && <Check className="h-4 w-4" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}