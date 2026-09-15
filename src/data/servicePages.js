/** Catalog of individual service pages — slugs, hero images, before/after galleries. */

const SERVICE_PAGES = [
  {
    slug: 'facettes-dentaires-casablanca',
    serviceIndex: 0, // index in services.items (name / description / detail)
    formOptionIndex: 0, // index in form.servicesOptions (prefill value)
    heroImage: '/images/treat-facettes.webp',
    gallery: [
      { before: '/images/fd-apres.webp', after: '/images/fd-avant.webp' },
      { before: '/images/facettes-apres.webp', after: '/images/facettes-avant.webp' },
      { before: '/images/fca-apres.webp', after: '/images/fca-avant.webp' },
    ],
    otherSlugs: ['implants-dentaires-casablanca', 'esthetique-dentaire-casablanca'],
  },
  {
    slug: 'implants-dentaires-casablanca',
    serviceIndex: 1,
    formOptionIndex: 1,
    heroImage: '/images/treat-implants.webp',
    gallery: null,
    otherSlugs: ['facettes-dentaires-casablanca', 'composite-casablanca'],
  },
  {
    slug: 'esthetique-dentaire-casablanca',
    serviceIndex: 2,
    formOptionIndex: 2,
    heroImage: '/images/treat-esthetique.webp',
    gallery: null,
    otherSlugs: ['facettes-dentaires-casablanca', 'orthodontie-casablanca'],
  },
  {
    slug: 'orthodontie-casablanca',
    serviceIndex: 3,
    formOptionIndex: 4,
    heroImage: '/images/treat-ortho.webp',
    gallery: null,
    otherSlugs: ['esthetique-dentaire-casablanca', 'facettes-dentaires-casablanca'],
  },
  {
    slug: 'traitement-canalaire-casablanca',
    serviceIndex: 4,
    formOptionIndex: 3,
    heroImage: '/images/treat-canal.webp',
    gallery: null,
    otherSlugs: ['composite-casablanca', 'esthetique-dentaire-casablanca'],
  },
  {
    slug: 'composite-casablanca',
    serviceIndex: 5,
    formOptionIndex: 5,
    heroImage: '/images/treat-composite.webp',
    gallery: null,
    otherSlugs: ['facettes-dentaires-casablanca', 'esthetique-dentaire-casablanca'],
  },
]

export default SERVICE_PAGES

export const getServicePage = (slug) => SERVICE_PAGES.find((page) => page.slug === slug)