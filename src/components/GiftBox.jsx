import { motion } from 'motion/react'
import { HeartShape } from './Art'

const lidVariants = {
  idle: {
    rotate: [0, -1.4, 1.4, 0],
    y: 0,
    x: 0,
    opacity: 1,
    transition: { duration: 3.8, ease: 'easeInOut', repeat: Infinity },
  },
  open: {
    y: [0, 6, -92],
    x: [0, 0, -26],
    rotate: [0, 0, -18],
    opacity: [1, 1, 1, 0],
    transition: { duration: 1.1, times: [0, 0.18, 1], ease: ['easeOut', [0.2, 0.8, 0.3, 1]] },
  },
}

/** A hand-drawn-feeling gift box, all SVG. `open` lifts the lid and lets the light out. */
export function GiftBox({ open = false, className = '' }) {
  return (
    <svg viewBox="0 0 260 260" className={className} role="img" aria-label="A little pink gift box with a lilac ribbon">
      <defs>
        <linearGradient id="gb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc2d6" />
          <stop offset="1" stopColor="#ff93b6" />
        </linearGradient>
        <linearGradient id="gb-lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb0ca" />
          <stop offset="1" stopColor="#ff7fa8" />
        </linearGradient>
        <linearGradient id="gb-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9ccff" />
          <stop offset="0.5" stopColor="#efe8ff" />
          <stop offset="1" stopColor="#c4b3f7" />
        </linearGradient>
        <radialGradient id="gb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="1" />
          <stop offset="0.5" stopColor="#ffe3ef" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe3ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gb-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="130" cy="238" rx="86" ry="9" fill="#c98aa6" opacity="0.28" />

      {/* glow + light beam that appear when opened */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.6, delay: open ? 0.25 : 0 }}
      >
        <circle cx="130" cy="104" r="96" fill="url(#gb-glow)" />
        <polygon points="86,112 174,112 206,-40 54,-40" fill="url(#gb-beam)" />
      </motion.g>

      {/* box body */}
      <rect x="42" y="112" width="176" height="120" rx="14" fill="url(#gb-body)" />
      <rect x="42" y="112" width="30" height="120" rx="14" fill="#fff" opacity="0.14" />
      {/* the dark inside of the box, shown once the lid is gone */}
      <motion.rect
        x="48"
        y="110"
        width="164"
        height="12"
        rx="6"
        fill="#e0527f"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />
      {/* ribbon down the front */}
      <rect x="118" y="112" width="24" height="120" fill="url(#gb-ribbon)" />
      <rect x="118" y="112" width="24" height="120" fill="#fff" opacity="0.18" />

      {/* little pattern of hearts on the box */}
      {[
        [66, 160, 0.9],
        [80, 204, 0.7],
        [186, 158, 0.8],
        [196, 204, 1],
        [64, 126, 0.6],
        [204, 130, 0.65],
      ].map(([x, y, s], i) => (
        <HeartShape
          key={i}
          color="#fff"
          size={14 * s}
          x={x - 7 * s}
          y={y - 7 * s}
          opacity="0.55"
        />
      ))}

      {/* lid + bow lift off together */}
      <motion.g
        variants={lidVariants}
        initial="idle"
        animate={open ? 'open' : 'idle'}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      >
        {/* bow tails */}
        <path d="M126 118 C112 134 104 148 98 160 L112 156 L122 168 C124 150 128 134 130 122Z" fill="#c4b3f7" />
        <path d="M134 118 C148 134 156 148 162 160 L148 156 L138 168 C136 150 132 134 130 122Z" fill="#b39ef0" />

        <rect x="32" y="84" width="196" height="42" rx="13" fill="url(#gb-lid)" />
        <rect x="32" y="84" width="196" height="14" rx="7" fill="#fff" opacity="0.28" />
        <rect x="118" y="84" width="24" height="42" fill="url(#gb-ribbon)" />

        {/* bow loops */}
        <path d="M130 84 C92 30 52 58 88 86 C106 98 124 94 130 84Z" fill="#d9ccff" />
        <path d="M130 84 C168 30 208 58 172 86 C154 98 136 94 130 84Z" fill="#cbbcf5" />
        <path d="M130 84 C104 52 80 62 98 82 C110 90 124 90 130 84Z" fill="#efe8ff" opacity="0.8" />
        <path d="M130 84 C156 52 180 62 162 82 C150 90 136 90 130 84Z" fill="#fff" opacity="0.35" />
        <circle cx="130" cy="84" r="12" fill="#b9a5f0" />
        <circle cx="127" cy="81" r="4.5" fill="#fff" opacity="0.5" />
      </motion.g>
    </svg>
  )
}
