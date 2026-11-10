import { motion } from 'motion/react'

/** A simple daisy-style flower head, used as decoration (no animation). */
export function Daisy({ petal = '#ffc2d6', center = '#ffd98a', size = 40, className = '', style }) {
  return (
    <svg viewBox="-30 -30 60 60" width={size} height={size} className={className} style={style} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-16" rx="7.5" ry="13" fill={petal} transform={`rotate(${i * 45})`} />
      ))}
      <circle r="9" fill={center} />
      <circle cx="-2.5" cy="-2.5" r="3.2" fill="#fff" opacity="0.55" />
    </svg>
  )
}

const LEAF_L = 'M50 150 C28 152 16 136 14 122 C34 122 48 132 50 150Z'
const LEAF_R = 'M50 128 C72 130 84 114 86 100 C66 100 52 110 50 128Z'

/**
 * A flower that grows from the ground: stem draws up, leaves unfurl, then the bloom opens.
 * kind: 'daisy' | 'tulip'
 */
export function GrowingFlower({ kind = 'daisy', petal, center, delay = 0, height = 200, className = '', swayDur = 5 }) {
  const stemColor = '#8fd3b6'
  const leafColor = '#a9dfc6'
  const bloomDelay = delay + 1.05

  return (
    <div className={`anim-sway ${className}`} style={{ '--dur': `${swayDur}s`, '--delay': `${-delay * 2}s` }}>
      <svg viewBox="0 0 100 200" height={height} className="block overflow-visible" aria-hidden="true">
        <motion.path
          d="M50 200 C46 160 56 120 50 70"
          fill="none"
          stroke={stemColor}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay, duration: 1.2, ease: 'easeOut' }}
        />
        <motion.path
          d={LEAF_L}
          fill={leafColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.7, type: 'spring', stiffness: 160, damping: 12 }}
          style={{ transformBox: 'fill-box', transformOrigin: '100% 100%' }}
        />
        <motion.path
          d={LEAF_R}
          fill={leafColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.85, type: 'spring', stiffness: 160, damping: 12 }}
          style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}
        />

        <motion.g
          initial={{ scale: 0, rotate: -50 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: bloomDelay, type: 'spring', stiffness: 120, damping: 9 }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 85%' }}
        >
          {kind === 'daisy' ? (
            <g transform="translate(50 44)">
              {Array.from({ length: 8 }, (_, i) => (
                <ellipse key={i} cx="0" cy="-17" rx="8.5" ry="15" fill={petal} transform={`rotate(${i * 45})`} />
              ))}
              <circle r="10.5" fill={center} />
              <circle cx="-3" cy="-3" r="3.6" fill="#fff" opacity="0.55" />
            </g>
          ) : (
            <g transform="translate(50 46)">
              <path d="M-20 14 C-24 -16 -14 -32 0 -38 C14 -32 24 -16 20 14 C12 24 -12 24 -20 14Z" fill={petal} />
              <path d="M-4 20 C-18 6 -16 -24 -8 -32 C0 -22 2 4 -4 20Z" fill="#fff" opacity="0.22" />
              <path d="M0 -38 C-9 -28 -10 -6 0 20 C10 -6 9 -28 0 -38Z" fill={center} opacity="0.85" />
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  )
}
