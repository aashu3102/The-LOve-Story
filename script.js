/* ═══════════════════════════════════════════════════════════════
   AASHU & SHAMBHAVI — Our Story  |  script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── GLOBALS ────────────────────────────────────────────────── */
const TOTAL_CARDS  = 33;
const START_DATE   = new Date('2025-08-25T00:00:00');
let   currentCard  = 0;
let   isAnimating  = false;
let   swipeHidden  = false;

// Background audio — references the <audio id="backgroundAudio"> in HTML
let bgAudio = null;
let audioStarted = false;



/* ── TABLE OF CONTENTS DATA ─────────────────────────────────── */
const TOC_DATA = [
  { num: '01', title: 'The Day It All Began',        icon: '❤' },
  { num: '02', title: 'She Accepted The Request',     icon: '✔' },
  { num: '03', title: 'First Hello',                  icon: '★' },
  { num: '04', title: 'Getting to Know You',          icon: '♥' },
  { num: '05', title: 'Late Night Talks',             icon: '☽' },
  { num: '06', title: 'The First Fight',              icon: '⛈' },
  { num: '07', title: 'I Knew You Were Different',    icon: '♥' },
  { num: '08', title: 'The Butterflies',              icon: '♥' },
  { num: '09', title: 'Our First Call',               icon: '☎' },
  { num: '10', title: 'Learning Your World',          icon: '♣' },
  { num: '11', title: 'When You Understood Me',       icon: '☁' },
  { num: '12', title: 'Our Second Fight',             icon: '★' },
  { num: '13', title: 'Missing You',                  icon: '♦' },
  { num: '14', title: 'The Commitment',               icon: '♥' },
  { num: '15', title: 'Learning to be Patient',       icon: '∞' },
  { num: '16', title: 'Good Morning Sunshine',        icon: '☀' },
  { num: '17', title: 'Your Laugh',                   icon: '♥' },
  { num: '18', title: 'The Distance Between Us',      icon: '⚓' },
  { num: '19', title: 'Imagining Meeting You',        icon: '♦' },
  { num: '20', title: 'You Made Me Better',           icon: '✦' },
  { num: '21', title: 'Your Strength',                icon: '★' },
  { num: '22', title: 'When We Almost Lost Our Way',  icon: '♥' },
  { num: '23', title: 'Our First Sexchat',            icon: '♥' },
  { num: '24', title: 'When You\'re Sad',             icon: '☁' },
  { num: '25', title: 'Pure Hearted Beauty',          icon: '♥' },
  { num: '26', title: 'Soft Teasing Energy',          icon: '♦' },
  { num: '27', title: 'You Are Home',                 icon: '♥' },
  { num: '28', title: 'Behind Her Smile',     icon: '♥' },
  { num: '29', title: 'Written In Stars',           icon: '☽' },
  { num: '30', title: '25 August The Day We Found Each Other', icon: '❤' },
];

/* ══════════════════════════════════════════════════════════════
INIT
 ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildTOC();
  buildAmbientParticles();
  initStars('starsCanvas');
  initStars('tocStarsCanvas');
  buildFireflies('jugnuLayer', 28);
  buildFireflies('tocJugnuLayer', 16);
  buildGoldParticles();
  buildLetterPetals();
  buildGrassBlades();
  buildRiverWaves();
  initTimer();
  initCursor();
  initSwipe();
  initKeyboard();
  showCard(0);
  updateNavBtns();
  updateProgress();
  setTimeout(hideSwipeHint, 5000);
});

/* ══════════════════════════════════════════════════════════════
   TOC BUILD
   ══════════════════════════════════════════════════════════════ */
function buildTOC() {
  const grid = document.getElementById('tocGrid');
  if (!grid) return;
  TOC_DATA.forEach((ch, i) => {
    const item = document.createElement('div');
    item.className = 'toc-item';
    item.innerHTML = `
      <div class="toc-item-num">Chapter ${toRoman(i + 1)}</div>
      <div class="toc-item-title">${ch.title}</div>
      <div class="toc-item-icon">${ch.icon}</div>`;
    item.addEventListener('click', () => goTo(i + 2));
    grid.appendChild(item);
  });
}

function toRoman(n) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let r = '';
  vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v; } });
  return r;
}

