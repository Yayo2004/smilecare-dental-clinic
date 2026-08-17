/**
 * Shared Framer Motion animation variants.
 * All timing/easing defined here — imported by every component.
 *
 * prefers-reduced-motion is handled globally via <MotionConfig reducedMotion="user">
 * in App.jsx, so these variants don't need manual checks.
 */

// ── Entrance animations (triggered by whileInView) ──────────────────

export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// ── Stagger containers ──────────────────────────────────────────────

export const staggerContainer = (staggerAmount = 0.12) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: 0.08,
    },
  },
})

// ── Hover / press interactions ──────────────────────────────────────

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.97 },
}

// ── Shared viewport config (once, 20% visible) ─────────────────────

export const viewport = { once: true, amount: 0.2 }
