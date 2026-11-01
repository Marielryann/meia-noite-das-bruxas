/* =========================================================
   audio.js — motor de áudio sintetizado (Web Audio API).
   Nenhum arquivo .mp3 necessário: os sons são gerados
   em tempo real. Inclui estado de mudo persistente.
   ========================================================= */
window.Halloween = window.Halloween || {};

(function (H) {
  'use strict';

  var STORAGE_KEY = 'halloween:muted';

  var ctx = null;       // AudioContext (criado no 1º gesto do usuário)
  var master = null;    // GainNode principal
  var muted = false;

  /* --- Recupera preferência salva --- */
  try {
    muted = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) { /* localStorage indisponível (modo privado etc.) */ }

  /* Cria/retoma o contexto de áudio. Deve rodar dentro de um gesto do usuário. */
  function ensureContext() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null; // navegador sem suporte
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') { ctx.resume(); }
    return ctx;
  }

  /* Toca um tom simples com envelope e slide opcional. */
  function playTone(opts) {
    if (muted) return;
    var c = ensureContext();
    if (!c) return;

    var freq     = opts.freq     || 440;
    var type     = opts.type     || 'sine';
    var duration = opts.duration || 0.2;
    var volume   = opts.volume   || 0.25;
    var delay    = opts.delay    || 0;
    var slideTo  = opts.slideTo  || null;

    var t0 = c.currentTime + delay;

    var osc = c.createOscillator();
    var gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + duration);
    }

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  }

  /* ---- Efeitos ---- */

  // Docinho: arpejo alegre e brilhante
  function playCandy() {
    var notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach(function (f, i) {
      playTone({ freq: f, type: 'triangle', duration: 0.18, volume: 0.22, delay: i * 0.075 });
    });
  }

  // Travessura: ruído descendente + cluster dissonante
  function playTrick() {
    if (muted) return;
    var c = ensureContext();
    if (!c) return;

    var t0 = c.currentTime;
    var dur = 0.7;

    // 1) Rajada de ruído filtrado (o "susto")
    var frames = Math.floor(c.sampleRate * dur);
    var buffer = c.createBuffer(1, frames, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < frames; i++) {
      var decay = 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * decay * decay;
    }

    var noise = c.createBufferSource();
    noise.buffer = buffer;

    var filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(3200, t0);
    filter.frequency.exponentialRampToValueAtTime(240, t0 + dur);

    var ng = c.createGain();
    ng.gain.setValueAtTime(0.55, t0);
    ng.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

    noise.connect(filter).connect(ng).connect(master);
    noise.start(t0);

    // 2) Tons dissonantes por cima
    playTone({ freq: 180,  type: 'sawtooth', duration: 0.6,  volume: 0.18, slideTo: 90 });
    playTone({ freq: 191,  type: 'square',   duration: 0.55, volume: 0.12, slideTo: 96 });
    playTone({ freq: 1200, type: 'sawtooth', duration: 0.35, volume: 0.08, slideTo: 300, delay: 0.02 });
  }

  // Clique curto
  function playClick() {
    playTone({ freq: 880, type: 'square', duration: 0.06, volume: 0.08 });
  }

  /* Alterna mudo/desmudo e retorna o novo estado. */
  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem(STORAGE_KEY, String(muted)); } catch (e) {}
    return muted;
  }

  function isMuted() { return muted; }

  /* Desbloqueia o áudio no primeiro gesto (iOS/Safari). */
  function unlock() {
    ensureContext();
  }

  H.audio = {
    unlock: unlock,
    toggleMute: toggleMute,
    isMuted: isMuted,
    playCandy: playCandy,
    playTrick: playTrick,
    playClick: playClick
  };
})(window.Halloween);