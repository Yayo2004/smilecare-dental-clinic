import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CalendarCheck, Menu, Phone, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { CLINIC_INFO } from '../config'

const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'services', href: '#services' },
  { key: 'about', href: '#about' },
  { key: 'reservation', href: '#reservation' },
  { key: 'contact', href: '#contact' },
]

/** Sticky navbar with logo, links, language switcher and animated mobile menu. */
export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Skip link for accessibility */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>

      <nav
        className={`container-site flex items-center justify-between py-4 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5" onClick={handleLinkClick}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-card">
            <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M32 46c-1.2 0-2.2-.5-3.2-1.4-3.4-3-8.5-7.7-8.5-14.9 0-4.7 3.6-8.4 8.3-8.4 2.1 0 3.7 1.1 4.5 2.2.7-1.1 2.3-2.2 4.4-2.2 4.7 0 8.3 3.7 8.3 8.4 0 7.2-5.1 11.9-8.5 14.9-.9.9-2 1.4-3.3 1.4z"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-bold leading-tight text-navy">
            SmileCare
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Dental Clinic
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="relative rounded-full px-4 py-2 text-sm font-semibold text-navy/75 transition-colors hover:text-primary"
              >
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: language + CTA */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <a
            href="#reservation"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:scale-[1.03] hover:bg-primary-dark md:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {t('nav.reservation')}
          </a>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy shadow-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeLabel') : t('nav.menuLabel')}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-white/95 shadow-soft backdrop-blur-md lg:hidden"
          >
            <ul className="container-site flex flex-col gap-1 pb-6 pt-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={handleLinkClick}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-navy/80 transition-colors hover:bg-mint/60 hover:text-primary"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                </motion.li>
              ))}
              <li className="mt-2 flex items-center gap-3 px-1">
                <a
                  href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 px-4 py-2.5 text-sm font-semibold text-primary"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {CLINIC_INFO.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
