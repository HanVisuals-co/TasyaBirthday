/**
 * Kue Ulang Tahun & Tiup Lilin Interaktif
 * Mendukung deteksi tiupan lewat mikrofon serta tombol sentuh/klik sebagai alternatif.
 */
const CandleModule = (() => {
  let isExtinguished = false;
  let micStream = null;
  let micAudioCtx = null;
  let micAnalyser = null;
  let micLoopId = null;
  let onBlowCallback = null;

  function init(onBlow) {
    onBlowCallback = onBlow;
    const cakeBtn = document.getElementById('cake-interactive-btn');
    const micBtn = document.getElementById('enable-mic-btn');
    const tapBtn = document.getElementById('tap-blow-btn');

    if (cakeBtn) {
      cakeBtn.addEventListener('click', extinguishCandle);
    }
    if (tapBtn) {
      tapBtn.addEventListener('click', extinguishCandle);
    }
    if (micBtn) {
      micBtn.addEventListener('click', startMicDetection);
    }
  }

  async function startMicDetection() {
    if (isExtinguished) return;
    const statusEl = document.getElementById('cake-status-msg');
    const micBtn = document.getElementById('enable-mic-btn');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (statusEl) {
        statusEl.textContent = 'Browser ini tidak mendukung mikrofon. Cukup klik lilin untuk meniupnya!';
      }
      return;
    }

    try {
      if (statusEl) statusEl.textContent = 'Meminta izin mikrofon...';
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const Ctx = window.AudioContext || window.webkitAudioContext;
      micAudioCtx = new Ctx();
      const source = micAudioCtx.createMediaStreamSource(micStream);
      micAnalyser = micAudioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      if (micBtn) micBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = 'Mikrofon aktif! Sekarang tiup ke arah layar HP/laptopmu...';
      }

      monitorBlow();
    } catch {
      if (statusEl) {
        statusEl.textContent = 'Izin mikrofon tidak diberikan. Kamu bisa langsung klik lilin atau tombol tiup!';
      }
    }
  }

  function monitorBlow() {
    if (isExtinguished || !micAnalyser) return;
    const data = new Uint8Array(micAnalyser.frequencyBinCount);
    micAnalyser.getByteFrequencyData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    const averageVolume = sum / data.length;

    // Ambang suara tiupan udara pada mikrofon
    if (averageVolume > 58) {
      extinguishCandle();
      return;
    }

    micLoopId = requestAnimationFrame(monitorBlow);
  }

  function stopMic() {
    if (micLoopId) {
      cancelAnimationFrame(micLoopId);
      micLoopId = null;
    }
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      micStream = null;
    }
    if (micAudioCtx) {
      micAudioCtx.close().catch(() => {});
      micAudioCtx = null;
    }
  }

  function extinguishCandle() {
    if (isExtinguished) return;
    isExtinguished = true;
    stopMic();

    const flameEl = document.getElementById('candle-flame');
    const smokeEl = document.getElementById('candle-smoke');
    const statusEl = document.getElementById('cake-status-msg');
    const micBtn = document.getElementById('enable-mic-btn');
    const tapBtn = document.getElementById('tap-blow-btn');

    if (flameEl) flameEl.classList.add('extinguished');
    if (smokeEl) smokeEl.classList.add('active');
    if (micBtn) micBtn.style.display = 'none';
    if (tapBtn) tapBtn.style.display = 'none';
    if (statusEl) {
      statusEl.textContent = 'Yeay! Selamat ulang tahun! Semoga semua harapanmu terkabul.';
      statusEl.style.color = '#3E6B2C';
    }

    MusicManager.playSuccessSfx();
    Confetti.launch();

    setTimeout(() => {
      if (typeof onBlowCallback === 'function') {
        onBlowCallback();
      }
    }, 900);
  }

  function reset() {
    isExtinguished = false;
    stopMic();
    const flameEl = document.getElementById('candle-flame');
    const smokeEl = document.getElementById('candle-smoke');
    const statusEl = document.getElementById('cake-status-msg');
    const micBtn = document.getElementById('enable-mic-btn');
    const tapBtn = document.getElementById('tap-blow-btn');

    if (flameEl) flameEl.classList.remove('extinguished');
    if (smokeEl) smokeEl.classList.remove('active');
    if (micBtn) {
      micBtn.style.display = '';
      micBtn.disabled = false;
    }
    if (tapBtn) tapBtn.style.display = '';
    if (statusEl) {
      statusEl.textContent = 'Buat permohonan dalam hati, lalu tiup lilinnya!';
      statusEl.style.color = '';
    }
  }

  return { init, reset };
})();
