import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BeforeAfter from './components/BeforeAfter'
import Services from './components/Services'
import About from './components/About'
import ReservationForm from './components/ReservationForm'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ReminderBanner from './components/ReminderBanner'
import SplashScreen from './components/SplashScreen'

// AdminPanel is only bundled when VITE_ENABLE_ADMIN=true (offer with admin).
// For a vitrine-only build (offer without admin) this code is tree-shaken out entirely.
const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === 'true'
const AdminPanel = ADMIN_ENABLED ? lazy(() => import('./components/AdminPanel')) : null

export default function App() {
  const { t } = useTranslation()
  const [isAdmin, setIsAdmin] = useState(ADMIN_ENABLED && window.location.hash === '#/admin')
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    document.title = t('meta.title')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  }, [t])

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () =>
      setIsAdmin(ADMIN_ENABLED && window.location.hash === '#/admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Admin panel — no splash (only when admin is enabled in this build)
  if (isAdmin && AdminPanel) {
    return (
      <MotionConfig reducedMotion="user">
        <Suspense fallback={<div className="min-h-screen" />}>
          <AdminPanel />
        </Suspense>
      </MotionConfig>
    )
  }

  // Main site
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden">
        <AnimatePresence>
          {!splashDone && <SplashScreen key="splash" onDone={() => setSplashDone(true)} />}
        </AnimatePresence>
        <Navbar />
        <main>
          <Hero splashDone={splashDone} />
          <BeforeAfter />
          <Services />
          <About />
          <ReservationForm />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
        <ReminderBanner />
      </div>
    </MotionConfig>
  )
}
