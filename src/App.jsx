import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Ambient } from './components/Ambient'
import { MusicToggle } from './components/MusicToggle'
import Welcome from './scenes/Welcome'
import Celebration from './scenes/Celebration'
import Letter from './scenes/Letter'
import Ending from './scenes/Ending'
import { MusicBox } from './lib/music'
import { content } from './content'

// The story, in order. Each scene calls a function when it's ready for the next one.
const MOOD = { gift: 'calm', cake: 'party', letter: 'calm', ending: 'tender' }

export default function App() {
  const [scene, setScene] = useState('gift')
  const [musicOn, setMusicOn] = useState(false)
  const music = useRef(null)

  if (!music.current) music.current = new MusicBox(content.musicFile)

  // Music only ever starts from a tap on the toggle.
  const toggleMusic = useCallback(() => {
    if (music.current.playing) {
      music.current.stop()
      setMusicOn(false)
    } else {
      music.current.start()
      setMusicOn(true)
    }
  }, [])

  // Pause the music while the tab/app is in the background.
  useEffect(() => {
    const onVis = () => music.current.setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Ambient mood={MOOD[scene]} />
      <MusicToggle on={musicOn} onToggle={toggleMusic} />

      <AnimatePresence mode="wait">
        {scene === 'gift' && <Welcome key="gift" onDone={() => setScene('cake')} />}
        {scene === 'cake' && <Celebration key="cake" onNext={() => setScene('letter')} />}
        {scene === 'letter' && <Letter key="letter" onNext={() => setScene('ending')} />}
        {scene === 'ending' && <Ending key="ending" onReplay={() => setScene('gift')} />}
      </AnimatePresence>
    </MotionConfig>
  )
}