/* ══════════════════════════════════════════════════════════════
   STARS CANVAS
   ══════════════════════════════════════════════════════════════ */
function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H, raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    stars = [];
    const count = Math.floor(W * H / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        da: (Math.random() * 0.01 + 0.003) * (Math.random() < .5 ? 1 : -1),
        twinkle: Math.random() > 0.6,
        color: Math.random() < .1 ? '#ffd0a0' : '#ffffff',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      if (s.twinkle) { s.a += s.da; if (s.a > 1 || s.a < 0.05) s.da *= -1; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(s.color)},${s.a.toFixed(2)})`;
      ctx.fill();
      if (s.r > 1.1 && s.a > 0.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(s.color)},${(s.a * 0.12).toFixed(2)})`;
        ctx.fill();
      }
    });
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || document.body);
}

function hexToRgb(hex) {
  if (hex === '#ffffff') return '255,255,255';
  if (hex === '#ffd0a0') return '255,208,160';
  return '255,255,255';
}

/* ══════════════════════════════════════════════════════════════
   FIREFLIES
   ══════════════════════════════════════════════════════════════ */
function buildFireflies(layerId, count) {
  const layer = document.getElementById(layerId);
  if (!layer) return;
  layer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const j = document.createElement('div');
    j.className = 'jugnu';
    const s = Math.random() * 5 + 3;
    const x = Math.random() * 100;
    const y = Math.random() * 80 + 10;
    const dur = (Math.random() * 4 + 3).toFixed(1);
    const del = (Math.random() * 6).toFixed(1);
    const dx1 = (Math.random() * 40 - 20).toFixed(0) + 'px';
    const dy1 = (Math.random() * 40 - 20).toFixed(0) + 'px';
    const dx2 = (Math.random() * 60 - 30).toFixed(0) + 'px';
    const dy2 = (Math.random() * 60 - 30).toFixed(0) + 'px';
    const dx3 = (Math.random() * 30 - 15).toFixed(0) + 'px';
    const dy3 = (Math.random() * 30 - 15).toFixed(0) + 'px';
    const dx4 = (Math.random() * 50 - 25).toFixed(0) + 'px';
    const dy4 = (Math.random() * 50 - 25).toFixed(0) + 'px';
    j.style.cssText = `
      width:${s}px; height:${s}px;
      left:${x}%; top:${y}%;
      --jd:${dur}s; --jdl:${del}s;
      --jx1:${dx1}; --jy1:${dy1};
      --jx2:${dx2}; --jy2:${dy2};
      --jx3:${dx3}; --jy3:${dy3};
      --jx4:${dx4}; --jy4:${dy4};
    `;
    layer.appendChild(j);
  }
}

/* ══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES
   ══════════════════════════════════════════════════════════════ */
