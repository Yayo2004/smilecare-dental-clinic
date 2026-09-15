import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Award,
  BadgeCheck,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  HeartHandshake,
  HeartPulse,
  Home,
  Layers,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import { fadeInLeft, fadeInUp, staggerContainer, viewport } from '../animations'
import { ComparisonSlider } from './BeforeAfter'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { buildWhatsAppLink, CLINIC_INFO } from '../config'
import SERVICE_PAGES, { getServicePage } from '../data/servicePages'

const SITE_URL = 'https://dentistemyriamlahlou.vercel.app'

const STEP_ICONS = [ClipboardList, Camera, Layers, BadgeCheck, CalendarCheck]
const BENEFIT_ICONS = [Sparkles, CheckCircle2, ShieldCheck, HeartPulse, Star, HeartHandshake, Award, Zap]

const UI = {
  fr: {
    city: 'à Casablanca',
    breadcrumbServices: 'Services',
    whoForTitle: 'Ce soin est-il fait pour vous ?',
    reserve: 'Prendre rendez-vous pour ce soin',
    whatsapp: 'Réserver via WhatsApp',
    ctaTitle: 'Un doute ? Un projet de sourire ?',
    ctaText: 'Prenez rendez-vous chez le Dr Myriam Lahlou pour un bilan personnalisé.',
    otherTitle: 'Autres soins',
    otherSubtitle: "Découvrez nos autres traitements dentaires à Casablanca.",
    whatsappMsg: (name) => `Bonjour, je souhaite en savoir plus sur ${name}.`,
    backHome: 'Retour à l’accueil',
    readMore: 'En savoir plus',
  },
  en: {
    city: 'in Casablanca',
    breadcrumbServices: 'Services',
    whoForTitle: 'Is this treatment right for you?',
    reserve: 'Book this treatment',
    whatsapp: 'Book via WhatsApp',
    ctaTitle: 'A question? A smile project?',
    ctaText: 'Book an appointment with Dr Myriam Lahlou for a personalised assessment.',
    otherTitle: 'Other Treatments',
    otherSubtitle: 'Discover our other dental treatments in Casablanca.',
    whatsappMsg: (name) => `Hello, I would like to know more about ${name}.`,
    backHome: 'Back to home',
    readMore: 'Learn more',
  },
}

