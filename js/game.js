/* =========================================================
   game.js — Mini-game "Doces ou Travessuras".
   - Doce  → pontos + som festivo + mensagem verde.
   - Travessura → jumpscare + som de susto + flash na tela.
   ========================================================= */
window.Halloween = window.Halloween || {};

(function (H) {
  'use strict';

  var btn = document.getElementById('treatBtn');
  if (!btn) return;

  var scoreEl      = document.getElementById('scoreValue');
  var messageEl    = document.getElementById('gameMessage');
  var jumpscareEl  = document.getElementById('jumpscare');
  var cardEl       = document.getElementById('gameCard');

  var STORAGE_KEY = 'halloween:score';
  var CHANCE_CANDY = 0.62; // 62% doce / 38% travessura

  var CANDY_MESSAGES = [
    '🍬 Doce! Um caramelo amaldiçoado aparece na sua mão.',
    '🍫 Doce! Chocolate meio amargo… como a alma do vizinho.',
    '🍭 Doce! Pirulito de morango com um leve gosto de poção.',
    '🧁 Doce! Cupcake com cobertura de teia de aranha.',
    '🍪 Doce! Biscoito em forma de morcego. Ele piscou?',
    '🍬 Doce! Açúcar suficiente para acordar um zumbi.'
  ];

  var TRICK_MESSAGES = [
    '👻 Travessura! O fantasma do vizinho acordou.',
    '🕷️ Travessura! Uma aranha desceu… no seu teclado.',
    '🦇 Travessura! Morcegos invadiram a sua aba do navegador.',
    '💀 Travessura! A abóbora riu de você. Alto. Muito alto.',
    '🧟 Travessura! Alguém trocou seu café por poção verde.'
  ];

  var score = 0;
  try {
    score = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  } catch (e) { score = 0; }

  var busy = false;
  var scareTimer = null;

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, String(score)); } catch (e) {}
  }

  function renderScore() {
    scoreEl.textContent = score;
  }

  function pulseScore() {
    scoreEl.classList.remove('is-pulsing');
    void scoreEl.offsetWidth; // força reflow para reiniciar a animação
    scoreEl.classList.add('is-pulsing');
  }

  function showMessage(text, kind) {
    messageEl.classList.remove('is-visible', 'is-candy', 'is-trick');
    void messageEl.offsetWidth;
    messageEl.textContent = text;
    messageEl.classList.add('is-visible', kind === 'candy' ? 'is-candy' : 'is-trick');
  }

  /* ---------- Doce ---------- */
  function doCandy() {
    score += 1;
    persist();
    renderScore();
    pulseScore();

    H.audio.playCandy();
    showMessage(pick(CANDY_MESSAGES), 'candy');
  }

  /* ---------- Travessura ---------- */
  function doTrick() {
    H.audio.playTrick();
    showMessage(pick(TRICK_MESSAGES), 'trick');
    triggerScare();
  }

  /* Jumpscare: overlay em tela cheia + tremor do card.
     O overlay cobre a tela com um degradê verde/preto,
     funcionando como o "flash" temporário de cor. */
  function triggerScare() {
    jumpscareEl.classList.remove('is-active');
    void jumpscareEl.offsetWidth;

    jumpscareEl.classList.add('is-active');
    jumpscareEl.setAttribute('aria-hidden', 'false');

    cardEl.classList.remove('is-shaking');
    void cardEl.offsetWidth;
    cardEl.classList.add('is-shaking');

    clearTimeout(scareTimer);
    scareTimer = setTimeout(function () {
      jumpscareEl.classList.remove('is-active');
      jumpscareEl.setAttribute('aria-hidden', 'true');
      cardEl.classList.remove('is-shaking');
    }, 950);
  }

  /* ---------- Clique principal ---------- */
  btn.addEventListener('click', function () {
    if (busy) return;
    busy = true;
    btn.disabled = true;

    H.audio.playClick();

    var isCandy = Math.random() < CHANCE_CANDY;
    if (isCandy) doCandy();
    else doTrick();

    // Trava curta para evitar spam e sobreposição de animações
    setTimeout(function () {
      busy = false;
      btn.disabled = false;
    }, isCandy ? 420 : 1050);
  });

  renderScore();

  H.game = {
    getScore: function () { return score; },
    reset: function () {
      score = 0;
      persist();
      renderScore();
    }
  };
})(window.Halloween);