function buildAmbientParticles() {
  const layer = document.getElementById('ambientParticles');
  if (!layer) return;
  const colors = [
    'rgba(192,71,74,.35)',
    'rgba(201,168,76,.3)',
    'rgba(168,128,255,.25)',
    'rgba(255,150,180,.2)',
  ];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'amb-p';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --dur:${(Math.random()*8+8).toFixed(1)}s;
      --del:${(Math.random()*6).toFixed(1)}s;
      filter:blur(${Math.random()>.5?'0':'1'}px);
    `;
    layer.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════════
   GRASS BLADES
   ══════════════════════════════════════════════════════════════ */
function buildGrassBlades() {
  const layer = document.getElementById('grassLayer');
  if (!layer) return;
  for (let i = 0; i < 80; i++) {
    const g = document.createElement('div');
    const h = Math.random() * 40 + 20;
    const w = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const hue = Math.random() * 30 + 200;
    g.style.cssText = `
      position:absolute; bottom:0;
      left:${x}%; width:${w}px; height:${h}px;
      background:linear-gradient(to top, rgba(30,10,60,.9), rgba(80,30,140,.4));
      transform-origin:bottom center;
      border-radius:2px 2px 0 0;
      animation:grassWave ${(Math.random()*2+2).toFixed(1)}s ease-in-out infinite;
      animation-delay:${(Math.random()*2).toFixed(1)}s;
    `;
    layer.appendChild(g);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes grassWave {
      0%,100% { transform:rotate(0deg) scaleY(1); }
      50%      { transform:rotate(4deg) scaleY(1.03); }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════════════════════
   RIVER SVG WAVES
   ══════════════════════════════════════════════════════════════ */
function buildRiverWaves() {
  const svg = document.getElementById('riverSVG');
  if (!svg) return;
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const y = 20 + i * 14;
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', `rgba(255,${180 + i * 10},${100 + i * 15},${0.15 - i * 0.02})`);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('d', makeSinePath(y, i));
    svg.appendChild(path);
    lines.push({ path, y, phase: i * Math.PI / 3 });
  }

  let t = 0;
  function animWaves() {
    t += 0.02;
    lines.forEach((l, i) => {
      l.path.setAttribute('d', makeSinePathAnim(l.y, l.phase + t, i));
    });
    requestAnimationFrame(animWaves);
  }
  animWaves();
}

function makeSinePath(y) {
  let d = `M 0 ${y}`;
  for (let x = 0; x <= 100; x += 5) {
    const sy = y + Math.sin(x * 0.2) * 4;
    d += ` L ${x} ${sy}`;
  }
  return d;
}
function makeSinePathAnim(y, phase, i) {
  let d = `M 0 ${y}`;
  for (let x = 0; x <= 100; x += 4) {
    const sy = y + Math.sin(x * 0.15 + phase) * 5 + Math.sin(x * 0.3 + phase * 1.5) * 2;
    d += ` L ${x} ${sy}`;
  }
  return d;
}

/* ══════════════════════════════════════════════════════════════
   GOLD PARTICLES (S30)
   ══════════════════════════════════════════════════════════════ */
function buildGoldParticles() {
  const layer = document.getElementById('s30gold');
  if (!layer) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'gold-pt';
    const s = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${s}px; height:${s}px;
      left:${Math.random()*100}%;
      --gd:${(Math.random()*5+4).toFixed(1)}s;
      --gdl:${(Math.random()*6).toFixed(1)}s;
    `;
    layer.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════════
   LETTER PETALS
   ══════════════════════════════════════════════════════════════ */
function buildLetterPetals() {
  const layer = document.getElementById('letterPetals');
  if (!layer) return;
  const symbols = ['🌸', '🌹', '❤', '✿', '✾', '♥', '🌺'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.cssText = `
      left:${Math.random()*100}%;
      --pd:${(Math.random()*6+5).toFixed(1)}s;
      --pdl:${(Math.random()*8).toFixed(1)}s;
      font-size:${Math.floor(Math.random()*14+10)}px;
    `;
    layer.appendChild(p);
  }
}

/* ══════════════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════════════ */
function initTimer() {
  updateTimer();
  setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const diff = now - START_DATE;
  if (diff < 0) return;

  const totalSecs = Math.floor(diff / 1000);
  const s = totalSecs % 60;
  const m = Math.floor(totalSecs / 60) % 60;
  const h = Math.floor(totalSecs / 3600) % 24;
  const d = Math.floor(diff / 86400000);

  setText('tDays',  String(d).padStart(3, '0'));
  setText('tHours', String(h).padStart(2, '0'));
  setText('tMins',  String(m).padStart(2, '0'));
  setText('tSecs',  String(s).padStart(2, '0'));

  // Animate rings
  setRing('ringDays', d % 365, 365);
  setRing('ringHrs',  h,       24);
  setRing('ringMins', m,       60);
  setRing('ringSecs', s,       60);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setRing(id, val, max) {
  const el = document.getElementById(id);
  if (!el) return;
  const circ = 207.3;
  const pct = Math.min(val / max, 1);
  el.style.strokeDashoffset = circ - circ * pct;
}

/* ══════════════════════════════════════════════════════════════
   CARD NAVIGATION
   ══════════════════════════════════════════════════════════════ */
function showCard(index, dir = 'next') {
  const cards = document.querySelectorAll('.card');

  // Exit current
  cards.forEach(c => {
    if (c.classList.contains('active')) {
      c.classList.remove('active');
      c.classList.add(dir === 'next' ? 'exit-left' : 'exit-right');
      setTimeout(() => c.classList.remove('exit-left', 'exit-right'), 700);
    }
  });

  // Enter new
  const target = document.getElementById(`card-${index}`);
  if (!target) return;

  target.style.transform = dir === 'next' ? 'translateX(60px) scale(.97)' : 'translateX(-60px) scale(.97)';
  target.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.style.transform = '';
      target.style.opacity = '';
      target.classList.add('active');
    });
  });

  currentCard = index;
  // adjust audio playback when card changes
  handleAudioForCard(index);
}

