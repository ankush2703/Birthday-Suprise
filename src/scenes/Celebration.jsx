import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Scene, PrimaryButton } from '../components/ui'
import { Cake } from '../components/Cake'
import { Balloons } from '../components/Balloons'
import { ConfettiBurst } from '../components/Confetti'
import { HeartOutline, InlineHeart } from '../components/Art'
import { content } from '../content'

const titleWords = content.celebration.title.split(' ')

/** Scene 3: Happy Birthday! Tap the candles to blow them out. */
export default function Celebration({ onNext, onWish }) {
  const [blown, setBlown] = useState(false)
  const [burst, setBurst] = useState(0)
  const timers = useRef([])

  useEffect(() => {
    // a little welcome burst when the scene appears
    const t = setTimeout(() => setBurst(1), 500)
    return () => {
      clearTimeout(t)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const blowOut = () => {
    if (blown) return
    setBlown(true)
    onWish?.()
    timers.current.push(setTimeout(() => setBurst(2), 450))
  }

  const CakeWrapper = blown ? 'div' : 'button'
  const wrapperProps = blown
    ? {}
    : { type: 'button', onClick: blowOut, 'aria-label': 'Blow out the candles' }

  return (
    <Scene className="gap-3 sm:gap-4">
      <Balloons />
      {burst === 1 && <ConfettiBurst key="b1" originX="50%" originY="18%" count={44} seed={8} power={0.9} />}
      {burst === 2 && <ConfettiBurst key="b2" originX="50%" originY="46%" count={64} seed={19} power={1.15} />}

      <h1 className="relative z-10 max-w-[20rem] text-center font-script text-[2.45rem] font-bold leading-[1.1] text-berry drop-shadow-[0_2px_0_rgba(255,255,255,0.75)] sm:max-w-none sm:text-6xl">
        {titleWords.map((w, i) => (
          <Fragment key={i}>
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 22, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.25 + i * 0.13, type: 'spring', stiffness: 160, damping: 14 }}
            >
              {w}
              {i === titleWords.length - 1 && <InlineHeart />}
            </motion.span>
            {i < titleWords.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </h1>

      <motion.div
        className="relative z-10 w-[min(80vw,21rem)] sm:w-[22rem]"
        initial={{ opacity: 0, y: 70, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 0.5 }}
      >
        <CakeWrapper
          {...wrapperProps}
          className={`block w-full rounded-3xl bg-transparent p-0 ${blown ? '' : 'cursor-pointer'}`}
        >
          <Cake
            state={blown ? 'out' : 'lit'}
            className="block h-auto w-full drop-shadow-[0_18px_20px_rgba(224,82,127,0.22)]"
          />
        </CakeWrapper>
      </motion.div>

      <div className="relative z-10 flex min-h-[7.5rem] w-full flex-col items-center justify-start gap-4 text-center">
        <AnimatePresence mode="wait">
          {!blown ? (
            <motion.p
              key="before"
              className="max-w-[17rem] text-balance font-serif text-xl font-medium italic leading-snug text-berry/85 sm:max-w-sm sm:text-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: blown ? 0 : 1.6, duration: 0.7 }}
            >
              {content.celebration.hintBefore}
            </motion.p>
          ) : (
            <motion.div
              key="after"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <p className="max-w-[17rem] text-balance font-serif text-xl font-medium italic leading-snug text-berry/85 sm:max-w-sm sm:text-2xl">
                {content.celebration.hintAfter}
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.95, type: 'spring', stiffness: 200, damping: 14 }}
              >
                <PrimaryButton onClick={onNext}>
                  {content.celebration.button}
                  <HeartOutline size={22} />
                </PrimaryButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Scene>
  )
}
