import { motion } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.9, delay: 1.8, ease: 'easeInOut' }}
      onAnimationComplete={onDone}
      aria-hidden="true"
    >
      <motion.img
        src="/logo.png"
        alt=""
        draggable={false}
        className="h-24 w-auto object-contain sm:h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}