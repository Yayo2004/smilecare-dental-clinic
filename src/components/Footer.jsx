import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUp, Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { CLINIC_INFO } from '../config'
import { fadeInUp, staggerContainer, viewport } from '../animations'

const SOCIALS = [
  { name: 'Instagram', href: CLINIC_INFO.socials.instagram, Icon: Instagram },
]

/** Footer with clinic info, quick links, socials and back-to-top. */
export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const phoneHref = `tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`
  const mobileHref = `tel:${CLINIC_INFO.phoneMobile.replace(/\s/g, '')}`
  const emailHref = `mailto:${CLINIC_INFO.email}`

  const navLinks = ['home', 'services', 'about', 'reservation', 'contact']

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      {/* Animated decorative orbs */}
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/3 top-1/3 h-52 w-52 rounded-full bg-accent/15 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="container-site relative py-16">
        {/* Columns — fade in staggered on scroll */}
        <motion.div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Brand */}
          <motion.div variants={fadeInUp}>
            <a href="#home" className="inline-flex items-center">
              <Logo className="h-11 shrink-0 sm:h-10" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t('footer.tagline')}
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.nav variants={fadeInUp} aria-label="Footer navigation">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/80">
              {t('footer.quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {t(`nav.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Contact */}
          <motion.div variants={fadeInUp}>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/80">
              {t('footer.contactTitle')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {CLINIC_INFO.address}
              </li>
              <li>
                <a href={phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-accent">
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li>
                <a href={mobileHref} className="flex items-center gap-2.5 transition-colors hover:text-accent">
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {CLINIC_INFO.phoneMobile}
                </a>
              </li>
              <li>
                <a href={emailHref} className="flex items-center gap-2.5 transition-colors hover:text-accent">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {CLINIC_INFO.email}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Hours + socials */}
          <motion.div variants={fadeInUp}>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/80">
              {t('footer.hoursTitle')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {t('contact.hours', { returnObjects: true }).map((row) => (
                <li key={row.days} className="flex items-center justify-between gap-3">
                  <span>{row.days}</span>
                  <span className="font-semibold text-white/80">{row.time}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-wider text-white/80">
              {t('footer.followUs')}
            </h3>
            <div className="mt-3 flex gap-2.5">
              {SOCIALS.map(({ name, href, Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <p className="text-sm text-white/50">
            © {year} {CLINIC_INFO.name}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              {t('footer.developed')}
            </span>
            <a
              href="#home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:-translate-y-1 hover:bg-primary hover:text-white"
              aria-label={t('footer.backToTop')}
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
