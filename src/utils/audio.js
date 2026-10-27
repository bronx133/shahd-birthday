// Web Audio API Sound Synthesizer (Zero external dependencies)
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.melodyInterval = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Romantic chime / harp sound on hover
  playHoverChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Celebratory harp chord on Start click
  playStartHarp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major harp arpeggio
      const baseTime = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, baseTime + index * 0.06);

        gain.gain.setValueAtTime(0.06, baseTime + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + index * 0.06 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(baseTime + index * 0.06);
        osc.stop(baseTime + index * 0.06 + 0.7);
      });
    } catch {
      // ignore audio errors
    }
  }

  // Cute pop sound for Easter eggs
  playEasterEggPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  // Authentic CD Insertion & Spindle Snaps + Laser Seek Ticking ("صوت تكتكة الـ CD")
  playCDInsertClicks() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Helper function to synthesize realistic mechanical plastic/spring clicks
      const createMechanicalClick = (time, freq, Q, volume, decay, hasResonance = true) => {
        // 1. High frequency transient snap (filtered noise impulse)
        const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * decay));
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, time);
        filter.Q.value = Q;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(time);
        noise.stop(time + decay);

        // 2. Resonant mechanical casing thud / plastic snap
        if (hasResonance) {
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq * 0.35, time);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.12, time + decay * 1.5);

          oscGain.gain.setValueAtTime(volume * 0.7, time);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, time + decay * 1.5);

          osc.connect(oscGain);
          oscGain.connect(this.ctx.destination);

          osc.start(time);
          osc.stop(time + decay * 1.5);
        }
      };

      // --- SEQUENCE OF REALISTIC CD LOADING SOUNDS ---
      // 1. Initial disc touch into tray (t = 0.02s)
      createMechanicalClick(now + 0.02, 2800, 3.5, 0.32, 0.04, true);

      // 2. Firm center spindle clamp snap ("KLACK" - locking teeth) (t = 0.09s)
      createMechanicalClick(now + 0.09, 2100, 4.5, 0.40, 0.055, true);

      // 3. Laser lens mechanism stepping & focus seek ticks ("تكتكة السي دي")
      // First tick (t = 0.32s)
      createMechanicalClick(now + 0.32, 3400, 8.0, 0.22, 0.025, false);
      // Second tick (t = 0.52s)
      createMechanicalClick(now + 0.52, 3100, 9.0, 0.24, 0.026, false);
      // Double quick latch tick (t = 0.72s and 0.78s)
      createMechanicalClick(now + 0.72, 3600, 7.5, 0.20, 0.022, false);
      createMechanicalClick(now + 0.78, 2700, 6.0, 0.26, 0.035, true);

      // 4. Subtle spindle motor spin-up whir right as disc takes speed (t = 0.80s to 1.1s)
      const motorOsc = this.ctx.createOscillator();
      const motorGain = this.ctx.createGain();
      motorOsc.type = 'sine';
      motorOsc.frequency.setValueAtTime(80, now + 0.80);
      motorOsc.frequency.exponentialRampToValueAtTime(260, now + 1.10);

      motorGain.gain.setValueAtTime(0.001, now + 0.80);
      motorGain.gain.linearRampToValueAtTime(0.06, now + 1.00);
      motorGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      motorOsc.connect(motorGain);
      motorGain.connect(this.ctx.destination);

      motorOsc.start(now + 0.80);
      motorOsc.stop(now + 1.15);

    } catch {
      // ignore
    }
  }

  // Needle drop & vinyl warm crackle sound
  playNeedleDrop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  // Party Popper Cannon "BOOM / POP" sound
  playPartyPopperBoom() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Low punch boom (60Hz -> 20Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // 2. High snap noise pop
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch {
      // ignore
    }
  }

  // Romantic love letter unseal chime: wax seal snap + harp glissando
  playLetterUnseal() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const baseTime = this.ctx.currentTime;

      // Soft wax break snap
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(260, baseTime);
      snapOsc.frequency.exponentialRampToValueAtTime(110, baseTime + 0.08);
      snapGain.gain.setValueAtTime(0.09, baseTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, baseTime + 0.1);
      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(baseTime);
      snapOsc.stop(baseTime + 0.1);

      // Sweet romantic harp glissando
      const harpNotes = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66]; // G major sweet chord
      harpNotes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const noteTime = baseTime + 0.06 + idx * 0.07;
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.045, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.75);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.75);
      });
    } catch {
      // ignore
    }
  }

  // Paper rustling / shaking sound (dry, soft, romantic)
  playPaperRustle() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Create 3 quick noise bursts simulating paper shake
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.12;
        const bufSize = Math.floor(this.ctx.sampleRate * 0.06);
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let j = 0; j < bufSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufSize * 0.3));
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const filt = this.ctx.createBiquadFilter();
        filt.type = 'bandpass';
        filt.frequency.value = 3200;
        filt.Q.value = 0.8;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        src.connect(filt);
        filt.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(t);
        src.stop(t + 0.07);
      }
    } catch { /* ignore */ }
  }

  // Soft romantic typewriter tap for letter reveal
  playTypeTap() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft, warm, quiet click
      const bufSize = Math.floor(this.ctx.sampleRate * 0.025);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufSize * 0.18));
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filt = this.ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 1800;
      filt.Q.value = 1.5;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 0.03);
    } catch { /* ignore */ }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
