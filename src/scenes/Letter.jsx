import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Scene, PrimaryButton } from '../components/ui'
import { Envelope } from '../components/Envelope'
import { Daisy } from '../components/Flowers'
import { HeartShape, HeartOutline, HEART_PATH, PALETTE } from '../components/Art'
import { useTypewriter } from '../hooks/useTypewriter'
import { content } from '../content'

/** A hand-drawn heart + flourish that "writes itself" at the bottom of the letter. */
function Signature({ show }) {
  return (
    <svg viewBox="0 0 170 64" width="132" className="ml-auto block overflow-visible" aria-hidden="true">
      <motion.path
        d="M6 44 C 22 14, 42 58, 62 32 S 100 20, 112 40"
        fill="none"
        stroke={PALETTE.deepRose}
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      <g transform="translate(112 8) scale(1.9)">
        <motion.g
          initial={{ opacity: 0, scale: 0.2 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.2 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 180, damping: 11 }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 60%' }}
        >
          <path d={HEART_PATH} fill={PALETTE.rose} />
          <path d="M6 7 C 6 5.5, 7.4 4.6, 8.6 5" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.9" strokeLinecap="round" />
        </motion.g>
      </g>
    </svg>
  )
}

/** Scene 4: the envelope opens and the letter writes itself. */
export default function Letter({ onNext }) {
  const reduce = useReducedMotion()
  const [opened, setOpened] = useState(false)
  const [showPaper, setShowPaper] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOpened(true), reduce ? 200 : 1100)
    const t2 = setTimeout(() => setShowPaper(true), reduce ? 700 : 2900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduce])

  const text = content.letter
  const { count, done, finish } = useTypewriter(text, {
    active: showPaper,
    reduced: !!reduce,
    startDelay: 1000,
  })
  const typed = text.slice(0, count)
  const rest = text.slice(count)

  return (
    <Scene className="gap-5">
      {/* 1. the envelope */}
      <AnimatePresence>
        {!showPaper && (
          <motion.div
            key="envelope"
            className="absolute left-1/2 top-1/2 z-10 w-[min(86vw,24rem)] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, y: 120, rotate: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: 90, scale: 0.88, transition: { duration: 0.6, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          >
            <div className={opened ? '' : 'anim-bob'}>
              <Envelope
                opened={opened}
                className="block h-auto w-full drop-shadow-[0_20px_24px_rgba(224,82,127,0.22)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. the letter */}
      {showPaper && (
        <>
          <motion.article
            className="letter-paper relative z-10 w-[min(90vw,28rem)] cursor-default rounded-[14px] px-6 pb-4 pt-9 shadow-[0_24px_50px_-18px_rgba(141,59,92,0.45),0_2px_0_rgba(255,255,255,0.8)_inset] sm:px-9 sm:pb-6 sm:pt-11"
            initial={{ opacity: 0, y: 90, scale: 0.55, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.8 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            onClick={finish}
          >
            {/* washi tape */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-[-2deg] rounded-[3px] opacity-90 shadow-sm"
              style={{
                background:
                  'repeating-linear-gradient(45deg, rgba(255,160,190,0.75) 0 8px, rgba(255,205,222,0.75) 8px 16px)',
              }}
            />
            {/* doodles in the corners */}
            <Daisy className="pointer-events-none absolute -right-3 -top-4 rotate-12" size={48} petal="#ffc2d6" />
            <HeartShape className="pointer-events-none absolute bottom-3 left-3 opacity-60" size={16} color={PALETTE.blush} />
            <HeartShape className="pointer-events-none absolute bottom-7 left-8 opacity-40" size={10} color={PALETTE.lilac} />

            {/* screen readers get the whole letter at once; the animated copy below is hidden from them */}
            <p className="sr-only">{text}</p>

            <p
              aria-hidden="true"
              data-testid="letter-text"
              className="font-hand font-medium text-ink"
              style={{ fontSize: 'var(--fs)', lineHeight: 'var(--lh)' }}
            >
              <span>{typed}</span>
              {/* a little heart "pen" that follows the writing */}
              <span className="relative">
                {!done && (
                  <HeartShape
                    className="anim-heartbeat pointer-events-none absolute"
                    size={13}
                    color={PALETTE.rose}
                    style={{ left: 3, top: '0.5em' }}
                  />
                )}
              </span>
              <span className="select-none text-transparent">{rest}</span>
            </p>

            <div className="mt-1 h-[3.4rem]">
              <Signature show={done} />
            </div>
          </motion.article>

          {/* room is always reserved for the button so nothing jumps when it appears */}
          <motion.div
            className="relative z-10"
            style={{ visibility: done ? 'visible' : 'hidden' }}
            initial={{ opacity: 0, y: 12 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            <PrimaryButton onClick={onNext} tabIndex={done ? 0 : -1}>
              {content.letterContinue}
              <HeartOutline size={22} />
            </PrimaryButton>
          </motion.div>
        </>
      )}
    </Scene>
  )
}
