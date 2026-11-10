import { motion } from 'motion/react'
import { HEART_PATH } from './Art'

const FLAP = 'M2 8 Q2 0 11 0 H309 Q318 0 318 8 L169 128 Q160 135 151 128 Z'

/**
 * A cream-and-blush envelope, all SVG.
 * When `opened` becomes true: the wax seal pops, the flap folds back and the letter peeks out.
 */
export function Envelope({ opened = false, className = '' }) {
  return (
    <svg
      viewBox="0 -140 320 366"
      className={className}
      role="img"
      aria-label="A blush pink envelope sealed with a heart"
    >
      <defs>
        <linearGradient id="ev-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9f0" />
          <stop offset="1" stopColor="#ffd3e1" />
        </linearGradient>
        <linearGradient id="ev-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc9db" />
          <stop offset="1" stopColor="#ffb3cb" />
        </linearGradient>
        <radialGradient id="ev-seal" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ff8fb4" />
          <stop offset="1" stopColor="#d93f70" />
        </radialGradient>
      </defs>

      <ellipse cx="160" cy="224" rx="132" ry="8" fill="#b57a98" opacity="0.2" />

      {/* back of the envelope */}
      <rect x="0" y="0" width="320" height="220" rx="12" fill="#f3bfd1" />

      {/* the flap once it has folded open: lavender lining, tucked BEHIND the letter */}
      <motion.path
        d={FLAP}
        fill="#e7dcff"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: opened ? -1 : 0 }}
        transition={{ delay: opened ? 0.52 : 0, duration: 0.4, ease: 'easeOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}
      />

      {/* the letter, peeking out */}
      <motion.g
        initial={{ y: 26 }}
        animate={{ y: opened ? -74 : 26 }}
        transition={{ delay: opened ? 0.85 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect x="26" y="18" width="268" height="190" rx="8" fill="#fffaf1" />
        <rect x="26" y="18" width="268" height="190" rx="8" fill="none" stroke="#f3d3dd" strokeWidth="1.5" />
        {[52, 74, 96].map((y) => (
          <line key={y} x1="48" x2="272" y1={y} y2={y} stroke="#ff93b6" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        ))}
      </motion.g>

      {/* front pocket */}
      <path
        d="M0 34 L160 136 L320 34 V208 Q320 220 308 220 H12 Q0 220 0 208Z"
        fill="url(#ev-front)"
      />
      <path d="M2 218 L156 128 M318 218 L164 128" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" fill="none" />

      {/* the closed flap squashes flat against its top edge as the seal breaks */}
      <motion.path
        d={FLAP}
        fill="url(#ev-flap)"
        initial={{ scaleY: 1, opacity: 1 }}
        animate={opened ? { scaleY: 0, opacity: [1, 1, 0] } : { scaleY: 1, opacity: 1 }}
        transition={{ delay: opened ? 0.25 : 0, duration: 0.3, ease: 'easeIn', times: [0, 0.9, 1] }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}
      />

      {/* heart seal */}
      <motion.g
        initial={{ scale: 1, opacity: 1 }}
        animate={opened ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, times: [0, 0.4, 1], ease: 'easeOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      >
        <circle cx="160" cy="126" r="24" fill="url(#ev-seal)" />
        <circle cx="160" cy="126" r="24" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
        <g transform="translate(146 112) scale(1.17)">
          <path d={HEART_PATH} fill="#fff" fillOpacity="0.95" />
        </g>
      </motion.g>
    </svg>
  )
}