/** Individual service landing page — dedicated URL, SEO tags, detailed content. */
export default function ServicePage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const page = getServicePage(slug)
  const [openFaq, setOpenFaq] = useState(null)

  const content = page ? t(`servicePages.${page.slug}`, { returnObjects: true }) : null
  const ui = UI[lang]

  useEffect(() => {
    if (!content) return
    document.title = content.metaTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.metaDescription)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', content.metaTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', content.metaDescription)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', content.metaTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', content.metaDescription)
  }, [content])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setOpenFaq(null)
  }, [slug])

  if (!page || !content) return <Navigate to="/" replace />

  const serviceName = t('services.items', { returnObjects: true })[page.serviceIndex]?.name ?? ''
  const whatsappUrl = buildWhatsAppLink(CLINIC_INFO.whatsappNumber, ui.whatsappMsg(serviceName))
  const bookingHref = `/?service=${page.slug}#reservation`
  const heroAlt = `${serviceName} ${ui.city} — Dr Myriam Lahlou`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: `${serviceName} ${ui.city}`,
    description: content.metaDescription,
    url: `${SITE_URL}/services/${page.slug}`,
    image: `${SITE_URL}${page.heroImage}`,
    procedureType: 'https://schema.org/TherapeuticProcedure',
    bodyLocation: 'Teeth',
    performingPhysician: {
      '@type': 'Dentist',
      name: 'Dr Myriam Lahlou',
      url: SITE_URL,
      telephone: '+212522492440',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '47 Boulevard Hassan II, Rdc',
        addressLocality: 'Casablanca',
        addressCountry: 'MA',
      },
    },
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main key={lang}>
        {/* ===== HERO ===== */}
        <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-navy">
          <motion.img
            src={page.heroImage}
            alt={heroAlt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/45 to-navy/30" />

          <div className="container-site relative pb-16 pt-36">
            {/* Breadcrumb — clear link back to home */}
            <motion.nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/20">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                {t('nav.home')}
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/#services" className="rounded-full px-1 py-1.5 transition-colors hover:text-white">
                {ui.breadcrumbServices}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="rounded-full bg-primary/80 px-3 py-1.5 font-semibold text-white">
                {serviceName}
              </span>
            </motion.nav>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.12)}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-accent-light backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {content.heroBadge}
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="mt-5 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                {serviceName} <span className="text-accent">{ui.city}</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
              >
                {content.heroSubtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to={bookingHref}
                  className="btn-primary w-full text-center sm:w-auto"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  {ui.reserve}
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/20 sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5 text-accent" aria-hidden="true" />
                  {ui.whatsapp}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== INTRO ===== */}
        <section className="bg-white py-20 lg:py-24">
          <div className="container-site">
            <div className="grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
              <motion.div
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ ...viewport, amount: 0.2 }}
              >
                {content.introParagraphs.map((paragraph) => (
                  <motion.p
                    key={paragraph}
                    variants={fadeInUp}
                    className="mt-5 text-lg leading-relaxed text-navy/75 first:mt-0"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              {/* Who is it for */}
              <motion.aside
                variants={fadeInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-3xl border border-primary/15 bg-gradient-to-br from-mint/70 to-accent-light/40 p-7 shadow-soft"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                  <HeartPulse className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-navy">
                  {ui.whoForTitle}
                </h2>
                <p className="mt-3 leading-relaxed text-navy/75">{content.whoFor}</p>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* ===== STEPS — déroulement ===== */}
        <section className="overflow-hidden bg-mint/30 py-20 lg:py-24">
          <div className="container-site">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="eyebrow">{t('services.eyebrow')}</span>
              <h2 className="section-title mt-4">{content.stepsTitle}</h2>
            </motion.div>

            <motion.ol
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {content.steps.map((step, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length]
                return (
                  <motion.li
                    key={step.title}
                    variants={fadeInUp}
                    className="group relative overflow-hidden rounded-2xl border border-navy/5 bg-white p-7 shadow-soft transition-shadow duration-300 hover:shadow-card"
                  >
                    <span className="absolute -right-3 -top-5 font-display text-7xl font-extrabold text-navy/5 transition-colors duration-300 group-hover:text-primary/10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-light text-white shadow-sm">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/70">{step.text}</p>
                  </motion.li>
                )
              })}
            </motion.ol>
          </div>
        </section>

        {/* ===== BENEFITS / WHY CHOOSE ===== */}
        <section className="bg-white py-20 lg:py-24">
          <div className="container-site">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="eyebrow">{content.heroBadge}</span>
              <h2 className="section-title mt-4">{content.benefitsTitle}</h2>
            </motion.div>

            <motion.ul
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {content.benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
                return (
                  <motion.li
                    key={benefit}
                    variants={fadeInUp}
                    className="flex items-start gap-4 rounded-2xl border border-navy/5 bg-gradient-to-br from-mint/40 to-white p-5 shadow-soft transition-shadow duration-300 hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="font-medium leading-snug text-navy/80">{benefit}</span>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>
        </section>

        {/* ===== BEFORE / AFTER GALLERY (only when photos exist) ===== */}
        {page.gallery && (
          <section className="overflow-hidden bg-mint/30 py-20 lg:py-24">
            <div className="container-site">
              <motion.div
                className="mx-auto max-w-2xl text-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <span className="eyebrow">{t('results.eyebrow')}</span>
                <h2 className="section-title mt-4">{content.galleryTitle}</h2>
              </motion.div>

              <motion.div
                className={`mt-14 grid gap-8 ${page.gallery.length === 1 ? 'max-w-xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {page.gallery.map((pair, i) => (
                  <motion.div key={pair.before} variants={fadeInLeft} className="overflow-hidden rounded-2xl">
                    <ComparisonSlider
                      before={pair.before}
                      after={pair.after}
                      label={i === 0 ? serviceName : `${serviceName} — ${t('results.eyebrow')}`}
                      beforeLabel={t('results.before')}
                      afterLabel={t('results.after')}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ===== FAQ ===== */}
        <section className="bg-white py-20 lg:py-24">
          <div className="container-site max-w-3xl">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="eyebrow">FAQ</span>
              <h2 className="section-title mt-4">{content.faqTitle}</h2>
            </motion.div>

            <div className="mt-12 space-y-4">
              {content.faq.map((item, i) => {
                const open = openFaq === i
                return (
                  <motion.div
                    key={item.q}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: i * 0.06 }}
                    className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                      open ? 'border-primary/30 bg-mint/50 shadow-soft' : 'border-navy/5 bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-display text-base font-bold text-navy sm:text-lg">
                        {item.q}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          open ? 'rotate-180 bg-primary text-white' : 'bg-primary/10 text-primary'
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-6 pb-5 leading-relaxed text-navy/75">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-20 lg:py-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="container-site relative text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {ui.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
                {content.heroSubtitle}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to={bookingHref}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 font-semibold text-primary shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  {ui.reserve}
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/40 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {ui.whatsapp}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== OTHER SERVICES + back home ===== */}
        <section className="bg-mint/30 py-20 lg:py-24">
          <div className="container-site">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="eyebrow">{content.otherTitle}</span>
              <h2 className="section-title mt-4">{content.otherTitle}</h2>
              <p className="mt-3 text-lg text-navy/70">{content.otherSubtitle}</p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {page.otherSlugs.map((otherSlug) => {
                const other = getServicePage(otherSlug)
                if (!other) return null
                const otherName = t('services.items', { returnObjects: true })[other.serviceIndex]?.name
                const otherDetail = t('services.items', { returnObjects: true })[other.serviceIndex]?.description
                const otherContent = t(`servicePages.${other.slug}`, { returnObjects: true })
                return (
                  <motion.article
                    key={otherSlug}
                    variants={fadeInUp}
                    className="group relative overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                  >
                    <Link to={`/services/${other.slug}`} className="absolute inset-0 z-10" aria-label={otherName} />
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={other.heroImage}
                        alt={`${otherName} ${ui.city} — Dr Myriam Lahlou`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                      <span className="absolute bottom-3 left-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        {otherContent?.heroBadge ?? otherName}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-navy transition-colors duration-300 group-hover:text-primary">
                        {otherName}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/65">
                        {otherDetail}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {ui.readMore}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy/10 bg-white px-7 py-3 font-semibold text-navy transition-all duration-300 hover:border-primary hover:text-primary"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
                {ui.backHome}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}