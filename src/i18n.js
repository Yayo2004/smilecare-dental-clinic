import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

// Key used to persist the selected language in localStorage
export const LANG_STORAGE_KEY = 'clinic_lang'

// Read a persisted language if it exists and is supported, otherwise default to French
const storedLang =
  typeof window !== 'undefined' ? window.localStorage.getItem(LANG_STORAGE_KEY) : null
const supported = ['fr', 'en']
const initialLang = storedLang && supported.includes(storedLang) ? storedLang : 'fr'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'fr',
  supportedLngs: supported,
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
})

// Keep the <html lang="..."> attribute and localStorage in sync with the active language
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lng)
  } catch {
    /* localStorage unavailable — ignore */
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export default i18n
