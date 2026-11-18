/**
 * Photobooth Interaktif 2 Foto (Tasya & Hirono Harry Potter)
 * Mendukung kamera langsung (dengan hitung mundur 3-2-1), upload foto,
 * cetak ke PDF (window.print), download PNG, dan kirim ke WhatsApp Ihan.
 */
const PhotoboothModule = (() => {
  let stream = null;
  let photos = []; // maksimal 2 data URL / Image
  let isCountingDown = false;

  function init() {
    const startCamBtn = document.getElementById('pb-start-cam-btn');
    const captureBtn = document.getElementById('pb-capture-btn');
    const fileInput = document.getElementById('pb-file-input');
    const retakeBtn = document.getElementById('pb-retake-btn');
    const printBtn = document.getElementById('pb-print-btn');
    const downloadBtn = document.getElementById('pb-download-btn');
    const waBtn = document.getElementById('pb-wa-btn');

    if (startCamBtn) startCamBtn.addEventListener('click', startCamera);
    if (captureBtn) captureBtn.addEventListener('click', handleCaptureClick);
    if (fileInput) fileInput.addEventListener('change', handleFileUpload);
    if (retakeBtn) retakeBtn.addEventListener('click', resetPhotos);
    if (printBtn) printBtn.addEventListener('click', printToPdf);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadStrip);
    if (waBtn) waBtn.addEventListener('click', sendToWhatsApp);
  }

  async function startCamera() {
    const statusEl = document.getElementById('pb-status');
    const videoEl = document.getElementById('pb-video');
    const camBox = document.getElementById('pb-camera-box');
    const startCamBtn = document.getElementById('pb-start-cam-btn');
    const captureBtn = document.getElementById('pb-capture-btn');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (statusEl) {
        statusEl.textContent = 'Kamera browser tidak tersedia. Gunakan tombol Pilih Foto dari Galeri di bawah.';
      }
      return;
    }

    try {
      if (statusEl) statusEl.textContent = 'Membuka kamera...';
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 540 } },
        audio: false
      });

      if (videoEl) {
        videoEl.srcObject = stream;
        await videoEl.play();
      }
      if (camBox) camBox.classList.remove('hidden');
      if (startCamBtn) startCamBtn.classList.add('hidden');
      if (captureBtn) captureBtn.classList.remove('hidden');
      updateStatusText();
    } catch {
      if (statusEl) {
        statusEl.textContent = 'Izin kamera ditolak. Kamu tetap bisa pakai tombol Pilih Foto dari Galeri!';
      }
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    const camBox = document.getElementById('pb-camera-box');
    const startCamBtn = document.getElementById('pb-start-cam-btn');
    const captureBtn = document.getElementById('pb-capture-btn');
    if (camBox) camBox.classList.add('hidden');
    if (startCamBtn) startCamBtn.classList.remove('hidden');
    if (captureBtn) captureBtn.classList.add('hidden');
  }

  function updateStatusText() {
    const statusEl = document.getElementById('pb-status');
    const captureBtn = document.getElementById('pb-capture-btn');
    if (!statusEl) return;

    if (photos.length === 0) {
      statusEl.textContent = 'Pose ke-1: Pegang Hirono Harry Potter kamu, lalu senyum!';
      if (captureBtn) captureBtn.textContent = 'Ambil Foto 1 (3 Detik)';
    } else if (photos.length === 1) {
      statusEl.textContent = 'Bagus! Sekarang Pose ke-2 bareng Hirono kamu!';
      if (captureBtn) captureBtn.textContent = 'Ambil Foto 2 (3 Detik)';
    } else {
      statusEl.textContent = 'Photostrip selesai! Kamu bisa Print ke PDF atau kirim ke Ihan.';
    }
  }

  function handleCaptureClick() {
    if (isCountingDown || photos.length >= 2) return;
    isCountingDown = true;

    const countdownEl = document.getElementById('pb-countdown');
    const captureBtn = document.getElementById('pb-capture-btn');
    if (captureBtn) captureBtn.disabled = true;

    let count = 3;
    if (countdownEl) {
      countdownEl.classList.remove('hidden');
      countdownEl.textContent = String(count);
    }

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        if (countdownEl) countdownEl.textContent = String(count);
      } else {
        clearInterval(timer);
        if (countdownEl) countdownEl.classList.add('hidden');
        captureFrame();
        isCountingDown = false;
        if (captureBtn) captureBtn.disabled = false;
      }
    }, 850);
  }

  function captureFrame() {
    const videoEl = document.getElementById('pb-video');
    if (!videoEl) return;

    MusicManager.playSuccessSfx();

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoEl.videoWidth || 640;
    tempCanvas.height = videoEl.videoHeight || 480;
    const ctx = tempCanvas.getContext('2d');

    // Mirror horizontal agar natural seperti kamera depan
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoEl, 0, 0, tempCanvas.width, tempCanvas.height);

    const img = new Image();
    img.onload = () => {
      photos.push(img);
      onPhotosUpdated();
    };
    img.src = tempCanvas.toDataURL('image/png');
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 2 - photos.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          if (photos.length < 2) {
            photos.push(img);
            MusicManager.playClickSfx();
            onPhotosUpdated();
          }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }

  function onPhotosUpdated() {
    updateStatusText();
    renderPhotostrip();

    if (photos.length >= 2) {
      stopCamera();
      const resultWrap = document.getElementById('pb-result-wrap');
      const controlsWrap = document.getElementById('pb-controls-wrap');
      if (resultWrap) resultWrap.classList.remove('hidden');
      if (controlsWrap) controlsWrap.classList.add('hidden');
    }
  }

  function renderPhotostrip() {
    const canvas = document.getElementById('photostrip-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = 600;
    const height = 1040;
    canvas.width = width;
    canvas.height = height;

    // Latar strip krem hangat Pooh
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(0, 0, width, height);

    // Garis tepi cokelat kayu
    ctx.strokeStyle = '#4A301F';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Header dekoratif madu
    ctx.fillStyle = '#F2B738';
    ctx.fillRect(16, 16, width - 32, 86);

    ctx.fillStyle = '#4A301F';
    ctx.font = 'bold 26px Fredoka, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WINNIE THE POOH PHOTOBOOTH', width / 2, 68);

    // Gambar 2 Slot Foto (aspect 4:3, crop center cover)
    const slotX = 44;
    const slotW = width - 88;
    const slotH = 380;
    const slotYs = [132, 540];

    slotYs.forEach((slotY, idx) => {
      ctx.fillStyle = '#FAF3E3';
      ctx.fillRect(slotX, slotY, slotW, slotH);

      if (photos[idx]) {
        drawCoverImage(ctx, photos[idx], slotX, slotY, slotW, slotH);
      }

      ctx.strokeStyle = '#4A301F';
      ctx.lineWidth = 5;
      ctx.strokeRect(slotX, slotY, slotW, slotH);
    });

    // Stiker-stiker lucu Winnie the Pooh di atas photostrip
    drawPoohSticker(ctx, 52, 62, 0.85, -0.15);
    drawHunnySticker(ctx, width - 54, 62, 0.9, 0.15);
    drawBeeSticker(ctx, width - 50, 522, 0.95, -0.2);
    drawBalloonSticker(ctx, 64, 982, 0.9, -0.12);
    drawBeeSticker(ctx, width - 64, 982, 0.9, 0.15);

    // Footer Strip
    const pbConfig = CONFIG.photobooth || {};
    const title = pbConfig.stripFooterTitle || 'Happy Birthday, Tasya!';
    const sub = pbConfig.stripFooterSubtitle || 'Special Day - From Ihan';

    ctx.fillStyle = '#D3383A';
    ctx.font = 'bold 32px Caveat, Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 968);

    ctx.fillStyle = '#785842';
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(sub, width / 2, 1002);
  }

  function drawPoohSticker(ctx, cx, cy, scale, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    // Putih pinggiran stiker
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();

    // Telinga
    ctx.fillStyle = '#F2B738';
    ctx.strokeStyle = '#4A301F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-16, -16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(16, -16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Kepala
    ctx.beginPath();
    ctx.ellipse(0, 2, 22, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mata & Hidung
    ctx.fillStyle = '#4A301F';
    ctx.beginPath();
    ctx.arc(-8, -1, 2.5, 0, Math.PI * 2);
    ctx.arc(8, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 4, 4, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Senyum
    ctx.beginPath();
    ctx.arc(0, 6, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  function drawHunnySticker(ctx, cx, cy, scale, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Toples
    ctx.fillStyle = '#FFFDF8';
    ctx.strokeStyle = '#4A301F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-16, -12, 32, 30, 8);
    ctx.fill();
    ctx.stroke();

    // Tutup merah
    ctx.fillStyle = '#D3383A';
    ctx.beginPath();
    ctx.roundRect(-18, -18, 36, 9, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4A301F';
    ctx.font = 'bold 9px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HUNNY', 0, 7);

    ctx.restore();
  }

  function drawBeeSticker(ctx, cx, cy, scale, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    // Sayap
    ctx.fillStyle = '#FFFDF8';
    ctx.strokeStyle = '#4A301F';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(-4, -10, 6, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(5, -10, 6, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Badan lebah
    ctx.fillStyle = '#F2B738';
    ctx.beginPath();
    ctx.ellipse(0, 2, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, -7);
    ctx.lineTo(-4, 11);
    ctx.moveTo(3, -8);
    ctx.lineTo(3, 12);
    ctx.stroke();

    ctx.restore();
  }

  function drawBalloonSticker(ctx, cx, cy, scale, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    ctx.strokeStyle = '#785842';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(-6, 26, 2, 36);
    ctx.stroke();

    ctx.fillStyle = '#D3383A';
    ctx.strokeStyle = '#4A301F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -6, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(-5, -13, 3.5, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawCoverImage(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;

    if (imgRatio > boxRatio) {
      sw = img.height * boxRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / boxRatio;
      sy = (img.height - sh) * 0.25;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function downloadStrip() {
    const canvas = document.getElementById('photostrip-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'tasya-hirono-photobooth.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function printToPdf() {
    window.print();
  }

  async function sendToWhatsApp() {
    const canvas = document.getElementById('photostrip-canvas');
    if (!canvas) return;

    const pbConfig = CONFIG.photobooth || {};
    const waNum = pbConfig.whatsappNumber || '6281334535073';
    const rawMsg =
      pbConfig.whatsappMessage ||
      'Haloo Ihan! Makasih banyak kado Hirono Harry Potter-nya, ini hasil photobooth aku!';
    const statusEl = document.getElementById('pb-status');

    // 1. Coba Web Share API (di HP, langsung melampirkan file foto ke WhatsApp)
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.canShare && navigator.share) {
        const file = new File([blob], 'tasya-photobooth.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Photobooth Tasya',
            text: rawMsg
          });
          if (statusEl) {
            statusEl.textContent = 'Foto berhasil dibagikan ke Ihan!';
          }
          return;
        }
      }

      // 2. Fallback Desktop: Salin gambar ke clipboard + download + buka WhatsApp
      if (blob && navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          if (statusEl) {
            statusEl.textContent = 'Foto sudah disalin ke clipboard & ter-download! Tinggal Ctrl+V (Tempel) di chat WhatsApp Ihan.';
          }
        } catch {
          if (statusEl) {
            statusEl.textContent = 'Foto sudah ter-download! Tinggal lampirkan fotonya di chat WhatsApp Ihan.';
          }
        }
      } else if (statusEl) {
        statusEl.textContent = 'Foto sudah ter-download! Tinggal lampirkan fotonya di chat WhatsApp Ihan.';
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }

    downloadStrip();
    const msg = encodeURIComponent(rawMsg);
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank', 'noopener');
  }

  function resetPhotos() {
    photos = [];
    const resultWrap = document.getElementById('pb-result-wrap');
    const controlsWrap = document.getElementById('pb-controls-wrap');
    if (resultWrap) resultWrap.classList.add('hidden');
    if (controlsWrap) controlsWrap.classList.remove('hidden');
    updateStatusText();
  }

  function reset() {
    stopCamera();
    resetPhotos();
  }

  return { init, reset };
})();
