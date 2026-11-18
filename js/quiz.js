/**
 * Kuis Trivia Kenangan Kita dengan Hadiah Stiker Madu
 */
const QuizModule = (() => {
  let currentQuestionIdx = 0;
  let onCompleteCallback = null;
  let isCompleted = false;

  function init(onComplete) {
    onCompleteCallback = onComplete;
    currentQuestionIdx = 0;
    isCompleted = false;
    renderStickerRack();
    renderQuestion();
  }

  function renderStickerRack() {
    const rack = document.getElementById('sticker-rack');
    if (!rack) return;
    const total = (CONFIG.quizzes || []).length;
    rack.innerHTML = '';

    for (let i = 0; i < total; i++) {
      const slot = document.createElement('div');
      slot.className = 'sticker-slot';
      if (i < currentQuestionIdx || isCompleted) {
        slot.classList.add('unlocked');
        slot.setAttribute('aria-label', `Stiker madu ${i + 1} terbuka`);
        slot.innerHTML = getMiniHoneySvg();
      } else {
        slot.setAttribute('aria-label', `Stiker madu ${i + 1} belum terbuka`);
      }
      rack.appendChild(slot);
    }
  }

  function getMiniHoneySvg() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10l1.5 11.5a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5L7 7z" fill="#FFFDF7" stroke="#4A301F" stroke-width="2"/>
      <rect x="6" y="4" width="12" height="3.5" rx="1.5" fill="#D3383A" stroke="#4A301F" stroke-width="1.8"/>
    </svg>`;
  }

  function renderQuestion() {
    const quizzes = CONFIG.quizzes || [];
    const progressText = document.getElementById('quiz-progress-text');
    const questionEl = document.getElementById('quiz-question-text');
    const optionsEl = document.getElementById('quiz-options');
    const reactionEl = document.getElementById('quiz-reaction');

    if (!quizzes.length) {
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
      return;
    }

    if (currentQuestionIdx >= quizzes.length) {
      isCompleted = true;
      renderStickerRack();
      if (progressText) progressText.textContent = 'Semua Stiker Terkumpul!';
      if (questionEl) questionEl.textContent = 'Kuis kenangan selesai! Toples Alasan Sayang sudah terbuka di bawah.';
      if (optionsEl) optionsEl.innerHTML = '';
      if (reactionEl) {
        reactionEl.textContent = '';
      }
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
      return;
    }

    const q = quizzes[currentQuestionIdx];
    if (progressText) {
      progressText.textContent = `Pertanyaan ${currentQuestionIdx + 1} dari ${quizzes.length}`;
    }
    if (questionEl) questionEl.textContent = q.question;
    if (reactionEl) {
      reactionEl.textContent = '';
      reactionEl.style.color = '';
    }

    if (!optionsEl) return;
    optionsEl.innerHTML = '';

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-opt-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => handleAnswer(idx, btn, q));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(selectedIdx, btnEl, quizItem) {
    const reactionEl = document.getElementById('quiz-reaction');
    const allBtns = document.querySelectorAll('.quiz-opt-btn');

    if (selectedIdx === quizItem.correctIndex) {
      MusicManager.playSuccessSfx();
      allBtns.forEach((b) => {
        b.disabled = true;
      });
      btnEl.classList.add('correct');

      if (reactionEl) {
        reactionEl.style.color = '#3E6B2C';
        reactionEl.textContent = quizItem.poohReaction || 'Benar! Dapat 1 stiker madu!';
      }

      currentQuestionIdx++;
      renderStickerRack();

      setTimeout(() => {
        renderQuestion();
      }, 1350);
    } else {
      MusicManager.playErrorSfx();
      btnEl.classList.add('wrong');
      if (reactionEl) {
        reactionEl.style.color = '#D3383A';
        reactionEl.textContent = 'Ups, kurang tepat! Coba ingat lagi ya.';
      }
      setTimeout(() => {
        btnEl.classList.remove('wrong');
      }, 650);
    }
  }

  function reset() {
    currentQuestionIdx = 0;
    isCompleted = false;
    renderStickerRack();
    renderQuestion();
  }

  return { init, reset };
})();
