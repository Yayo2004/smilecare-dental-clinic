/**
 * Central clinic configuration.
 * Replace the values below with the real clinic details before going live.
 */

export const CLINIC_INFO = {
  name: 'SmileCare Dental Clinic',
  shortName: 'SmileCare',
  phone: '+212 0644356664',
  // International number WITHOUT the leading "+", used for wa.me links
  // 212 0644356664 (Morocco) -> 2120644356664
  whatsappNumber: '2120644356664',
  email: 'contact@smilecare.example.com',
  address: '24 Rue de la Santé, 75013 Paris, France',
  // Query used for the embedded Google Map (no API key required)
  mapQuery: '24 Rue de la Santé, 75013 Paris, France',
  socials: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    tiktok: 'https://tiktok.com/',
  },
}

// Build a wa.me link from a phone number and an optional URL-encoded message
export const buildWhatsAppLink = (number = CLINIC_INFO.whatsappNumber, message = '') => {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
