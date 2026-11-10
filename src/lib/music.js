// A tiny original music-box lullaby, generated live with the Web Audio API.
// No audio files needed, nothing to download, nothing copyrighted.
//
// If you'd rather use your own song, set `musicFile` in src/content.js and this
// engine will play that file instead (see README).

const NAMES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const hz = (name) => {
  const [, letter, accidental, octave] = name.match(/^([A-G])(#|b)?(\d)$/)
  const midi = 12 * (Number(octave) + 1) + NAMES[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0)
  return 440 * 2 ** ((midi - 69) / 12)
}

const EIGHTH = 0.43 // seconds per eighth-note (a slow, sleepy ~70 bpm feel)

// 8 bars: C – Am – F – G – C – Em – F – G
const BARS = [
  { bass: 'C3', arp: ['E4', 'G4', 'C5'], melody: [[0, 'E5'], [3, 'G5'], [4, 'C6'], [6, 'B5']] },
  { bass: 'A2', arp: ['E4', 'A4', 'C5'], melody: [[0, 'A5'], [3, 'C6'], [4, 'E6'], [6, 'D6']] },
  { bass: 'F2', arp: ['F4', 'A4', 'C5'], melody: [[0, 'C6'], [3, 'A5'], [4, 'F5'], [6, 'G5']] },
  { bass: 'G2', arp: ['D4', 'G4', 'B4'], melody: [[0, 'B5'], [4, 'D6'], [6, 'G5']] },
  { bass: 'C3', arp: ['E4', 'G4', 'C5'], melody: [[0, 'E5'], [3, 'G5'], [4, 'C6'], [6, 'D6']] },
  { bass: 'E3', arp: ['E4', 'G4', 'B4'], melody: [[0, 'E6'], [3, 'D6'], [4, 'B5'], [6, 'G5']] },
  { bass: 'F2', arp: ['F4', 'A4', 'C5'], melody: [[0, 'A5'], [3, 'C6'], [4, 'A5'], [6, 'F5']] },
  { bass: 'G2', arp: ['D4', 'G4', 'B4'], melody: [[0, 'G5'], [3, 'B5'], [4, 'D6']] },
]
const ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1]

export class MusicBox {
  constructor(file = null) {
    this.file = file
    this.ctx = null
    this.master = null
    this.audio = null
    this.timer = null
    this.step = 0
    this.nextTime = 0
    this.playing = false
  }

  /** Must be called from a tap/click (browsers block audio until the person interacts). */
  async start() {
    if (this.playing) return
    this.playing = true

    if (this.file) {
      try {
        if (!this.audio) {
          this.audio = new Audio(this.file)
          this.audio.loop = true
        }
        this.audio.volume = 0
        await this.audio.play()
        this.#fadeAudio(0.55)
        return
      } catch {
        // file missing or blocked → quietly fall back to the built-in lullaby
        this.audio = null
      }
    }
    this.#startSynth()
  }

  stop() {
    if (!this.playing) return
    this.playing = false
    if (this.audio) {
      this.#fadeAudio(0, () => this.audio && this.audio.pause())
      return
    }
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(this.master.gain.value, now)
      this.master.gain.linearRampToValueAtTime(0, now + 0.7)
      clearInterval(this.timer)
      this.timer = null
      setTimeout(() => {
        if (!this.playing && this.ctx) this.ctx.suspend()
      }, 800)
    }
  }

  /** Pause while the tab is hidden, resume when she comes back. */
  setHidden(hidden) {
    if (!this.playing) return
    if (this.audio) {
      hidden ? this.audio.pause() : this.audio.play().catch(() => {})
      return
    }
    if (!this.ctx) return
    if (hidden) this.ctx.suspend()
    else this.ctx.resume()
  }

  // ─── internals ───────────────────────────────────────────────

  #fadeAudio(target, done) {
    const a = this.audio
    if (!a) return
    clearInterval(this.fade)
    this.fade = setInterval(() => {
      const diff = target - a.volume
      if (Math.abs(diff) < 0.03) {
        a.volume = target
        clearInterval(this.fade)
        done?.()
      } else {
        a.volume = Math.min(1, Math.max(0, a.volume + Math.sign(diff) * 0.03))
      }
    }, 40)
  }

  #startSynth() {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    if (!this.ctx) {
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0
      this.master.connect(this.ctx.destination)

      // dreamy echo
      this.bus = this.ctx.createGain()
      this.bus.connect(this.master)
      const delay = this.ctx.createDelay(1)
      delay.delayTime.value = EIGHTH * 1.5
      const feedback = this.ctx.createGain()
      feedback.gain.value = 0.38
      const tone = this.ctx.createBiquadFilter()
      tone.type = 'lowpass'
      tone.frequency.value = 2600
      const wet = this.ctx.createGain()
      wet.gain.value = 0.42
      this.bus.connect(delay)
      delay.connect(tone)
      tone.connect(feedback)
      feedback.connect(delay)
      tone.connect(wet)
      wet.connect(this.master)
    }
    this.ctx.resume()
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0.55, now + 1.2)

    this.step = 0
    this.nextTime = now + 0.15
    clearInterval(this.timer)
    this.timer = setInterval(() => this.#schedule(), 90)
    this.#schedule()
  }

  #schedule() {
    if (!this.ctx) return
    while (this.nextTime < this.ctx.currentTime + 0.4) {
      const bar = BARS[Math.floor(this.step / 8) % BARS.length]
      const pos = this.step % 8
      const t = this.nextTime

      if (pos === 0) this.#bass(bar.bass, t)
      this.#bell(bar.arp[ARP_PATTERN[pos]], t, 0.07, 1.0)
      for (const [p, note] of bar.melody) if (p === pos) this.#bell(note, t, 0.16, 2.1)

      this.nextTime += EIGHTH
      this.step += 1
    }
  }

  #bell(name, t, peak, length) {
    const f = hz(name)
    const parts = [
      [1, 1, length],
      [2.01, 0.28, length * 0.5],
      [3.98, 0.07, length * 0.2],
    ]
    for (const [mult, level, len] of parts) {
      const osc = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f * mult
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak * level, t + 0.006)
      g.gain.exponentialRampToValueAtTime(0.0001, t + len)
      osc.connect(g)
      g.connect(this.bus)
      osc.start(t)
      osc.stop(t + len + 0.05)
    }
  }

  #bass(name, t) {
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = hz(name)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.11, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t + EIGHTH * 7)
    osc.connect(g)
    g.connect(this.bus)
    osc.start(t)
    osc.stop(t + EIGHTH * 7 + 0.05)
  }
}
