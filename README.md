# 🦷 SmileCare Dental Clinic

A modern, professional, fully client-side dental clinic website built with **React + Vite**, **Tailwind CSS**, and **Framer Motion**. Bilingual **French (default) / English**, with a live reservation flow that redirects to WhatsApp with a pre-filled message — **no backend required**.

## ✨ Features

- 🌍 **Bilingual (FR / EN)** — react-i18next with fully translated content: navbar, hero, services, about, form, testimonials, contact, footer and WhatsApp messages
- 🗣️ **Language switcher** in the navbar (FR / EN toggle), persisted in `localStorage`, `<html lang>` attribute kept in sync
- 📅 **Reservation form** — client-side validation with translated errors, then opens `https://wa.me/...` with a formatted, URL-encoded message in the active language
- 💬 **Floating WhatsApp button** with pulse animation (fixed bottom-right, visible on every section)
- 🎨 **Soft medical design** — teal/blue palette (`#2A9D8F`, `#4FB3BF`), mint accents, dark navy text (`#1B2A4A`), rounded corners, soft shadows and gradients
- ✨ **Framer Motion animations** — scroll-reveal (fade + slide up), hover micro-interactions, animated counters, animated mobile menu and testimonial carousel
- 📱 **Fully responsive** — mobile, tablet and desktop
- ♿ **Accessible** — semantic markup, labels, ARIA attributes, alt text, skip link and good contrast

## 🛠️ Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Framework   | React 18                                          |
| Build tool  | Vite 5                                            |
| Styling     | Tailwind CSS 3                                    |
| Animations  | Framer Motion                                     |
| i18n        | react-i18next + i18next (JSON files, no backend)  |
| Icons       | Lucide React                                      |
| Forms       | React state + custom validation (no backend)      |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Yayo2004/smilecare-dental-clinic.git

# 2. Navigate into the project
cd smilecare-dental-clinic

# 3. Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the app hot-reloads on changes.

### Production build

```bash
npm run build
npm run preview
```

The production build is output to the `dist/` folder and is ready to be served by any static host.

## ⚙️ Configuration

All clinic-specific details live in a single file: **`src/config.js`**

```js
export const CLINIC_INFO = {
  name: 'SmileCare Dental Clinic',
  shortName: 'SmileCare',
  phone: '+212 0644356664',                    // Displayed phone
  whatsappNumber: '2120644356664',             // International, NO "+" — used for wa.me links
  email: 'contact@smilecare.example.com',
  address: '24 Rue de la Santé, 75013 Paris, France',
  mapQuery: '24 Rue de la Santé, 75013 Paris, France',
  socials: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    tiktok: 'https://tiktok.com/',
  },
}
```

> ⚠️ **Important:** the WhatsApp number must be in **international format without the leading `+`** (e.g. Morocco `212 06 44 35 66 64` → `2120644356664`).

### Translations

Content is stored in two JSON files:

- `src/locales/fr.json` — French (default, fallback)
- `src/locales/en.json` — English

Add or edit keys in both files — the site picks them up automatically. The selected language is persisted in `localStorage` under the `clinic_lang` key.

## 📁 Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky navbar + animated mobile menu
│   │   ├── Hero.jsx            # Hero with SVG illustration + CTAs
│   │   ├── Services.jsx        # Services grid (6 treatments)
│   │   ├── About.jsx           # Clinic info, animated counters, dentist bios
│   │   ├── ReservationForm.jsx # Bilingual form → WhatsApp redirect
│   │   ├── Testimonials.jsx    # Auto-advancing carousel
│   │   ├── Contact.jsx         # Contact cards + embedded Google Map
│   │   ├── Footer.jsx          # Links, socials, back-to-top
│   │   ├── WhatsAppButton.jsx  # Floating pulsing WhatsApp button
│   │   ├── LanguageSwitcher.jsx# FR / EN toggle
│   │   └── Reveal.jsx          # Scroll-reveal animation wrapper
│   ├── locales/
│   │   ├── en.json
│   │   └── fr.json
│   ├── config.js               # ⚙️ Clinic details & WhatsApp number
│   ├── i18n.js                 # i18next setup + persistence
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind + reusable component classes
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 📝 Customization

- **Colors / fonts** — edit `tailwind.config.js` (brand palette `primary`, `accent`, `mint`, `navy`) and the Google Fonts link in `index.html` (Poppins + Inter).
- **Sections & content** — every piece of visible text is in the translation JSON files; structure lives in `src/components/`.
- **Map** — update `mapQuery` in `src/config.js`; the iframe requires no API key.

## 🚢 Deployment

The build outputs static files only, so it can be hosted anywhere:

- **GitHub Pages** — push the `dist/` output
- **Netlify / Vercel** — connect the repo; build command `npm run build`, output `dist`
- Any static web server

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ — a bilingual, no-backend dental clinic website that gets patients from first visit to confirmed WhatsApp appointment.
