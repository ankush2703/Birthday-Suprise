import { memo, useMemo } from 'react'
import { rng, between, pick } from '../lib/random'
import { HeartShape, SparkleShape, PALETTE } from './Art'

const HEART_COLORS = [PALETTE.rose, PALETTE.blush, PALETTE.baby, PALETTE.lilac, PALETTE.peach]
const CONFETTI_COLORS = [PALETTE.rose, PALETTE.blush, PALETTE.lavender, PALETTE.gold, PALETTE.peach, PALETTE.mint]

function makeHearts(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const dur = between(r, 13, 24)
    return {
      id: i,
      left: between(r, 2, 96),
      size: between(r, 12, 30),
      color: pick(r, HEART_COLORS),
      style: {
        '--dur': `${dur}s`,
        '--delay': `${-between(r, 0, dur)}s`,
        '--sway': `${between(r, -40, 40)}px`,
        '--s': between(r, 0.8, 1.2).toFixed(2),
        '--r0': `${between(r, -20, 20)}deg`,
        '--o': between(r, 0.35, 0.75).toFixed(2),
      },
    }
  })
}

function makeSparkles(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: between(r, 3, 97),
    top: between(r, 4, 94),
    size: between(r, 8, 18),
    color: pick(r, ['#fff', '#fff', '#fff6d6', '#ffe0ec']),
    style: {
      '--dur': `${between(r, 2.4, 5)}s`,
      '--delay': `${-between(r, 0, 5)}s`,
    },
  }))
}

function makeConfetti(count, seed) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const dur = between(r, 9, 16)
    const round = r() > 0.6
    return {
      id: i,
      left: between(r, 0, 100),
      w: between(r, 6, 10),
      h: round ? between(r, 6, 10) : between(r, 10, 16),
      round,
      color: pick(r, CONFETTI_COLORS),
      style: {
        '--dur': `${dur}s`,
        '--delay': `${-between(r, 0, dur)}s`,
        '--drift': `${between(r, -60, 60)}px`,
        '--spin': `${between(r, 360, 900)}deg`,
      },
    }
  })
}

/**
 * The always-on dreamy backdrop: living gradient, grain, floating hearts, twinkles.
 * mood: 'calm' (default) | 'party' (confetti rain) | 'tender' (extra hearts)
 */
function AmbientImpl({ mood = 'calm' }) {
  const hearts = useMemo(
    () => makeHearts(mood === 'tender' ? 20 : mood === 'party' ? 12 : 11, 7),
    [mood],
  )
  const sparkles = useMemo(() => makeSparkles(20, 21), [])
  const confetti = useMemo(() => makeConfetti(mood === 'party' ? 24 : 0, 99), [mood])

  return (
    <div className="dream-bg grain pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <SparkleShape
          key={s.id}
          className="anim-twinkle absolute"
          color={s.color}
          size={s.size}
          style={{ left: `${s.left}%`, top: `${s.top}%`, ...s.style }}
        />
      ))}

      {hearts.map((h) => (
        <HeartShape
          key={h.id}
          className="anim-float-up absolute will-change-transform"
          color={h.color}
          size={h.size}
          style={{ left: `${h.left}%`, bottom: '-8vh', ...h.style }}
        />
      ))}

      {confetti.map((c) => (
        <span
          key={c.id}
          className="anim-confetti absolute top-0 block will-change-transform"
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            background: c.color,
            borderRadius: c.round ? '50%' : 2,
            ...c.style,
          }}
        />
      ))}
    </div>
  )
}

export const Ambient = memo(AmbientImpl)
