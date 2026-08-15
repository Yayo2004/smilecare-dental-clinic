import { motion } from 'framer-motion'

/**
 * Scroll-reveal wrapper: fades content in and slides it up
 * the first time it enters the viewport.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  ...props
}) {
  const offset = 40
  const initial =
    direction === 'left'
      ? { opacity: 0, x: -offset }
      : direction === 'right'
        ? { opacity: 0, x: offset }
        : direction === 'down'
          ? { opacity: 0, y: -offset }
          : { opacity: 0, y: offset }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
