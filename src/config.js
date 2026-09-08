/**
 * Central clinic configuration.
 * Replace the values below with the real clinic details before going live.
 */

export const CLINIC_INFO = {
  name: 'Myriam Lahlou — Cabinet Dentaire',
  shortName: 'Myriam Lahlou',
  phone: '0522 49 24 40',
  // International number WITHOUT the leading "+", used for wa.me links
  // 0778207697 (Morocco) -> 2120778207697
  whatsappNumber: '2120778207697',
  email: 'contact@myriamlahlou.example.com',
  address: '47 Boulevard Hassan II, Rdc, Casablanca, Maroc',
  // Query used for the embedded Google Map (no API key required)
  mapQuery: '47 Boulevard Hassan II, Casablanca, Maroc',
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
