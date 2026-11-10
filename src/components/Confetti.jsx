import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { rng, between, pick } from '../lib/random'
import { PALETTE } from './Art'

const COLORS = [
  PALETTE.rose,
  PALETTE.blush,
  PALETTE.lavender,
  PALETTE.gold,
  PALETTE.peach,
  PALETTE.mint,
  '#ffffff',
]

const HEART_D =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

/**
 * A one-shot burst of confetti, hearts and stars from a point.
 * Re-mount it (change its `key`) to fire again.
 * originX / originY are CSS lengths, e.g. '50%' and '60%'.
 */
export function ConfettiBurst({
  count = 48,
  originX = '50%',
  originY = '55%',
  seed = 5,
  power = 1,
}) {
  const reduce = useReducedMotion()

  const pieces = useMemo(() => {
    const r = rng(seed)
    const vh = typeof window === 'undefined' ? 800 : window.innerHeight
    return Array.from({ length: count }, (_, i) => {
      const angle = between(r, -Math.PI * 0.95, -Math.PI * 0.05) // fan upwards
      const speed = between(r, 120, 300) * power
      const kind = r()
      return {
        id: i,
        dx: Math.cos(angle) * speed,
        up: Math.sin(angle) * speed - between(r, 20, 80),
        fall: between(r, 0.35, 0.8) * vh,
        rot: between(r, -720, 720),
        dur: between(r, 2.2, 3.4),
        delay: between(r, 0, 0.12),
        color: pick(r, COLORS),
        shape: kind < 0.22 ? 'heart' : kind < 0.4 ? 'dot' : 'rect',
        size: between(r, 8, 15),
      }
    })
  }, [count, seed, power])

  if (reduce) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{ left: originX, top: originY, width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.4 }}
          animate={{
            x: [0, p.dx, p.dx * 1.18],
            y: [0, p.up, p.up + p.fall],
            rotate: p.rot,
            opacity: [1, 1, 1, 0],
            scale: [0.4, 1, 1],
          }}
          transition={{
            x: { duration: p.dur, delay: p.delay, times: [0, 0.3, 1], ease: ['easeOut', 'linear'] },
            y: { duration: p.dur, delay: p.delay, times: [0, 0.3, 1], ease: ['easeOut', 'easeIn'] },
            rotate: { duration: p.dur, delay: p.delay, ease: 'linear' },
            opacity: { duration: p.dur, delay: p.delay, times: [0, 0.3, 0.75, 1] },
            scale: { duration: p.dur, delay: p.delay, times: [0, 0.12, 1] },
          }}
        >
          {p.shape === 'heart' ? (
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <path d={HEART_D} fill={p.color === '#ffffff' ? PALETTE.rose : p.color} />
            </svg>
          ) : (
            <span
              className="block h-full w-full"
              style={{
                background: p.color,
                borderRadius: p.shape === 'dot' ? '50%' : 2,
                height: p.shape === 'rect' ? '70%' : '100%',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.35)',
              }}
            />
          )}
        </motion.span>
      ))}
    </div>
  )
}
