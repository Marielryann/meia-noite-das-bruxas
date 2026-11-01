/* =========================================================
   main.js — Bootstrap geral:
   - Botão de Mutar/Desmutar áudio (sincronizado com o estado)
   - Desbloqueio do áudio no primeiro gesto do usuário
   - Ano atual no rodapé
   ========================================================= */
(function () {
  'use strict';

  var H = window.Halloween;

  /* ---------- Botão de som ---------- */
  var muteBtn = document.getElementById('muteBtn');

  function renderMuteState() {
    if (!muteBtn) return;
    var muted = H.audio.isMuted();

    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.setAttribute('aria-label', muted ? 'Ativar áudio' : 'Silenciar áudio');
    muteBtn.querySelector('.icon-btn__icon').textContent = muted ? '🔇' : '🔊';
    muteBtn.querySelector('.icon-btn__label').textContent = muted ? 'Mudo' : 'Som';
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      H.audio.toggleMute();
      renderMuteState();
      // Feedback sonoro ao reativar o som
      if (!H.audio.isMuted()) H.audio.playClick();
    });
    renderMuteState();
  }

  /* ---------- Desbloqueio de áudio (iOS/Safari) ---------- */
  function unlockOnce() {
    H.audio.unlock();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
  }
  window.addEventListener('pointerdown', unlockOnce, { once: true });
  window.addEventListener('keydown', unlockOnce, { once: true });

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();