function nextCard() {
  if (isAnimating) return;
  if (currentCard >= TOTAL_CARDS - 1) return;
  isAnimating = true;
  showCard(currentCard + 1, 'next');
  updateNavBtns();
  updateProgress();
  if (!swipeHidden) hideSwipeHint();
  setTimeout(() => { isAnimating = false; }, 700);
}

function prevCard() {
  if (isAnimating) return;
  if (currentCard <= 0) return;
  isAnimating = true;
  showCard(currentCard - 1, 'prev');
  updateNavBtns();
  updateProgress();
  setTimeout(() => { isAnimating = false; }, 700);
}

function goTo(index) {
  if (isAnimating) return;
  const dir = index > currentCard ? 'next' : 'prev';
  isAnimating = true;
  showCard(index, dir);
  updateNavBtns();
  updateProgress();
  setTimeout(() => { isAnimating = false; }, 700);
}

function updateNavBtns() {
  const prev = document.getElementById('navPrev');
  const next = document.getElementById('navNext');
  if (prev) prev.disabled = currentCard <= 0;
  if (next) next.disabled = currentCard >= TOTAL_CARDS - 1;
}

function updateProgress() {
  const fill = document.getElementById('progressFill');
  if (fill) {
    const pct = TOTAL_CARDS > 1 ? (currentCard / (TOTAL_CARDS - 1)) * 100 : 0;
    fill.style.width = pct + '%';
  }
}

/* ── Expose globals needed by inline onclick ─── */
window.nextCard = nextCard;
window.prevCard = prevCard;
window.goTo     = goTo;

/* ══════════════════════════════════════════════════════════════
   SWIPE (TOUCH)
   ══════════════════════════════════════════════════════════════ */
function initSwipe() {
  let startX = 0, startY = 0, locked = false;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    locked = false;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (locked) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      locked = true;
    }
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) nextCard();
      else         prevCard();
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   KEYBOARD
   ══════════════════════════════════════════════════════════════ */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextCard();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevCard();
    if (e.key === ' ') { e.preventDefault(); toggleMusic(); }
  });
}

/* ══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mx = -100, my = -100, cx = -100, cy = -100;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function smoothCursor() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    raf = requestAnimationFrame(smoothCursor);
  }
  smoothCursor();

  // Click burst
  document.addEventListener('click', e => {
    spawnBurst(e.clientX, e.clientY);
    cursor.style.transform = 'translate(-50%,-50%) scale(1.5)';
    setTimeout(() => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; }, 200);
  });
}

function spawnBurst(x, y) {
  const layer = document.getElementById('burstLayer');
  if (!layer) return;
  const symbols = ['♥', '❤', '★', '✦', '✿'];
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.color = i % 2 === 0 ? 'rgba(192,71,74,.9)' : 'rgba(201,168,76,.85)';
    const angle = (i / 8) * Math.PI * 2;
    const dist  = 40 + Math.random() * 40;
    const bx = Math.cos(angle) * dist + 'px';
    const by = (Math.sin(angle) * dist - 20) + 'px';
    h.style.setProperty('--bx', bx);
    h.style.setProperty('--by', by);
    h.style.left = x + 'px';
    h.style.top  = y + 'px';
    h.style.fontSize = (Math.random() * 10 + 10) + 'px';
    layer.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }
}

/* ══════════════════════════════════════════════════════════════
   MUSIC (Web Audio API — generative ambient)
   ══════════════════════════════════════════════════════════════ */
function initMusicButton() {
  const btn = document.getElementById('musicPlayBtn');
  if (btn) btn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
  if (!musicPlaying) {
    startMusic();
  } else {
    stopMusic();
  }
}
window.toggleMusic = toggleMusic;

