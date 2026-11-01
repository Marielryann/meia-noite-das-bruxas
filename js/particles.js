/* =========================================================
   particles.js — fundo animado em Canvas 2D.
   Desenha morcegos batendo asas e abóboras iluminadas
   flutuando suavemente pela tela.
   ========================================================= */
window.Halloween = window.Halloween || {};

(function (H) {
  'use strict';

  var canvas = document.getElementById('particles');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var width = 0, height = 0, dpr = 1;
  var particles = [];
  var rafId = null;
  var lastTime = 0;
  var running = false;
  var resizeTimer = null;

  /* ---------- Utilidades ---------- */
  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ---------- Dimensionamento ---------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildParticles();
  }

  /* Quantidade de partículas proporcional à área da tela */
  function particleCount() {
    var byArea = Math.round((width * height) / 38000);
    var max = reduceMotion ? 8 : 28;
    return Math.max(8, Math.min(max, byArea));
  }

  function createParticle(spreadVertically) {
    var isBat = Math.random() < 0.55;
    var size = isBat ? rand(9, 17) : rand(10, 21);

    return {
      type: isBat ? 'bat' : 'pumpkin',
      x: rand(-60, width + 60),
      y: spreadVertically ? rand(0, height) : height + rand(20, 140),
      vx: rand(-0.3, 0.3),
      vy: isBat ? rand(-0.55, -0.22) : rand(-0.34, -0.14),
      size: size,
      rotation: rand(-0.45, 0.45),
      spin: rand(-0.004, 0.004),
      sway: rand(0.35, 1.1),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.35, 0.8)
    };
  }

  function buildParticles() {
    var total = particleCount();
    particles = [];
    for (var i = 0; i < total; i++) {
      particles.push(createParticle(true));
    }
  }

  function resetParticle(p) {
    var fresh = createParticle(false);
    p.x = fresh.x;
    p.y = fresh.y;
    p.vx = fresh.vx;
    p.vy = fresh.vy;
    p.size = fresh.size;
    p.alpha = fresh.alpha;
    p.phase = fresh.phase;
  }

  /* ---------- Desenho: morcego ---------- */
  function drawBat(size, time, phase) {
    var s = size;
    // 0.3..1 → intensidade da batida de asa
    var flap = 0.55 + 0.45 * Math.sin(time * 0.012 + phase);

    ctx.beginPath();

    // Asa esquerda
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-s * 0.9, -s * 1.15 * flap, -s * 1.85, -s * 0.12 * flap);
    ctx.quadraticCurveTo(-s * 1.15, s * 0.28, -s * 1.5, s * 0.72 * flap);
    ctx.quadraticCurveTo(-s * 0.7, s * 0.42, 0, s * 0.45);

    // Asa direita
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(s * 0.9, -s * 1.15 * flap, s * 1.85, -s * 0.12 * flap);
    ctx.quadraticCurveTo(s * 1.15, s * 0.28, s * 1.5, s * 0.72 * flap);
    ctx.quadraticCurveTo(s * 0.7, s * 0.42, 0, s * 0.45);

    ctx.fill();

    // Corpo
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.26, s * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Orelhas pontudas
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.34);
    ctx.lineTo(-s * 0.35, -s * 0.78);
    ctx.lineTo(-s * 0.02, -s * 0.42);
    ctx.closePath();
    ctx.moveTo(s * 0.2, -s * 0.34);
    ctx.lineTo(s * 0.35, -s * 0.78);
    ctx.lineTo(s * 0.02, -s * 0.42);
    ctx.closePath();
    ctx.fill();
  }

  /* ---------- Desenho: abóbora iluminada ---------- */
  function drawPumpkin(size) {
    var s = size;

    // Corpo laranja
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.82, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6600';
    ctx.fill();

    // Gomos
    ctx.strokeStyle = 'rgba(120, 40, 0, 0.85)';
    ctx.lineWidth = Math.max(1, s * 0.09);
    [-0.55, 0, 0.55].forEach(function (k) {
      ctx.beginPath();
      ctx.ellipse(k * s * 0.55, 0, s * 0.4, s * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Caule verde
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, -s * 0.78);
    ctx.lineTo(s * 0.12, -s * 0.78);
    ctx.lineTo(s * 0.05, -s * 1.18);
    ctx.lineTo(-s * 0.05, -s * 1.18);
    ctx.closePath();
    ctx.fillStyle = '#39ff14';
    ctx.fill();

    // Rosto brilhante (olhos triangulares + boca em zigue-zague)
    ctx.fillStyle = '#39ff14';

    ctx.beginPath();
    ctx.moveTo(-s * 0.46, -s * 0.16);
    ctx.lineTo(-s * 0.16, -s * 0.16);
    ctx.lineTo(-s * 0.31, s * 0.1);
    ctx.closePath();

    ctx.moveTo(s * 0.46, -s * 0.16);
    ctx.lineTo(s * 0.16, -s * 0.16);
    ctx.lineTo(s * 0.31, s * 0.1);
    ctx.closePath();

    ctx.moveTo(-s * 0.46, s * 0.36);
    ctx.lineTo(-s * 0.31, s * 0.2);
    ctx.lineTo(-s * 0.16, s * 0.38);
    ctx.lineTo(0, s * 0.2);
    ctx.lineTo(s * 0.16, s * 0.38);
    ctx.lineTo(s * 0.31, s * 0.2);
    ctx.lineTo(s * 0.46, s * 0.36);
    ctx.closePath();

    ctx.fill();
  }

  /* ---------- Loop de animação ---------- */
  function render(time) {
    rafId = requestAnimationFrame(render);

    var delta = lastTime ? Math.min(42, time - lastTime) : 16.67;
    lastTime = time;
    var k = delta / 16.67; // fator para manter velocidade constante

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Movimento: deriva vertical + balanço lateral suave
      p.phase += 0.03 * k;
      p.x += (p.vx + Math.sin(p.phase) * p.sway * 0.4) * k;
      p.y += p.vy * k;
      p.rotation += p.spin * k;

      // Reposicionamento (wrap)
      if (p.y < -140) resetParticle(p);
      if (p.x < -170) p.x = width + 130;
      if (p.x > width + 170) p.x = -130;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;

      if (p.type === 'bat') {
        ctx.fillStyle = '#c9a7ff';
        drawBat(p.size, time, p.phase);
      } else {
        drawPumpkin(p.size);
      }

      ctx.restore();
    }
  }

  /* ---------- Controle ---------- */
  function start() {
    if (running) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* Pausa quando a aba está oculta (economiza bateria/CPU) */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  /* Debounce no resize */
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  resize();
  start();

  H.particles = { start: start, stop: stop, resize: resize };
})(window.Halloween);