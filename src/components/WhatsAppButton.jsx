import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { buildWhatsAppLink, CLINIC_INFO } from '../config'

/** Floating WhatsApp button with continuous pulse/glow ripple. */
export default function WhatsAppButton() {
  const { t } = useTranslation()

  return (
    <motion.a
      href={buildWhatsAppLink(CLINIC_INFO.whatsappNumber, t('whatsapp.message'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.label')}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)]"
    >
      {/* Triple-ring pulse ripple */}
      <span className="absolute inset-0 -z-20 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <motion.span
        className="absolute -inset-2 -z-10 rounded-full border-2 border-[#25D366]/30"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute -inset-4 -z-10 rounded-full border border-[#25D366]/15"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.44 4.43-9.87 9.89-9.87a9.8 9.8 0 0 1 6.98 2.9 9.8 9.8 0 0 1 2.9 6.99c0 5.44-4.44 9.87-9.88 9.87zm8.41-18.28A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.48-8.39z" />
      </svg>
    </motion.a>
  )
}
