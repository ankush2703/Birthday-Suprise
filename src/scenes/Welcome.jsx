import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Scene, PrimaryButton } from '../components/ui'
import { GiftBox } from '../components/GiftBox'
import { ConfettiBurst } from '../components/Confetti'
import { HeartShape, HeartOutline, InlineHeart, SparkleShape, PALETTE } from '../components/Art'
import { rng, between, pick } from '../lib/random'
import { content } from '../content'

const SPARKLES = [
  { x: '8%', y: '12%', s: 20, d: 0 },
  { x: '86%', y: '8%', s: 14, d: 0.8 },
  { x: '94%', y: '52%', s: 18, d: 1.4 },
  { x: '2%', y: '60%', s: 12, d: 2 },
  { x: '78%', y: '92%', s: 16, d: 0.4 },
  { x: '18%', y: '94%', s: 12, d: 1.1 },
]

/** Scene 1 + 2: the welcome screen, and the gift opening when she taps the button. */
export default function Welcome({ onDone }) {
  const reduce = useReducedMotion()
  const [opening, setOpening] = useState(false)
  const [burst, setBurst] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const risingHearts = useMemo(() => {
    const r = rng(11)
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: between(r, -120, 120),
      y: between(r, -260, -150),
      size: between(r, 16, 30),
      delay: between(r, 0, 0.35),
      color: pick(r, [PALETTE.rose, PALETTE.blush, PALETTE.lilac, PALETTE.peach, '#fff']),
      rot: between(r, -30, 30),
    }))
  }, [])

  const open = () => {
    if (opening) return
    setOpening(true)
    timers.current.push(setTimeout(() => setBurst(true), reduce ? 0 : 520))
    timers.current.push(setTimeout(onDone, reduce ? 1000 : 2700))
  }

  return (
    <Scene className="gap-7 sm:gap-9">
      {burst && <ConfettiBurst originX="50%" originY="38%" count={60} seed={3} />}

      {/* sparkles scattered around the scene */}
      {SPARKLES.map((s, i) => (
        <SparkleShape
          key={i}
          className="anim-twinkle absolute"
          color="#fff"
          size={s.s}
          style={{ left: s.x, top: s.y, '--delay': `${s.d}s`, '--dur': '3.2s' }}
        />
      ))}

      {/* the gift */}
      <motion.div
        className="relative w-[min(74vw,19rem)] sm:w-80"
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 14, delay: 0.15 }}
      >
        {/* sunburst behind the box */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[40%] h-[230%] w-[230%] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: 0.8, delay: opening ? 0.35 : 0 }}
        >
          <motion.div
            className="h-full w-full"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.7) 0deg 7deg, rgba(255,255,255,0) 7deg 22deg)',
              WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 62%)',
              maskImage: 'radial-gradient(circle, #000 0%, transparent 62%)',
            }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
          />
        </motion.div>

        <div className={opening ? '' : 'anim-bob'} style={{ '--dur': '4.2s' }}>
          <GiftBox open={opening} className="relative block h-auto w-full drop-shadow-[0_18px_22px_rgba(224,82,127,0.25)]" />
        </div>

        {/* hearts that float out of the box */}
        {opening &&
          !reduce &&
          risingHearts.map((h) => (
            <motion.div
              key={h.id}
              className="pointer-events-none absolute left-1/2 top-[40%]"
              style={{ marginLeft: -h.size / 2 }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
              animate={{ opacity: [0, 1, 1, 0], x: h.x, y: h.y, scale: [0.3, 1.1, 1], rotate: h.rot }}
              transition={{ duration: 1.7, delay: 0.55 + h.delay, ease: 'easeOut', times: [0, 0.2, 0.7, 1] }}
            >
              <HeartShape color={h.color} size={h.size} />
            </motion.div>
          ))}
      </motion.div>

      {/* words + button fade away as the gift opens */}
      <motion.div
        className="flex flex-col items-center gap-7 text-center sm:gap-9"
        animate={{ opacity: opening ? 0 : 1, y: opening ? 14 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="max-w-[17rem] text-balance font-script text-[2.1rem] font-semibold leading-[1.15] text-berry drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] sm:max-w-md sm:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {content.welcome.line}
          <InlineHeart />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <PrimaryButton onClick={open} disabled={opening} aria-label={content.welcome.button}>
            {content.welcome.button}
            <HeartOutline size={22} />
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </Scene>
  )
}
