/**
 * Layar 1: Gerbang Toples Madu 4-Digit PIN (Tanggal Anniversary)
 */
const LockScreen = (() => {
  let enteredPin = '';
  let onUnlockCallback = null;
  let isActive = true;

  function init(onUnlock) {
    onUnlockCallback = onUnlock;
    const hintEl = document.getElementById('pin-feedback');
    if (hintEl) {
      hintEl.textContent = CONFIG.pinHint !== undefined ? CONFIG.pinHint : '';
      hintEl.classList.add('hint');
    }

    const keypadBtns = document.querySelectorAll('.key-btn');
    keypadBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.key;
        handleInput(val);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!isActive) return;
      if (/^[0-9]$/.test(e.key)) {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleInput('del');
      } else if (e.key === 'Escape') {
        handleInput('clear');
      }
    });
  }

  function handleInput(val) {
    if (!isActive) return;

    if (val === 'clear') {
      MusicManager.playClickSfx();
      enteredPin = '';
      renderDots();
      return;
    }

    if (val === 'del') {
      MusicManager.playClickSfx();
      enteredPin = enteredPin.slice(0, -1);
      renderDots();
      return;
    }

    if (enteredPin.length < 4 && /^[0-9]$/.test(val)) {
      MusicManager.playClickSfx();
      enteredPin += val;
      renderDots();

      if (enteredPin.length === 4) {
        setTimeout(verifyPin, 180);
      }
    }
  }

  function renderDots() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < enteredPin.length);
    });
  }

  function verifyPin() {
    const targetPin = String(CONFIG.anniversaryPin || '1402').trim();
    const lockCard = document.querySelector('.lock-card');
    const feedback = document.getElementById('pin-feedback');

    if (enteredPin === targetPin) {
      isActive = false;
      MusicManager.playSuccessSfx();
      MusicManager.start();
      if (feedback) {
        feedback.textContent = 'Yeay! Toples madu terbuka!';
        feedback.classList.remove('hint');
        feedback.style.color = '#3E6B2C';
      }
      setTimeout(() => {
        if (typeof onUnlockCallback === 'function') {
          onUnlockCallback();
        }
      }, 550);
    } else {
      MusicManager.playErrorSfx();
      if (lockCard) {
        lockCard.classList.remove('shake-error');
        void lockCard.offsetWidth; // trigger reflow
        lockCard.classList.add('shake-error');
      }
      if (feedback) {
        feedback.classList.remove('hint');
        feedback.style.color = '';
        feedback.textContent = 'Hmm, Pooh lupa! Coba ingat lagi tanggal jadian kita.';
      }
      enteredPin = '';
      renderDots();
    }
  }

  function reset() {
    enteredPin = '';
    isActive = true;
    renderDots();
    const feedback = document.getElementById('pin-feedback');
    if (feedback) {
      feedback.textContent = CONFIG.pinHint !== undefined ? CONFIG.pinHint : '';
      feedback.classList.add('hint');
      feedback.style.color = '';
    }
  }

  return { init, reset };
})();
