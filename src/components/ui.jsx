import { motion } from 'motion/react'

const sceneVariants = {
  initial: { opacity: 0, scale: 0.97, y: 14 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.45, ease: 'easeIn' },
  },
}

/** Every screen of the story is one of these: it fills the phone screen, no scrolling. */
export function Scene({ children, className = '', ...rest }) {
  return (
    <motion.main
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative z-10 mx-auto flex h-dvh w-full max-w-2xl flex-col items-center justify-center-safe overflow-y-auto overflow-x-hidden px-6 py-8 ${className}`}
      style={{
        paddingTop: 'max(4.4rem, calc(env(safe-area-inset-top) + 3.8rem))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
      {...rest}
    >
      {children}
    </motion.main>
  )
}

/** The one main button style used across the story. */
export function PrimaryButton({ children, className = '', pulse = true, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-br from-rose to-deep-rose px-9 py-4 font-serif text-xl font-semibold tracking-wide text-white shadow-[0_12px_30px_-8px_rgba(224,82,127,0.65),inset_0_1px_0_rgba(255,255,255,0.45)] ${className}`}
      {...props}
    >
      <span className={`flex items-center gap-2.5 ${pulse ? 'anim-heartbeat' : ''}`}>{children}</span>
      <span className="btn-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />
    </motion.button>
  )
}
