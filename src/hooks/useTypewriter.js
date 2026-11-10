import { useCallback, useEffect, useRef, useState } from 'react'

// How long to pause after each character, so it feels like someone is really writing.
function delayFor(ch) {
  if (ch === '.' || ch === '!' || ch === '?') return 460
  if (ch === ',' || ch === ')') return 220
  if (ch === ' ') return 30
  return 36 + Math.random() * 22
}

/**
 * Reveals `text` one character at a time once `active` is true.
 * Returns how many characters are visible, whether it's finished, and a finish() to skip ahead.
 * With reduced motion the whole text is shown straight away.
 */
export function useTypewriter(text, { active = true, reduced = false, startDelay = 500 } = {}) {
  const [count, setCount] = useState(0)
  const stopped = useRef(false)

  useEffect(() => {
    if (!active) return undefined
    stopped.current = false
    if (reduced) {
      setCount(text.length)
      return undefined
    }
    let i = 0
    let timer
    const tick = () => {
      if (stopped.current) return
      i += 1
      setCount(i)
      if (i >= text.length) return
      timer = setTimeout(tick, delayFor(text[i - 1]))
    }
    timer = setTimeout(tick, startDelay)
    return () => {
      stopped.current = true
      clearTimeout(timer)
    }
  }, [active, text, reduced, startDelay])

  const finish = useCallback(() => {
    stopped.current = true
    setCount(text.length)
  }, [text])

  return { count, done: count >= text.length, finish }
}
