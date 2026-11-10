import { motion } from 'motion/react'
import { Music, VolumeX } from 'lucide-react'

/** Always-visible, always-optional music switch (starts OFF; only plays after she taps it). */
export function MusicToggle({ on, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? 'Turn the music off' : 'Turn the music on'}
      className="fixed z-50 flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 font-serif text-base font-semibold text-berry shadow-[0_8px_20px_-8px_rgba(141,59,92,0.35)] backdrop-blur-md"
      style={{
        top: 'max(0.9rem, env(safe-area-inset-top))',
        right: 'max(0.9rem, env(safe-area-inset-right))',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      whileTap={{ scale: 0.94 }}
    >
      {on ? (
        <span className="flex items-end gap-[3px]" aria-hidden="true">
          <Music size={18} strokeWidth={2.3} />
        </span>
      ) : (
        <VolumeX size={18} strokeWidth={2.3} aria-hidden="true" />
      )}
      <span>{on ? 'Music on' : 'Music off'}</span>
    </motion.button>
  )
}
