# 🎃 Meia-Noite das Bruxas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

Um site interativo e responsivo com temática de Halloween. O projeto foi construído do zero com foco em criar uma experiência imersiva, sombria e divertida, utilizando apenas tecnologias web nativas (Vanilla JS).

## 🔗 Acesse o projeto ao vivo
👉 **[Clique aqui para visitar o site](https://marielryann.github.io/meia-noite-das-bruxas/)**

---

## ✨ Funcionalidades

- **🌙 Contador Regressivo:** Contagem dinâmica em tempo real para a "Meia-Noite das Bruxas" (transição de 31/10 para 01/11).
- **🍬 Mini-game "Doces ou Travessuras":** Ao clicar no botão, o usuário sorteia entre doces (ganha pontos e som festivo) ou travessuras (dispara um jumpscare com um fantasma e um susto sonoro).
- **🧙‍♂️ Gerador de Nomes de Monstro:** Insira seu nome e receba um título assustador gerado aleatoriamente (ex: *"Lucas, o Devorador de Código"*).
- **🦇 Fundo Animado (Canvas):** Morcegos batendo asas e abóboras iluminadas flutuando suavemente pela tela, renderizados com JavaScript Canvas 2D.
- **🔊 Efeitos Sonoros Sintetizados:** Todos os sons (doces, sustos, cliques) são gerados em tempo real via Web Audio API, sem precisar carregar arquivos `.mp3`. Inclui botão de Mutar/Desmutar.
- **📱 Design Mobile-First:** Layout 100% adaptável para celulares, tablets e desktops.
- **♿ Acessibilidade:** Suporte a `prefers-reduced-motion` (desativa animações pesadas para quem prefere menos movimento) e navegação com leitores de tela.

## 🎨 Paleta de Cores e Design
- **Roxo Profundo:** `#1a002c` (Fundo e atmosfera)
- **Laranja Abóbora:** `#ff6600` (Destaques e títulos)
- **Verde Monstro/Neon:** `#39ff14` (Botões, luzes e efeitos)
- **Preto Macabro:** `#0d0d0d` (Camadas de profundidade)
- **Tipografia:** *Creepster* e *Nosifer* (via Google Fonts) para os títulos, e *Poppins* para leitura.

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estrutura semântica)
- **CSS3** (Variáveis, Flexbox, Grid, Animações, Glassmorphism)
- **JavaScript (ES6+)** (Lógica, manipulação de DOM, Canvas 2D, Web Audio API, LocalStorage)
- **Git e GitHub** (Versionamento)
- **GitHub Pages** (Hospedagem)

## 📂 Estrutura do Projeto

```text
meia-noite-das-bruxas/
│
├── index.html          # Estrutura principal do site
├── README.md           # Documentação
│
├── css/
│   └── style.css       # Estilos, animações e responsividade
│
└── js/
    ├── audio.js        # Motor de áudio sintetizado (Web Audio API)
    ├── countdown.js    # Lógica do contador regressivo
    ├── game.js         # Lógica do mini-game e jumpscare
    ├── main.js         # Inicialização geral e botão de mute
    ├── namegen.js      # Gerador de nomes de monstros
    └── particles.js    # Animação de fundo (morcegos e abóboras)
