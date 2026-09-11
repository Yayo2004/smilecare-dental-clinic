/**
 * Central clinic configuration.
 * Replace the values below with the real clinic details before going live.
 */

export const CLINIC_INFO = {
  name: 'Myriam Lahlou — Cabinet Dentaire',
  shortName: 'Myriam Lahlou',
  phone: '0522 49 24 40',
  phoneMobile: '0660186373',
  phoneMobileIntl: '+212660186373',
  email: 'Myriam.lahlou13@gmail.com',
  // International number WITHOUT the leading "+", used for wa.me links
  // 0660186373 (Morocco) -> 212660186373
  whatsappNumber: '212660186373',
  address: '47 Boulevard Hassan II, Rdc, Casablanca, Maroc',
  // Query used for the embedded Google Map (no API key required)
  mapQuery: '47 Boulevard Hassan II, Casablanca, Maroc',
  googleReviewsUrl: 'https://www.google.com/maps/place/Cabinet+dr+Myriam+lahlou/@33.5893914,-7.6198957,17z/data=!4m15!1m8!3m7!1s0xda7d3063de30c63:0xd7786bb7df9b51ea!2sCabinet+dr+Myriam+lahlou!8m2!3d33.5894658!4d-7.6198202!10e5!16s%2Fg%2F11vsz__brq!3m5!1s0xda7d3063de30c63:0xd7786bb7df9b51ea!8m2!3d33.5894658!4d-7.6198202!16s%2Fg%2F11vsz__brq?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
  socials: {
    facebook: 'https://facebook.com/',
    instagram: 'https://www.instagram.com/dr.myriam_lahlou/',
    linkedin: 'https://linkedin.com/',
    tiktok: 'https://tiktok.com/',
  },
}

// Build a wa.me link from a phone number and an optional URL-encoded message
export const buildWhatsAppLink = (number = CLINIC_INFO.whatsappNumber, message = '') => {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