function startMusic() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 2);
    gainNode.connect(audioCtx.destination);

    // Add reverb
    const reverb = createReverb(audioCtx);
    const reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.4;
    gainNode.connect(reverbGain);
    reverbGain.connect(reverb);
    reverb.connect(audioCtx.destination);

    // Base ambient drone
    playAmbientDrone();

    // Melodic notes sequence
    scheduleMelody(audioCtx.currentTime);

    musicPlaying = true;
    updateMusicUI();
    spawnMusicNotes();
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

function stopMusic() {
  if (gainNode) {
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
      musicNodes = [];
    }, 1600);
  }
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  musicPlaying = false;
  updateMusicUI();
}

function createReverb(ctx) {
  const conv = ctx.createConvolver();
  const length = ctx.sampleRate * 3;
  const buf    = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  conv.buffer = buf;
  return conv;
}

function playAmbientDrone() {
  if (!audioCtx || !gainNode) return;
  // Soft pad — two detuned oscillators
  [220, 220.5, 330, 440].forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = [0.06, 0.04, 0.03, 0.02][i];
    osc.connect(gain);
    gain.connect(gainNode);
    osc.start();
    musicNodes.push(osc);
  });
}

// Pentatonic scale in A-minor — romantic feel
const PENTATONIC = [220, 246.94, 261.63, 293.66, 329.63,
                    349.23, 392, 440, 493.88, 523.25];

function scheduleMelody(startTime) {
  if (!audioCtx || !gainNode) return;

  const patterns = [
    [0,2,4,3,1,4,2,0],
    [4,6,5,3,4,2,6,4],
    [2,0,1,3,5,4,2,0],
    [6,4,5,3,2,4,1,3],
  ];
  let patIdx  = 0;
  let noteIdx = 0;
  let t       = startTime + 0.5;

  function scheduleNext() {
    if (!musicPlaying) return;
    const pattern = patterns[patIdx];
    const noteFreq = PENTATONIC[pattern[noteIdx]];
    const noteFreqHigh = noteFreq * 2;

    // Choose octave
    const freq = Math.random() > 0.3 ? noteFreq : noteFreqHigh;

    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = Math.random() > 0.7 ? 'triangle' : 'sine';
    osc.frequency.value = freq;

    const noteDur = [0.4, 0.6, 0.8, 0.5][Math.floor(Math.random() * 4)];
    const noteGap = [0.5, 0.7, 0.9, 0.6][Math.floor(Math.random() * 4)];

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur);

    osc.connect(gain);
    gain.connect(gainNode);
    osc.start(t);
    osc.stop(t + noteDur + 0.1);

    t += noteGap;
    noteIdx++;
    if (noteIdx >= pattern.length) { noteIdx = 0; patIdx = (patIdx + 1) % patterns.length; }

    // Schedule within lookahead window
    const ahead = t - audioCtx.currentTime;
    setTimeout(scheduleNext, Math.max(10, (ahead - 0.2) * 1000));
  }

  scheduleNext();
}

function spawnMusicNotes() {
  if (!musicPlaying) return;
  const symbols = ['♪', '♫', '♬', '♩'];
  const btn = document.getElementById('musicPlayBtn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();

  function spawn() {
    if (!musicPlaying) return;
    const note = document.createElement('div');
    note.className = 'music-float-note';
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const nx1 = (Math.random() * 60 - 80) + 'px';
    const ny1 = (Math.random() * 40 + 40 + 'px').replace('px','px').replace('--','');
    const nx2 = (Math.random() * 80 - 100) + 'px';
    const ny2 = '-' + (Math.random() * 80 + 60) + 'px';
    const nx3 = (Math.random() * 60 - 80) + 'px';
    const ny3 = '-' + (Math.random() * 100 + 80) + 'px';
    note.style.cssText = `
      left:${rect.left + rect.width / 2}px;
      top:${rect.top}px;
      --nx1:${nx1}; --ny1:-${Math.random()*30+20}px;
      --nx2:${nx2}; --ny2:-${Math.random()*60+40}px;
      --nx3:${nx3}; --ny3:-${Math.random()*90+60}px;
    `;
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3600);
    if (musicPlaying) setTimeout(spawn, 800 + Math.random() * 600);
  }
  spawn();
}

function updateMusicUI() {
  const btn = document.getElementById('musicPlayBtn');
  const note = document.getElementById('musicNoteDisplay');
  if (btn) {
    btn.textContent  = musicPlaying ? '♫' : '♩';
    btn.title        = musicPlaying ? 'Pause Music' : 'Play Music';
    btn.classList.toggle('playing', musicPlaying);
  }
  if (note) note.classList.toggle('show', musicPlaying);
}

