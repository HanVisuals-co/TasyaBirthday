/**
 * Pengendali Utama Alur Website Scrapbook Winnie the Pooh
 */
document.addEventListener('DOMContentLoaded', () => {
  MusicManager.init();
  populateTexts();
  startDaysCounter();
  renderPolaroids();
  setupModal();
  setupEnvelope();
  setupHunnyJar();
  PhotoboothModule.init();

  LockScreen.init(() => {
    switchScreen('screen-lock', 'screen-envelope');
  });

  QuizModule.init(() => {
    revealChapter('chapter-hunny-jar');
    revealChapter('chapter-cake');
  });

  CandleModule.init(() => {
    revealChapter('chapter-letter');
    revealChapter('chapter-photobooth');
    const letterEl = document.getElementById('chapter-letter');
    if (letterEl) {
      setTimeout(() => {
        letterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  });

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', resetJourney);
  }
});

function switchScreen(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);
  if (fromEl) fromEl.classList.add('hidden');
  if (toEl) {
    toEl.classList.remove('hidden');
    toEl.classList.add('reveal-in');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateTexts() {
  const nameEl = document.getElementById('cover-girlfriend-name');
  const titleEl = document.getElementById('cover-title-text');
  const subtitleEl = document.getElementById('cover-subtitle-text');
  const letterTitle = document.getElementById('letter-title');
  const letterBody = document.getElementById('letter-body');
  const letterClosing = document.getElementById('letter-closing');
  const letterSender = document.getElementById('letter-sender');

  if (nameEl) nameEl.textContent = CONFIG.coverNickname || CONFIG.girlfriendName || 'Honey';
  if (titleEl) titleEl.textContent = CONFIG.scrapbookTitle || 'Happy birthday,';
  if (subtitleEl) subtitleEl.textContent = CONFIG.scrapbookSubtitle || '';
  if (letterTitle) letterTitle.textContent = CONFIG.loveLetterTitle || 'Untukmu';

  if (letterBody && Array.isArray(CONFIG.loveLetterBody)) {
    letterBody.innerHTML = '';
    CONFIG.loveLetterBody.forEach((para) => {
      const p = document.createElement('p');
      p.className = 'letter-paragraph';
      p.textContent = para;
      letterBody.appendChild(p);
    });
  }

  if (letterClosing) letterClosing.textContent = CONFIG.loveLetterClosing || '';
  if (letterSender) letterSender.textContent = CONFIG.senderName || '';
}

function startDaysCounter() {
  const daysEl = document.getElementById('counter-days');
  const hoursEl = document.getElementById('counter-hours');
  const minsEl = document.getElementById('counter-mins');
  const startDate = new Date(CONFIG.relationshipStartDate || '2023-02-14T00:00:00');

  function update() {
    const now = new Date();
    const diffMs = Math.max(0, now - startDate);
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const mins = totalMinutes % 60;

    if (daysEl) daysEl.textContent = String(days).toLocaleString('id-ID');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 30000);
}

function setupEnvelope() {
  const envBtn = document.getElementById('envelope-btn');
  if (!envBtn) return;

  envBtn.addEventListener('click', () => {
    if (envBtn.classList.contains('opened')) return;
    MusicManager.playSuccessSfx();
    envBtn.classList.add('opened');

    setTimeout(() => {
      switchScreen('screen-envelope', 'screen-scrapbook');
    }, 1050);
  });
}

function renderPolaroids() {
  const grid = document.getElementById('polaroid-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = CONFIG.polaroids || [];
  list.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'polaroid-card';
    card.style.transform = `rotate(${item.rotation || 0}deg)`;
    card.setAttribute('aria-label', `Buka kenangan: ${item.date}`);

    const tape = document.createElement('span');
    tape.className = 'washi-tape';
    tape.setAttribute('aria-hidden', 'true');

    const frame = document.createElement('div');
    frame.className = 'polaroid-photo-frame';

    if (item.image && item.image.trim() !== '') {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.date || `Foto kenangan ${index + 1}`;
      img.width = 400;
      img.height = 300;
      img.loading = 'lazy';
      frame.appendChild(img);
    } else {
      frame.innerHTML = getPolaroidPlaceholderSvg(index);
    }

    const dateEl = document.createElement('span');
    dateEl.className = 'polaroid-date';
    dateEl.textContent = item.date || `Momen ${index + 1}`;

    const capEl = document.createElement('p');
    capEl.className = 'polaroid-caption-short';
    capEl.textContent = item.caption || '';

    card.appendChild(tape);
    card.appendChild(frame);
    card.appendChild(dateEl);
    card.appendChild(capEl);

    card.addEventListener('click', () => openPolaroidModal(item, index));
    grid.appendChild(card);
  });
}

function getPolaroidPlaceholderSvg(index) {
  return `<div class="polaroid-placeholder">
    <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="34" r="18" fill="#F2B738" stroke="#4A301F" stroke-width="2.5"/>
      <circle cx="19" cy="20" r="6" fill="#F2B738" stroke="#4A301F" stroke-width="2.5"/>
      <circle cx="45" cy="20" r="6" fill="#F2B738" stroke="#4A301F" stroke-width="2.5"/>
      <circle cx="26" cy="32" r="2.2" fill="#4A301F"/>
      <circle cx="38" cy="32" r="2.2" fill="#4A301F"/>
      <ellipse cx="32" cy="37" rx="3.2" ry="2.2" fill="#4A301F"/>
      <path d="M27 42 Q32 46 37 42" fill="none" stroke="#4A301F" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span>[FOTO KENANGAN ${index + 1}]</span>
  </div>`;
}

function setupModal() {
  const backdrop = document.getElementById('polaroid-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!backdrop || !closeBtn) return;

  closeBtn.addEventListener('click', closePolaroidModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePolaroidModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      closePolaroidModal();
    }
  });
}

function openPolaroidModal(item, index) {
  MusicManager.playClickSfx();
  const backdrop = document.getElementById('polaroid-modal');
  const imgBox = document.getElementById('modal-image-box');
  const dateEl = document.getElementById('modal-date');
  const capEl = document.getElementById('modal-caption');
  const closeBtn = document.getElementById('modal-close-btn');

  if (imgBox) {
    if (item.image && item.image.trim() !== '') {
      imgBox.innerHTML = `<img src="${item.image}" alt="${item.date || 'Foto kenangan'}" width="440" height="330">`;
    } else {
      imgBox.innerHTML = getPolaroidPlaceholderSvg(index);
    }
  }
  if (dateEl) dateEl.textContent = item.date || '';
  if (capEl) capEl.textContent = item.caption || '';
  if (backdrop) backdrop.classList.remove('hidden');
  if (closeBtn) closeBtn.focus();
}

function closePolaroidModal() {
  const backdrop = document.getElementById('polaroid-modal');
  if (backdrop) backdrop.classList.add('hidden');
}

function setupHunnyJar() {
  const jarBtn = document.getElementById('hunny-jar-btn');
  const reasonTextEl = document.getElementById('reason-text');
  const reasonCounterEl = document.getElementById('reason-counter');
  const reasons = CONFIG.loveReasons || [];
  let idx = -1;

  if (!jarBtn || !reasonTextEl) return;

  jarBtn.addEventListener('click', () => {
    if (!reasons.length) return;
    MusicManager.playClickSfx();
    idx = (idx + 1) % reasons.length;

    reasonTextEl.classList.remove('note-pop');
    void reasonTextEl.offsetWidth;
    reasonTextEl.classList.add('note-pop');
    reasonTextEl.textContent = `"${reasons[idx]}"`;

    if (reasonCounterEl) {
      reasonCounterEl.textContent = `Catatan ${idx + 1} dari ${reasons.length} (ketuk toples lagi untuk alasan berikutnya)`;
    }
  });
}

function revealChapter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden-chapter');
  el.classList.add('reveal-in');
}

function resetJourney() {
  MusicManager.playClickSfx();
  const envBtn = document.getElementById('envelope-btn');
  if (envBtn) envBtn.classList.remove('opened');

  ['chapter-hunny-jar', 'chapter-cake', 'chapter-letter', 'chapter-photobooth'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden-chapter');
      el.classList.remove('reveal-in');
    }
  });

  const reasonTextEl = document.getElementById('reason-text');
  const reasonCounterEl = document.getElementById('reason-counter');
  if (reasonTextEl) reasonTextEl.textContent = 'Ketuk toples madu di atas untuk mengambil satu catatan sayang!';
  if (reasonCounterEl) reasonCounterEl.textContent = '';

  QuizModule.reset();
  CandleModule.reset();
  PhotoboothModule.reset();
  LockScreen.reset();
  switchScreen('screen-scrapbook', 'screen-lock');
}
