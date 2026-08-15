import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUp, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { CLINIC_INFO } from '../config'

const SOCIALS = [
  { name: 'Facebook', href: CLINIC_INFO.socials.facebook, Icon: Facebook },
  { name: 'Instagram', href: CLINIC_INFO.socials.instagram, Icon: Instagram },
  { name: 'LinkedIn', href: CLINIC_INFO.socials.linkedin, Icon: Linkedin },
  {
    name: 'TikTok',
    href: CLINIC_INFO.socials.tiktok,
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
]

/** Footer with clinic info, quick links, socials and back-to-top. */
export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const phoneHref = `tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`

  const navLinks = ['home', 'services', 'about', 'reservation', 'contact']

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="container-site relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white">
                <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M32 46c-1.2 0-2.2-.5-3.2-1.4-3.4-3-8.5-7.7-8.5-14.9 0-4.7 3.6-8.4 8.3-8.4 2.1 0 3.7 1.1 4.5 2.2.7-1.1 2.3-2.2 4.4-2.2 4.7 0 8.3 3.7 8.3 8.4 0 7.2-5.1 11.9-8.5 14.9-.9.9-2 1.4-3.3 1.4z"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-bold">
                SmileCare
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Dental Clinic
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
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
          </nav>

          {/* Contact */}
          <div>
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
                <a
                  href={`mailto:${CLINIC_INFO.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {CLINIC_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + socials */}
          <div>
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-sm text-white/50">
            © {year} {CLINIC_INFO.name}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              {t('footer.developed')} ❤
            </span>
            <a
              href="#home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:-translate-y-1 hover:bg-primary hover:text-white"
              aria-label={t('footer.backToTop')}
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
