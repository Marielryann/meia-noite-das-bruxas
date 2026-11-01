/* =========================================================
   namegen.js — Gerador de nomes de monstro.
   Ex.: "Lucas" → "Lucastein, o Devorador de Código"
   ========================================================= */
window.Halloween = window.Halloween || {};

(function (H) {
  'use strict';

  var form = document.getElementById('nameForm');
  if (!form) return;

  var input  = document.getElementById('nameInput');
  var result = document.getElementById('monsterResult');

  /* Títulos clássicos (usados quando não derivamos do nome do usuário) */
  var TITLES = [
    'Vlad', 'Drácula', 'Conde', 'Barão', 'Lorde', 'Mestre',
    'Morgana', 'Carmilla', 'Belladonna', 'Nocturno', 'Grimm',
    'Salem', 'Nyx', 'Lúcifer', 'Morticia', 'Ravena'
  ];

  /* Sufixos para transformar o nome do usuário em nome monstruoso */
  var SUFFIXES = [
    'stein', 'or', 'ath', 'ula', 'gor', 'mort',
    'vox', 'zul', 'ek', 'ara', 'oth', 'yss', 'grim', 'thar', 'nax'
  ];

  /* Epítetos assustadores (com temática dev/geek) */
  var EPITHETS = [
    'o Devorador de Código',
    'a Sombra dos Corredores',
    'o Colecionador de Bugs',
    'o Sussurrador da Meia-Noite',
    'o Senhor dos Doces Roubados',
    'a Bruxa do CSS Perdido',
    'o Escriba das Almas Binárias',
    'o Fantasma do Commit Perdido',
    'a Lenda do Servidor Assombrado',
    'o Engolidor de Abóboras',
    'o Tecelão de Pesadelos',
    'a Voz do Vazio',
    'o Guardião dos Erros 404',
    'o Barão das Trevas Digitais',
    'o Mestre dos Sustos Inesperados',
    'o Arquivista dos Sonhos Mortos',
    'a Chama que Nunca se Apaga',
    'o Rei dos Morcegos Desempregados'
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* Monta o nome monstruoso a partir do nome digitado */
  function buildMonsterName(rawName) {
    var first = (rawName.trim().split(/\s+/)[0] || 'Estranho');
    var base  = capitalize(first.toLowerCase());

    var monsterFirst;
    if (Math.random() < 0.6) {
      // 60%: deriva do nome do usuário
      monsterFirst = base + pick(SUFFIXES);
    } else {
      // 40%: usa um título clássico
      monsterFirst = pick(TITLES);
    }

    return monsterFirst + ', ' + pick(EPITHETS);
  }

  function reveal(name) {
    result.classList.remove('is-revealed');
    void result.offsetWidth; // reinicia a animação
    result.textContent = name;
    result.classList.add('is-revealed');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = input.value.trim();
    if (!name) {
      input.focus();
      return;
    }

    H.audio.playClick();
    reveal(buildMonsterName(name));
  });
})(window.Halloween);