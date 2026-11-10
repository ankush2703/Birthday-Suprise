import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { Scene, PrimaryButton } from '../components/ui'
import { GrowingFlower } from '../components/Flowers'
import { HeartShape, InlineHeart, PALETTE } from '../components/Art'
import { content } from '../content'

const FLOWERS = [
  { kind: 'daisy', petal: '#ffc2d6', center: '#ffd98a', left: '-4%', h: 150, delay: 0.5, dur: 5.6 },
  { kind: 'tulip', petal: '#ff93b6', center: '#ffc2d6', left: '14%', h: 190, delay: 0.8, dur: 6.2 },
  { kind: 'daisy', petal: '#e4d9ff', center: '#ffd98a', left: '30%', h: 140, delay: 1.1, dur: 5 },
  { kind: 'tulip', petal: '#ffc9ad', center: '#fff1e0', left: '46%', h: 200, delay: 0.65, dur: 6.6 },
  { kind: 'daisy', petal: '#ffffff', center: '#ffb7cf', left: '62%', h: 160, delay: 1.0, dur: 5.4 },
  { kind: 'tulip', petal: '#cbbcf5', center: '#efe8ff', left: '77%', h: 180, delay: 0.9, dur: 6 },
]

const TAP_COLORS = [PALETTE.rose, PALETTE.blush, PALETTE.lilac, PALETTE.peach, '#ff5f93']

/** Scene 5: the sweet ending – flowers bloom, hearts float, tap anywhere for more love. */
export default function Ending({ onReplay }) {
  const [taps, setTaps] = useState([])

  const addHeart = useCallback((e) => {
    if (e.target.closest('button')) return
    const id = `${Date.now()}-${Math.random()}`
    const size = 20 + Math.random() * 22
    setTaps((list) =>
      [
        ...list.slice(-24),
        {
          id,
          x: e.clientX,
          y: e.clientY,
          size,
          drift: (Math.random() - 0.5) * 90,
          color: TAP_COLORS[Math.floor(Math.random() * TAP_COLORS.length)],
        },
      ],
    )
  }, [])

  const removeHeart = useCallback((id) => setTaps((list) => list.filter((t) => t.id !== id)), [])

  return (
    <Scene
      className="gap-4 sm:gap-5"
      onPointerDown={addHeart}
      style={{
        paddingTop: 'max(4rem, calc(env(safe-area-inset-top) + 3.6rem))',
        paddingBottom: 'max(24dvh, 9rem)',
      }}
    >
      {/* flowers growing along the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[30dvh] [@media(max-height:520px)]:hidden" aria-hidden="true">
        {/* a soft grassy hill */}
        <motion.div
          className="absolute -bottom-8 left-1/2 h-24 w-[130%] -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-[#cdeedd] to-[#dff5e8]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {FLOWERS.map((f, i) => (
          <div key={i} className="absolute bottom-[-4px]" style={{ left: f.left }}>
            <GrowingFlower
              kind={f.kind}
              petal={f.petal}
              center={f.center}
              height={f.h}
              delay={f.delay}
              swayDur={f.dur}
              className="origin-bottom"
            />
          </div>
        ))}
      </div>

      {/* a big pulsing heart */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 11, delay: 0.2 }}
      >
        <div className="anim-heartbeat relative">
          <svg viewBox="0 0 24 24" className="block h-24 w-24 drop-shadow-[0_14px_16px_rgba(224,82,127,0.35)] sm:h-28 sm:w-28" aria-hidden="true">
            <defs>
              <linearGradient id="end-heart" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffa3c2" />
                <stop offset="1" stopColor="#e0527f" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#end-heart)"
            />
            <path d="M6.2 7.4c.3-1.5 1.6-2.4 3-2.2" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      <motion.h1
        className="relative z-10 max-w-[19rem] text-balance text-center font-script text-[2.1rem] font-bold leading-[1.15] text-berry drop-shadow-[0_2px_0_rgba(255,255,255,0.75)] sm:max-w-xl sm:text-5xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9 }}
      >
        {content.ending.title}
        <InlineHeart />
      </motion.h1>

      <motion.p
        className="relative z-10 max-w-[18rem] text-balance text-center font-serif text-xl font-medium italic leading-snug text-berry/85 sm:max-w-md sm:text-2xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.9 }}
      >
        {content.ending.wish}
      </motion.p>

      <motion.div
        className="relative z-10 mt-1 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.8 }}
      >
        <PrimaryButton onClick={onReplay} pulse={false} className="!min-h-12 !px-7 !py-3 !text-lg">
          <RotateCcw size={19} strokeWidth={2.4} aria-hidden="true" />
          {content.ending.replay}
        </PrimaryButton>
        <p className="font-serif text-sm italic text-berry/60">{content.ending.tapHint}</p>
      </motion.div>

      {/* hearts that pop up wherever she taps */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {taps.map((t) => (
            <motion.div
              key={t.id}
              className="absolute"
              style={{ left: t.x - t.size / 2, top: t.y - t.size / 2 }}
              initial={{ opacity: 0, scale: 0.2, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 1.2, 1, 1], y: -150, x: t.drift }}
              transition={{ duration: 1.8, ease: 'easeOut', times: [0, 0.15, 0.7, 1] }}
              onAnimationComplete={() => removeHeart(t.id)}
            >
              <HeartShape color={t.color} size={t.size} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Scene>
  )
}
