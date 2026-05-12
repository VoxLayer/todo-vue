const ctx = new (window.AudioContext || window.webkitAudioContext)()

function play(type) {
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  switch (type) {
    case 'pow': {
      osc.type = 'square'
      osc.frequency.setValueAtTime(150, t)
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.15)
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.start(t)
      osc.stop(t + 0.2)
      break
    }
    case 'bam': {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(200, t)
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.25)
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.start(t)
      osc.stop(t + 0.3)
      break
    }
    case 'zap': {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(800, t)
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.1)
      gain.gain.setValueAtTime(0.15, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      osc.start(t)
      osc.stop(t + 0.15)
      break
    }
    case 'pop': {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, t)
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.08)
      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
      osc.start(t)
      osc.stop(t + 0.1)
      break
    }
  }
}

export function playSound(type) { play(type) }
