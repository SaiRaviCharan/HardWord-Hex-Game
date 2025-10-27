// Sound effects utility for HardWord Hex
// Uses Web Audio API for lightweight, efficient sound generation

type SoundType = 'click' | 'delete' | 'submit' | 'win' | 'lose';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext;
  
  if (typeof globalThis !== 'undefined' && 'AudioContext' in globalThis) {
    audioContext = new globalThis.AudioContext();
    return audioContext;
  }
  
  if (typeof globalThis !== 'undefined' && 'webkitAudioContext' in globalThis) {
    audioContext = new (globalThis as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext();
    return audioContext;
  }
  
  return null;
};

/**
 * Play a sound effect using Web Audio API
 * All sounds are generated dynamically - no audio files needed
 */
export const playSound = (type: SoundType, volume: number = 0.3) => {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Set volume
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  if (type === 'click') {
    // Short beep for letter click
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'delete') {
    // Lower beep for delete
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'submit') {
    // Two-tone submit sound
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.1);

    // Second tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    gain2.gain.setValueAtTime(volume * 0.7, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1000, now + 0.2);
    osc2.type = 'sine';
    osc2.start(now + 0.1);
    osc2.stop(now + 0.2);
  } else if (type === 'win') {
    // Success chime - ascending tones
    const winFreqs = [800, 1000, 1200];
    for (let i = 0; i < winFreqs.length; i++) {
      const freq = winFreqs[i];
      const oscWin = ctx.createOscillator();
      const gainWin = ctx.createGain();
      oscWin.connect(gainWin);
      gainWin.connect(ctx.destination);
      
      const startTime = now + i * 0.15;
      gainWin.gain.setValueAtTime(volume * 0.6, startTime);
      gainWin.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      oscWin.frequency.setValueAtTime(freq, startTime);
      oscWin.frequency.exponentialRampToValueAtTime(freq + 200, startTime + 0.2);
      oscWin.type = 'sine';
      oscWin.start(startTime);
      oscWin.stop(startTime + 0.2);
    }
  } else if (type === 'lose') {
    // Failure buzz - descending tone
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
    osc.type = 'square';
    osc.start(now);
    osc.stop(now + 0.3);
  }
};

/**
 * Resume audio context if suspended (required for user interaction)
 */
export const resumeAudioContext = () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
};
