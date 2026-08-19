import { useEffect } from 'react'
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

export default function App() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('meta.title')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  }, [t])

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
