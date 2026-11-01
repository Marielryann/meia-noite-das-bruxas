/* =========================================================
   countdown.js — contagem regressiva para a
   "Meia-Noite das Bruxas" (31/10 → 01/11 às 00:00).
   ========================================================= */
window.Halloween = window.Halloween || {};

(function (H) {
  'use strict';

  var el = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds')
  };
  if (!el.days) return; // markup ausente

  var target = getTarget();

  /* Retorna o próximo 01/11 às 00:00 (o fim da noite de Halloween). */
  function getTarget() {
    var now = new Date();
    var year = now.getFullYear();
    var t = new Date(year, 10, 1, 0, 0, 0, 0); // mês 10 = novembro
    if (now.getTime() >= t.getTime()) {
      t = new Date(year + 1, 10, 1, 0, 0, 0, 0);
    }
    return t;
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tick() {
    var diff = target.getTime() - Date.now();

    // Virou a meia-noite? Recalcula para o próximo ano.
    if (diff <= 0) {
      target = getTarget();
      diff = target.getTime() - Date.now();
    }

    var total = Math.max(0, diff);

    var days    = Math.floor(total / 86400000);
    var hours   = Math.floor(total / 3600000) % 24;
    var minutes = Math.floor(total / 60000) % 60;
    var seconds = Math.floor(total / 1000) % 60;

    el.days.textContent    = pad(days);
    el.hours.textContent   = pad(hours);
    el.minutes.textContent = pad(minutes);
    el.seconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);

  H.countdown = { refresh: tick };
})(window.Halloween);