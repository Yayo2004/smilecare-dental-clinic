import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CalendarCheck, Menu, Phone, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'
import { CLINIC_INFO } from '../config'

const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'services', href: '#services' },
  { key: 'about', href: '#about' },
  { key: 'reservation', href: '#reservation' },
  { key: 'contact', href: '#contact' },
]

/** Sticky navbar with fade+slide-down entrance on page load. */
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

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setOpen(false)
    // Wait for the mobile menu to collapse so the target position is accurate
    setTimeout(() => {
      const isHome = href === '#home'
      const el = isHome ? document.body : document.querySelector(href)
      if (el) {
        const top = isHome
          ? 0
          : el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 250)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>

      <nav
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 transition-all duration-300 sm:px-8 lg:px-12 ${
          scrolled ? 'py-2.5' : 'py-3'
        }`}
        aria-label="Main navigation"
      >
        <div className="grid w-full grid-cols-3 items-center lg:hidden">
          <div className="flex items-center justify-self-start">
            <LanguageSwitcher />
          </div>
          <a
            href="#home"
            className="flex min-w-0 items-center justify-self-center px-1"
            onClick={(e) => handleLinkClick(e, '#home')}
          >
            <Logo className="h-14 min-w-0 shrink-0 sm:h-[65px]" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-navy/10 bg-white text-navy shadow-sm"
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

        <div className="hidden w-full items-center justify-between gap-2 lg:flex">
          <a href="#home" className="flex min-w-0 shrink-0 items-center" onClick={(e) => handleLinkClick(e, '#home')}>
            <Logo className="h-[65px] shrink-0" />
          </a>

          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold text-navy/75 transition-colors hover:text-primary"
                >
                  {t(`nav.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <motion.a
              href="#reservation"
              onClick={(e) => handleLinkClick(e, '#reservation')}
              className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card md:inline-flex"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {t('nav.reservation')}
            </motion.a>
          </div>
        </div>
      </nav>

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
            <ul className="container-site flex flex-col gap-1 pb-4 pt-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="block rounded-xl px-4 py-2.5 text-base font-semibold text-navy/80 transition-colors hover:bg-mint/60 hover:text-primary"
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
    </motion.header>
  )
}
