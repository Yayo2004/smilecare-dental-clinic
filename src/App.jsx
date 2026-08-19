import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
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
import AdminPanel from './components/AdminPanel'

export default function App() {
  const { t } = useTranslation()
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#/admin')

  useEffect(() => {
    document.title = t('meta.title')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  }, [t])

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#/admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Admin panel
  if (isAdmin) {
    return (
      <MotionConfig reducedMotion="user">
        <AdminPanel />
      </MotionConfig>
    )
  }

  // Main site
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
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
