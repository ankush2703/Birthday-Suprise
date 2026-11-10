import { motion } from 'motion/react'

const BALLOONS = [
  { color: '#ff9fbf', shade: '#f27ba3', w: 62, left: '-1%', top: '8%', delay: 0.1, dur: 5.2, high: true },
  { color: '#cbbcf5', shade: '#ab97ec', w: 46, left: '8%', top: '42%', delay: 0.35, dur: 6.4 },
  { color: '#ffc9ad', shade: '#f7a987', w: 66, right: '-2%', top: '6%', delay: 0.25, dur: 5.8, high: true },
  { color: '#ffe7a8', shade: '#f6cf6d', w: 44, right: '8%', top: '45%', delay: 0.5, dur: 6.8 },
]

function Balloon({ color, shade, w }) {
  return (
    <svg viewBox="0 0 60 142" width={w} className="block overflow-visible" aria-hidden="true">
      <path
        d="M30 2C50 2 58 22 56 40C54 58 40 70 30 72C20 70 6 58 4 40C2 22 10 2 30 2Z"
        fill={color}
      />
      <path
        d="M56 40C54 58 40 70 30 72C42 66 50 52 50 38C50 24 44 10 34 4C50 6 58 22 56 40Z"
        fill={shade}
        opacity="0.55"
      />
      <ellipse cx="19" cy="24" rx="5.5" ry="10" transform="rotate(18 19 24)" fill="#fff" opacity="0.5" />
      <path d="M30 71 L25.5 80 L34.5 80Z" fill={shade} />
      <path
        d="M30 80C24 91 36 101 30 112C24 123 35 131 30 142"
        fill="none"
        stroke="#c9a0b8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Four pastel balloons that rise into place, then sway gently. */
export function Balloons() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute ${b.high ? '[@media(max-height:720px)]:hidden' : ''}`}
          style={{ left: b.left, right: b.right, top: b.top }}
          initial={{ y: 560, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.9, delay: b.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="anim-sway" style={{ '--dur': `${b.dur}s`, '--delay': `${-i}s` }}>
            <Balloon {...b} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
