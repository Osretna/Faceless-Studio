/**
 * Real-time Audio Engine for Faceless Studio
 * Combines Web Audio API procedural synthesis for background music
 * and Web Speech Synthesis for ultra-realistic voiceover narration.
 */

// Voice configuration parameters
interface VoiceProfile {
  name: string;
  lang: string;
  pitch: number;
  rate: number;
  sampleTextAr: string;
  sampleTextEn: string;
}

const VOICE_PROFILES: Record<string, VoiceProfile> = {
  'voice-adam': {
    name: 'آدم (فخمة)',
    lang: 'ar-SA',
    pitch: 0.85,
    rate: 0.95,
    sampleTextAr: 'مرحباً بك! أنا صوت آدم، جاهز لتسجيل التعليق الصوتي لفيديوهاتك بنبرة وثائقية فخمة ومقنعة.',
    sampleTextEn: 'Welcome! I am Adam, ready to narrate your documentary videos with deep, cinematic prestige.',
  },
  'voice-sarah': {
    name: 'سارة (حماسية)',
    lang: 'ar-EG',
    pitch: 1.2,
    rate: 1.15,
    sampleTextAr: 'هاي! أنا سارة، صوتي مثالي للريلز وتيك توك وطاقة الفيديوهات الفيروسية السريعة!',
    sampleTextEn: 'Hey! I am Sarah, my voice is tuned for viral TikToks, Reels, and high-energy hooks!',
  },
  'voice-tariq': {
    name: 'طارق (خليجي)',
    lang: 'ar-AE',
    pitch: 0.95,
    rate: 1.0,
    sampleTextAr: 'يا هلا ومرحباً! أنا طارق، أقدم لك تعليقاً صوتياً خليجياً مميزاً للإعلانات والمحتوى التسويقي.',
    sampleTextEn: 'Welcome! I am Tariq, offering smooth Gulf commercial voiceover for marketing videos.',
  },
  'voice-layla': {
    name: 'ليلى (وثائقية)',
    lang: 'ar-SA',
    pitch: 1.05,
    rate: 0.88,
    sampleTextAr: 'في عتمة الليل تظهر الحقائق الغامضة... أنا ليلة، متخصصة في سرد القصص والروايات المشوقة.',
    sampleTextEn: 'In the shadows, the mystery unfolds... I am Layla, your voice for suspenseful storytelling.',
  },
  'voice-omar': {
    name: 'عمر (بودكاست)',
    lang: 'ar-EG',
    pitch: 1.0,
    rate: 1.08,
    sampleTextAr: 'إزيك يا بطل! أنا عمر، أسلوبي عفوي وبسيط يناسب البودكاست ومقاطع تطوير الذات السريعة.',
    sampleTextEn: 'Hello there! I am Omar, conversational and friendly, perfect for podcasts and self-help shorts.',
  },
  'voice-alex': {
    name: 'Alex (Silicon Valley)',
    lang: 'en-US',
    pitch: 1.0,
    rate: 1.05,
    sampleTextAr: 'Hello creator! I am Alex, ready to power your Silicon Valley tech and business videos.',
    sampleTextEn: 'Hello creator! I am Alex, ready to power your Silicon Valley tech and business videos.',
  },
};

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private duckingGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeMusicId: string | null = null;
  private isMusicRunning: boolean = false;
  private musicIntervalId: any = null;
  private activeOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private currentVolume: number = 50; // 0 - 100
  private currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeechActive: boolean = false;
  private audioVisualizerListeners: ((volumeLevel: number) => void)[] = [];
  private visualizerInterval: any = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public async resumeAudioContext(): Promise<boolean> {
    this.initAudioContext();
    if (!this.audioCtx) return false;
    if (this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (err) {
        console.warn('AudioContext resume failed:', err);
      }
    }
    return this.audioCtx.state === 'running';
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.duckingGain = this.audioCtx.createGain();
        this.musicGain = this.audioCtx.createGain();
        this.sfxGain = this.audioCtx.createGain();

        // Chain: Music -> MusicGain -> DuckingGain -> MasterGain -> Destination
        this.musicGain.connect(this.duckingGain);
        this.duckingGain.connect(this.masterGain);
        
        // Chain: SFX -> SFXGain -> MasterGain -> Destination
        this.sfxGain.connect(this.masterGain);

        this.masterGain.connect(this.audioCtx.destination);

        this.setMusicVolume(this.currentVolume);
        this.sfxGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Set Master Mute
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      const target = muted ? 0 : 1;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
    if (muted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeechActive = false;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Set Music Volume (0 - 100)
  public setMusicVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(100, volume));
    if (this.musicGain && this.audioCtx) {
      // Map 0-100 to robust audible gain (0 to 0.8)
      const gainVal = (this.currentVolume / 100) * 0.8;
      this.musicGain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
    }
  }

  // Duck music when voice is speaking (smooth, keeps music audible)
  public duckMusic(ducked: boolean) {
    if (this.duckingGain && this.audioCtx) {
      const targetGain = ducked ? 0.55 : 1.0;
      this.duckingGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.duckingGain.gain.linearRampToValueAtTime(targetGain, this.audioCtx.currentTime + 0.2);
    }
  }

  // Start procedural background music
  public startMusic(trackId: string, volume: number = 25) {
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.stopMusic();
    this.activeMusicId = trackId;
    this.isMusicRunning = true;
    this.setMusicVolume(volume);

    // Start genre-specific procedural loops
    if (trackId === 'music-1') {
      this.playCyberpunkLoop();
    } else if (trackId === 'music-2') {
      this.playLoFiLoop();
    } else if (trackId === 'music-3') {
      this.playCinematicLoop();
    } else {
      this.playAmbientLoop();
    }

    this.startVisualizerTicker();
  }

  public stopMusic() {
    this.isMusicRunning = false;
    this.activeMusicId = null;

    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeOscillators = [];

    this.stopVisualizerTicker();
  }

  public isMusicPlaying(): boolean {
    return this.isMusicRunning;
  }

  public getActiveMusicId(): string | null {
    return this.activeMusicId;
  }

  // --- GENRE 1: Cyberpunk Drift (128 BPM Synthwave) ---
  private playCyberpunkLoop() {
    if (!this.audioCtx || !this.musicGain) return;

    const notes = [65.41, 65.41, 73.42, 82.41, 65.41, 98.0, 87.31, 73.42]; // C2, C2, D2, E2, C2, G2, F2, D2
    let step = 0;
    const stepTime = 60 / 128 / 2; // eighth notes

    // Ambient background pad
    this.playDroneNote(130.81, 'sawtooth', 300); // C3 warm lowpass pad
    this.playDroneNote(196.0, 'sine', 500); // G3

    this.musicIntervalId = setInterval(() => {
      if (!this.isMusicRunning || !this.audioCtx || !this.musicGain) return;

      const now = this.audioCtx.currentTime;
      const freq = notes[step % notes.length];
      step++;

      // Synth Bass pluck
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + stepTime * 0.9);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + stepTime * 0.9);

      // Hi-hat tick every quarter note
      if (step % 2 === 0) {
        this.playPerccussionTick(now, 8000, 0.08);
      }
    }, stepTime * 1000);
  }

  // --- GENRE 2: Midnight Lo-Fi Chill (85 BPM) ---
  private playLoFiLoop() {
    if (!this.audioCtx || !this.musicGain) return;

    // Jazzy chord progression (Eb major 7, C minor 7, F minor 7, Bb 7)
    const chords = [
      [155.56, 196.0, 233.08, 293.66], // Ebmaj7
      [130.81, 155.56, 196.0, 233.08], // Cm7
      [174.61, 207.65, 261.63, 311.13], // Fm7
      [116.54, 146.83, 174.61, 233.08], // Bb7
    ];
    let chordIdx = 0;
    const barDuration = (60 / 85) * 4;

    const playNextLoFiChord = () => {
      if (!this.isMusicRunning || !this.audioCtx || !this.musicGain) return;
      const now = this.audioCtx.currentTime;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq) => {
        if (!this.audioCtx || !this.musicGain) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + barDuration * 0.95);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + barDuration);
      });

      // Soft kick on beat 1
      this.playSoftKick(now);
    };

    playNextLoFiChord();
    this.musicIntervalId = setInterval(playNextLoFiChord, barDuration * 1000);
  }

  // --- GENRE 3: Epic Cinematic Rise (110 BPM) ---
  private playCinematicLoop() {
    if (!this.audioCtx || !this.musicGain) return;

    // Sub Drone
    this.playDroneNote(65.41, 'sawtooth', 120); // Sub C2
    this.playDroneNote(98.0, 'sine', 200); // G2

    const steps = [
      [130.81, 155.56, 196.0], // C minor
      [116.54, 146.83, 174.61], // Bb major
      [103.83, 130.81, 155.56], // Ab major
      [98.0, 123.47, 146.83], // G major
    ];
    let stepIdx = 0;
    const dur = 3.5;

    const playCinematicBar = () => {
      if (!this.isMusicRunning || !this.audioCtx || !this.musicGain) return;
      const now = this.audioCtx.currentTime;
      const notes = steps[stepIdx % steps.length];
      stepIdx++;

      notes.forEach((freq) => {
        if (!this.audioCtx || !this.musicGain) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(1400, now + dur * 0.7);
        filter.frequency.linearRampToValueAtTime(400, now + dur);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + dur * 0.6);
        gain.gain.linearRampToValueAtTime(0.001, now + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + dur);
      });
    };

    playCinematicBar();
    this.musicIntervalId = setInterval(playCinematicBar, dur * 1000);
  }

  // --- GENRE 4: Inspiring Deep Ambient (90 BPM) ---
  private playAmbientLoop() {
    if (!this.audioCtx || !this.musicGain) return;

    const ambientTones = [196.0, 246.94, 293.66, 369.99, 440.0]; // G, B, D, F#, A
    let toneIdx = 0;
    const interval = 2.4;

    const playAmbientNote = () => {
      if (!this.isMusicRunning || !this.audioCtx || !this.musicGain) return;
      const now = this.audioCtx.currentTime;
      const freq = ambientTones[toneIdx % ambientTones.length];
      toneIdx++;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 4.2);
    };

    playAmbientNote();
    this.musicIntervalId = setInterval(playAmbientNote, interval * 1000);
  }

  // Helper: Drone tone
  private playDroneNote(freq: number, type: OscillatorType, cutoff: number) {
    if (!this.audioCtx || !this.musicGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start();
    this.activeOscillators.push(osc);
  }

  // Helper: Hi-hat percussion click
  private playPerccussionTick(time: number, freq: number, duration: number) {
    if (!this.audioCtx || !this.musicGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'highpass' as any;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Helper: Soft Kick
  private playSoftKick(time: number) {
    if (!this.audioCtx || !this.musicGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  // ----------------------------------------------------
  // SPEECH SYNTHESIS ENGINE (Voiceover Narration)
  // ----------------------------------------------------

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) this.cachedVoices = voices;
    return this.cachedVoices.length > 0 ? this.cachedVoices : voices;
  }

  public speakText(
    text: string,
    voiceId: string = 'voice-adam',
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    this.resumeAudioContext();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.playSpeechVocalFallbackTone();
      callbacks?.onEnd?.();
      return;
    }

    if (this.isMuted) {
      callbacks?.onEnd?.();
      return;
    }

    // Stop current speech and resume if paused by browser
    this.stopSpeaking();
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}

    const profile = VOICE_PROFILES[voiceId] || VOICE_PROFILES['voice-adam'];
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentSpeechUtterance = utterance;

    // Pick best system voice with fallback
    const voices = this.getAvailableVoices();
    const isArabic = /[\u0600-\u06FF]/.test(text) || profile.lang.startsWith('ar');

    let matchedVoice = voices.find((v) =>
      isArabic
        ? v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic')
        : v.lang.toLowerCase().startsWith('en')
    );

    // If no voice matches exact language, pick natural/default voice so browser doesn't fail
    if (!matchedVoice && voices.length > 0) {
      matchedVoice = voices.find((v) => v.default) || voices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      // If we fell back to a non-Arabic voice, keep that voice's lang so Chrome doesn't abort with language-unavailable
      utterance.lang = matchedVoice.lang || (isArabic ? 'ar-SA' : 'en-US');
    } else {
      utterance.lang = isArabic ? 'ar-SA' : 'en-US';
    }

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

    utterance.onstart = () => {
      this.isSpeechActive = true;
      this.duckMusic(true); // Duck music while voice is speaking
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeechActive = false;
      this.duckMusic(false); // Restore music volume
      this.currentSpeechUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeechActive = false;
      this.duckMusic(false);
      this.currentSpeechUtterance = null;
      // Play vocal fallback tone so the user always hears feedback
      this.playSpeechVocalFallbackTone();
      callbacks?.onError?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.playSpeechVocalFallbackTone();
      callbacks?.onEnd?.();
    }
  }

  // Melodic vocal tone fallback when SpeechSynthesis is unavailable
  public playSpeechVocalFallbackTone() {
    this.initAudioContext();
    if (!this.audioCtx || !this.sfxGain) return;
    const now = this.audioCtx.currentTime;
    const notes = [440, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, i) => {
      if (!this.audioCtx || !this.sfxGain) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.001, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.28);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  }

  // Guaranteed Sound Check test
  public playTestSound(lang: 'ar' | 'en' = 'ar') {
    this.resumeAudioContext();
    this.playCelebrationChime();
    setTimeout(() => {
      const greeting = lang === 'ar'
        ? 'الصوت يعمل بنجاح! تم التحقق من مكبرات الصوت واستوديو الفيديوهات.'
        : 'Audio system is working perfectly! Sound verified successfully.';
      this.speakText(greeting, 'voice-adam');
    }, 300);
  }

  // Celebration Chime for tests and success
  public playCelebrationChime() {
    this.initAudioContext();
    if (!this.audioCtx || !this.sfxGain) return;
    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, i) => {
      if (!this.audioCtx || !this.sfxGain) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeechActive = false;
    this.currentSpeechUtterance = null;
    this.duckMusic(false);
  }

  public playVoiceSample(voiceId: string, lang: 'ar' | 'en' = 'ar', onDone?: () => void) {
    const profile = VOICE_PROFILES[voiceId] || VOICE_PROFILES['voice-adam'];
    const sampleText = lang === 'ar' ? profile.sampleTextAr : profile.sampleTextEn;

    this.speakText(sampleText, voiceId, {
      onEnd: onDone,
      onError: onDone,
    });
  }

  public isSpeaking(): boolean {
    return this.isSpeechActive;
  }

  // ----------------------------------------------------
  // VISUALIZER / EQUALIZER STATE STREAM
  // ----------------------------------------------------
  public onVisualizerData(listener: (volumeLevel: number) => void) {
    this.audioVisualizerListeners.push(listener);
    return () => {
      this.audioVisualizerListeners = this.audioVisualizerListeners.filter((l) => l !== listener);
    };
  }

  private startVisualizerTicker() {
    if (this.visualizerInterval) return;
    this.visualizerInterval = setInterval(() => {
      if (this.isMuted) {
        this.broadcastVisualizer(0);
        return;
      }
      if (this.isMusicRunning || this.isSpeechActive) {
        // Dynamic simulated level based on volume and speech
        const base = this.isSpeechActive ? 0.8 : (this.currentVolume / 100) * 0.7;
        const randomFlicker = Math.sin(Date.now() / 150) * 0.2;
        const level = Math.max(0.1, Math.min(1.0, base + randomFlicker));
        this.broadcastVisualizer(level);
      } else {
        this.broadcastVisualizer(0);
      }
    }, 100);
  }

  private stopVisualizerTicker() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
      this.visualizerInterval = null;
    }
    this.broadcastVisualizer(0);
  }

  private broadcastVisualizer(val: number) {
    this.audioVisualizerListeners.forEach((l) => l(val));
  }

  // Stop everything (Pause video / unmount)
  public stopAll() {
    this.stopMusic();
    this.stopSpeaking();
  }
}

export const audioEngine = new AudioEngine();
