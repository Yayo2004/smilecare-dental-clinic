import { useTranslation } from 'react-i18next'
import { Clock, Mail, MapPin, Phone, Siren } from 'lucide-react'
import Reveal from './Reveal'
import { CLINIC_INFO } from '../config'

/** Contact section: clinic details + embedded Google Map. */
export default function Contact() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const hours = t('contact.hours', { returnObjects: true })
  const phoneHref = `tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_INFO.mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`

  return (
    <section id="contact" key={lang} className="bg-white py-20 lg:py-28">
      <div className="container-site">
        {/* Section header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h2 className="section-title mt-4">{t('contact.title')}</h2>
          <p className="mt-4 text-lg text-navy/70">{t('contact.subtitle')}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Info cards */}
          <div className="space-y-5 lg:col-span-2">
            <Reveal>
              <div className="flex items-start gap-4 rounded-2xl border border-navy/5 bg-white p-5 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold text-navy">{t('contact.addressLabel')}</h3>
                  <p className="mt-1 text-navy/65">{CLINIC_INFO.address}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex items-start gap-4 rounded-2xl border border-navy/5 bg-white p-5 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold text-navy">{t('contact.phoneLabel')}</h3>
                  <a
                    href={phoneHref}
                    className="mt-1 block text-navy/65 transition-colors hover:text-primary"
                  >
                    {CLINIC_INFO.phone}
                  </a>
                  <a
                    href={`mailto:${CLINIC_INFO.email}`}
                    className="mt-1 flex items-center gap-1.5 text-navy/65 transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {CLINIC_INFO.email}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex items-start gap-4 rounded-2xl border border-navy/5 bg-white p-5 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="w-full">
                  <h3 className="font-bold text-navy">{t('contact.hoursLabel')}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {hours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4 text-sm">
                        <span className="text-navy/60">{row.days}</span>
                        <span className="font-semibold text-navy">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
                    <Siren className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t('contact.emergency')}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Map */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="h-full overflow-hidden rounded-2xl border border-navy/5 shadow-soft">
              <iframe
                title={t('contact.mapTitle')}
                src={mapSrc}
                className="h-full min-h-[320px] w-full lg:min-h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
