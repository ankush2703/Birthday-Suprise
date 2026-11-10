import { motion } from 'motion/react'
import { HeartShape } from './Art'

const CANDLES = [118, 150, 182]

const flameVariants = {
  hidden: { scale: 0, opacity: 0 },
  lit: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 1 + i * 0.22, type: 'spring', stiffness: 220, damping: 12 },
  }),
  out: (i) => ({
    scale: 0,
    opacity: 0,
    transition: { delay: i * 0.12, duration: 0.25, ease: 'easeIn' },
  }),
}

/**
 * Two-tier birthday cake, all SVG.
 * state: 'lit' | 'out'   (flames appear a moment after the cake does)
 */
export function Cake({ state = 'lit', className = '' }) {
  const lit = state === 'lit'
  const stage = lit ? 'lit' : 'out'

  return (
    <svg viewBox="0 0 300 320" className={className} role="img" aria-label="A pink two-tier birthday cake with candles">
      <defs>
        <linearGradient id="ck-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd3e2" />
          <stop offset="1" stopColor="#ffb8d0" />
        </linearGradient>
        <linearGradient id="ck-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4e6" />
          <stop offset="1" stopColor="#ffe3cc" />
        </linearGradient>
        <pattern id="ck-stripe" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="9" height="9" fill="#fff" />
          <rect width="4.5" height="9" fill="#ff9fbf" />
        </pattern>
        <radialGradient id="ck-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff2b8" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffd9a0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ck-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ffe27a" />
        </linearGradient>
      </defs>

      {/* plate */}
      <ellipse cx="150" cy="303" rx="112" ry="8" fill="#b57a98" opacity="0.22" />
      <ellipse cx="150" cy="294" rx="136" ry="17" fill="#d6c8fb" />
      <ellipse cx="150" cy="289" rx="136" ry="15" fill="#f6f0ff" />

      {/* bottom tier */}
      <rect x="44" y="200" width="212" height="88" rx="18" fill="url(#ck-bottom)" />
      <rect x="44" y="200" width="36" height="88" rx="18" fill="#fff" opacity="0.14" />
      {/* cream frosting + drips */}
      <rect x="38" y="192" width="224" height="22" rx="11" fill="#fffaf3" />
      {[
        [58, 20],
        [94, 32],
        [132, 22],
        [170, 36],
        [208, 22],
        [240, 28],
      ].map(([cx, h], i) => (
        <rect key={i} x={cx - 8} y="204" width="16" height={h} rx="8" fill="#fffaf3" />
      ))}
      {/* piping along the base */}
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={62 + i * 22} cy="283" r="9.5" fill="#fffaf3" />
      ))}
      {/* hearts + dots on the tier */}
      {[70, 118, 182, 230].map((x, i) => (
        <HeartShape key={x} color="#fff" size={i % 2 ? 15 : 19} x={x - (i % 2 ? 7.5 : 9.5)} y={i % 2 ? 252 : 246} opacity="0.85" />
      ))}
      {[94, 150, 206].map((x) => (
        <circle key={x} cx={x} cy="258" r="3.2" fill="#ff93b6" />
      ))}

      {/* top tier */}
      <rect x="80" y="132" width="140" height="78" rx="16" fill="url(#ck-top)" />
      <rect x="80" y="132" width="26" height="78" rx="14" fill="#fff" opacity="0.35" />
      {/* piping at the bottom of the top tier */}
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={98 + i * 17} cy="207" r="7.5" fill="#ffb3cc" />
      ))}
      {/* sprinkles */}
      {[
        [96, 178, 30, '#ff93b6'],
        [124, 190, -20, '#b9a5f0'],
        [176, 184, 50, '#ffc17a'],
        [204, 172, -35, '#ff93b6'],
        [112, 164, -50, '#8fd3b6'],
        [190, 198, 15, '#b9a5f0'],
      ].map(([x, y, r, c], i) => (
        <rect key={i} x={x - 5} y={y - 1.5} width="10" height="3" rx="1.5" fill={c} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <HeartShape color="#ff7aa8" size={26} x={137} y={168} />
      {/* rose frosting + drips */}
      <rect x="76" y="124" width="148" height="22" rx="11" fill="#ff9fbf" />
      {[
        [94, 20],
        [124, 32],
        [158, 22],
        [190, 30],
        [210, 18],
      ].map(([cx, h], i) => (
        <rect key={i} x={cx - 8} y="136" width="16" height={h} rx="8" fill="#ff9fbf" />
      ))}
      <rect x="76" y="124" width="148" height="8" rx="4" fill="#fff" opacity="0.25" />

      {/* candles */}
      {CANDLES.map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 4.5} y="86" width="9" height="46" rx="3" fill="url(#ck-stripe)" />
          <rect x={cx - 4.5} y="86" width="3" height="46" rx="1.5" fill="#fff" opacity="0.4" />
          <rect x={cx - 0.7} y="80" width="1.4" height="7" rx="0.7" fill="#6b4a5c" />

          {/* the flame */}
          <g transform={`translate(${cx} 80)`}>
            <motion.g
              custom={i}
              variants={flameVariants}
              initial="hidden"
              animate={stage}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
            >
              <circle cx="0" cy="-14" r="26" fill="url(#ck-glow)" />
              <g className="anim-flame" style={{ animationDelay: `${i * 0.18}s` }}>
                <path d="M0 0 C7.5 -8 6.5 -18 0 -28 C-6.5 -18 -7.5 -8 0 0Z" fill="url(#ck-flame)" />
                <path d="M0 -1 C3.4 -5 3 -10 0 -15 C-3 -10 -3.4 -5 0 -1Z" fill="#fffbe0" />
              </g>
            </motion.g>

            {/* a little wisp of smoke once blown out */}
            {!lit && (
              <motion.path
                d="M0 -2 C7 -12 -7 -20 0 -32 C5 -40 -4 -46 0 -56"
                fill="none"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.9, y: 0 }}
                animate={{ pathLength: 1, opacity: 0, y: -14 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 1.5, ease: 'easeOut' }}
              />
            )}
          </g>
        </g>
      ))}
    </svg>
  )
}