function handleAudioForCard(index) {
  // Song sirf tab play hoga jab 3rd card (index 2) aayega
  if (!bgAudio) bgAudio = document.getElementById('backgroundAudio');
  if (!bgAudio) return;

  if (index === 2) {
    // 3rd card par aa gaye — song play karo
    bgAudio.loop = true; // khatam hone par shuru se play hoga
    bgAudio.play().catch(() => {});
    audioStarted = true;
  }
  // Note: song band nahi hoga dusre cards par — continue karta rahega
}

/* ══════════════════════════════════════════════════════════════
   SWIPE HINT
   ══════════════════════════════════════════════════════════════ */
function hideSwipeHint() {
  const hint = document.querySelector('.swipe-hint');
  if (hint) hint.classList.add('hidden');
  swipeHidden = true;
}

/* ══════════════════════════════════════════════════════════════
   PHOTO UPLOAD
   ══════════════════════════════════════════════════════════════ */
(function initPhoto() {
  window.triggerPhotoUpload = function() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = document.querySelector('.cv-photo-frame-inner img');
      const placeholder = document.querySelector('.cv-photo-placeholder');
      if (img) {
        img.src = url;
        img.onload = () => {
          img.classList.add('loaded');
          if (placeholder) placeholder.style.display = 'none';
        };
      }
    };
    inp.click();
  };
})();

/* ══════════════════════════════════════════════════════════════
   INJECT MUSIC BUTTON & PHOTO FRAME + SWIPE HINT (after DOM ready)
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Music controls
  const mc = document.createElement('div');
  mc.className = 'music-controls';
  mc.innerHTML = `
    <div class="music-note-display" id="musicNoteDisplay">
      <span class="music-note-anim">♫</span>
      <span>Playing</span>
    </div>
    <button class="music-play-btn" id="musicPlayBtn" title="Play Music">♩</button>
  `;
  document.body.appendChild(mc);
  document.getElementById('musicPlayBtn').addEventListener('click', toggleMusic);

  // Swipe hint
  const sh = document.createElement('div');
  sh.className = 'swipe-hint';
  sh.textContent = '← swipe →';
  document.body.appendChild(sh);

  // Photo frame injection into card 1
  const cvCard = document.querySelector('.cv-card');
  if (cvCard) {
    const lq1 = cvCard.querySelector('.cv-lq1');
    if (lq1) {
      const frameWrap = document.createElement('div');
      frameWrap.className = 'cv-photo-frame-wrap';
      frameWrap.innerHTML = `
        <div class="cv-photo-frame" onclick="triggerPhotoUpload()">
          <div class="cv-photo-frame-border"></div>
          <div class="cv-photo-frame-inner">
            <img src="" alt="Our Photo" />
            <div class="cv-photo-placeholder">
              <div class="ph-icon">📷</div>
              <p>Tap to add<br/>our photo</p>
            </div>
          </div>
          <div class="cv-photo-frame-corner tl"></div>
          <div class="cv-photo-frame-corner tr"></div>
          <div class="cv-photo-frame-corner bl"></div>
          <div class="cv-photo-frame-corner br"></div>
          <button class="cv-photo-upload-btn" onclick="event.stopPropagation();triggerPhotoUpload()">Upload Photo</button>
        </div>
      `;
      lq1.insertAdjacentElement('afterend', frameWrap);
    }
  }

  // Peacock feather & pen to letter
  const letterPaper = document.querySelector('.letter-paper');
  if (letterPaper) {
    const feather = document.createElement('div');
    feather.className = 'letter-feather';
    feather.textContent = '🪶';
    letterPaper.appendChild(feather);
    const pen = document.createElement('div');
    pen.className = 'letter-pen';
    pen.textContent = '✒️';
    letterPaper.appendChild(pen);
  }

  // Init music button UI
  updateMusicUI();
});

/* ══════════════════════════════════════════════════════════════
   PERFORMANCE: Use will-change cleanup
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  } else if (!document.hidden && audioCtx && audioCtx.state === 'suspended' && musicPlaying) {
    audioCtx.resume();
  }
});
