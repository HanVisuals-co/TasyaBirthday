/**
 * Pengelola Musik Latar & Efek Suara Lembut
 * Mendukung file mp3 dari CONFIG.musicUrl, dengan fallback Kotak Musik Web Audio API
 * jika file mp3 belum dimasukkan.
 */
const MusicManager = (() => {
  let audioEl = null;
  let audioCtx = null;
  let isPlaying = false;
  let useMusicBox = false;
  let musicBoxTimer = null;
  let noteIndex = 0;

  // Melodi lembut "Happy Birthday" dalam frekuensi Hz untuk mode kotak musik
  const melodyNotes = [
    { freq: 392.0, dur: 0.35 }, // G4
    { freq: 392.0, dur: 0.2 },  // G4
    { freq: 440.0, dur: 0.5 },  // A4
    { freq: 392.0, dur: 0.5 },  // G4
    { freq: 523.25, dur: 0.5 }, // C5
    { freq: 493.88, dur: 0.9 }, // B4
    { freq: 392.0, dur: 0.35 }, // G4
    { freq: 392.0, dur: 0.2 },  // G4
    { freq: 440.0, dur: 0.5 },  // A4
    { freq: 392.0, dur: 0.5 },  // G4
    { freq: 587.33, dur: 0.5 }, // D5
    { freq: 523.25, dur: 0.9 }, // C5
    { freq: 392.0, dur: 0.35 }, // G4
    { freq: 392.0, dur: 0.2 },  // G4
    { freq: 783.99, dur: 0.5 }, // G5
    { freq: 659.25, dur: 0.5 }, // E5
    { freq: 523.25, dur: 0.5 }, // C5
    { freq: 493.88, dur: 0.5 }, // B4
    { freq: 440.0, dur: 0.85 }, // A4
    { freq: 698.46, dur: 0.35 }, // F5
    { freq: 698.46, dur: 0.2 },  // F5
    { freq: 659.25, dur: 0.5 }, // E5
    { freq: 523.25, dur: 0.5 }, // C5
    { freq: 587.33, dur: 0.5 }, // D5
    { freq: 523.25, dur: 1.1 }  // C5
  ];

  function ensureContext() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.2, volume = 0.08, type = 'sine') {
    ensureContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.02);
  }

  function playClickSfx() {
    playTone(580, 0.07, 0.06, 'triangle');
  }

  function playSuccessSfx() {
    playTone(523.25, 0.16, 0.09, 'sine');
    setTimeout(() => playTone(659.25, 0.16, 0.09, 'sine'), 110);
    setTimeout(() => playTone(783.99, 0.32, 0.1, 'sine'), 220);
  }

  function playErrorSfx() {
    playTone(220, 0.16, 0.07, 'triangle');
    setTimeout(() => playTone(185, 0.22, 0.07, 'triangle'), 140);
  }

  function stepMusicBox() {
    if (!isPlaying || !useMusicBox) return;
    const note = melodyNotes[noteIndex];
    playTone(note.freq, note.dur * 1.15, 0.055, 'sine');
    noteIndex = (noteIndex + 1) % melodyNotes.length;
    const pauseMs = note.dur * 1000 + (noteIndex === 0 ? 900 : 80);
    musicBoxTimer = setTimeout(stepMusicBox, pauseMs);
  }

  function init() {
    const titleEl = document.getElementById('music-title');
    if (titleEl) titleEl.textContent = CONFIG.musicTitle || 'Kotak Musik Pooh';

    if (CONFIG.musicUrl && CONFIG.musicUrl.trim() !== '') {
      audioEl = new Audio(CONFIG.musicUrl);
      audioEl.loop = true;
      audioEl.volume = 0.55;
      audioEl.addEventListener('error', () => {
        useMusicBox = true;
      });
    } else {
      useMusicBox = true;
    }

    const toggleBtn = document.getElementById('music-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }
  }

  function start() {
    const player = document.getElementById('music-player');
    if (player) player.classList.remove('hidden');

    if (isPlaying) return;
    isPlaying = true;
    updateUi();

    if (!useMusicBox && audioEl) {
      audioEl.play().catch(() => {
        useMusicBox = true;
        stepMusicBox();
      });
    } else {
      ensureContext();
      stepMusicBox();
    }
  }

  function pause() {
    isPlaying = false;
    updateUi();
    if (audioEl) audioEl.pause();
    if (musicBoxTimer) {
      clearTimeout(musicBoxTimer);
      musicBoxTimer = null;
    }
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      start();
    }
  }

  function updateUi() {
    const iconEl = document.getElementById('music-icon');
    const toggleBtn = document.getElementById('music-toggle-btn');
    if (!iconEl || !toggleBtn) return;

    if (isPlaying) {
      iconEl.classList.add('music-spinning');
      toggleBtn.setAttribute('aria-label', 'Jeda musik latar');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      iconEl.classList.remove('music-spinning');
      toggleBtn.setAttribute('aria-label', 'Putar musik latar');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  return {
    init,
    start,
    pause,
    toggle,
    playClickSfx,
    playSuccessSfx,
    playErrorSfx
  };
})();
