/* ============ CURSOR ============ */
const cursor    = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});

(function lagCursor() {
  cx += (mouseX - cx) * 0.14;
  cy += (mouseY - cy) * 0.14;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(lagCursor);
})();

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

document.querySelectorAll('a, button, .cartoon-card, .step-card, .social-bubble, .stat-bubble, .rm-card, .faq-q, .tracker-stat').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ============ PARTICLES ============ */
const EMOJIS = ['🍋','🍋','🍋','⭐','💛','🌟','✨','🍊'];
const pContainer = document.getElementById('particles');

function spawnParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (14 + Math.random() * 18) + 'px';
  const dur = 10 + Math.random() * 14;
  el.style.animationDuration  = dur + 's';
  el.style.animationDelay     = Math.random() * 3 + 's';
  pContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 5) * 1000);
}
for (let i = 0; i < 22; i++) setTimeout(spawnParticle, i * 400);
setInterval(spawnParticle, 2000);

/* ============ CONFIG — YOUR LAUNCH CHECKLIST ============
 *
 *  STEP 1 — The moment you create the coin on Pump.fun:
 *    Set CA to your Solana contract address.
 *    → Nav bar, CA bar, and all displays update automatically.
 *    → Market cap starts fetching from Pump.fun API automatically.
 *    → Fake simulation STOPS. Real numbers take over.
 *
 *  STEP 2 — Update your real numbers (check donate.gg + pump.fun):
 *    Set RAISED_USD to actual USD donated so far (from donate.gg page).
 *    Set HOLDERS   to actual holder count (visible on pump.fun coin page).
 *
 *  STEP 3 — After bonding curve completes (~$69K MC) and coin moves to Raydium:
 *    Find your pair address on dexscreener.com and set DEXSCREENER_PAIR.
 *    → Market cap then switches to DexScreener data (updates every 30s).
 *
 * ============================================================ */
const CONFIG = {
  CA:               'BwLqa4a7YiDZpM1KdhPFVpW4adEQ6LvTy9FsrRjMpump',
  GOAL:             50_000,

  RAISED_USD:       0,        // ← update from donate.gg dashboard
  HOLDERS:          0,        // ← update from pump.fun coin page

  DEXSCREENER_PAIR: 'DHChjqxfhsvDERxQd8dpu3p2fePBbrpVeKfZdLMrJ7dX',
};

/* ============ GLASS WAVE ============ */
const GOAL = CONFIG.GOAL;

// Pre-launch demo values (used only while CA === 'TBA')
const DEMO_RAISED   = 16_500;
const DEMO_HOLDERS  = 2_841;

const isLive = CONFIG.CA !== 'TBA';

let raised  = isLive ? CONFIG.RAISED_USD  : DEMO_RAISED;
let holders = isLive ? CONFIG.HOLDERS     : DEMO_HOLDERS;
let pct     = (raised / GOAL) * 100;

const wavePath  = document.getElementById('wavePath');
const pctSvgEl  = document.getElementById('pctSvg');
const pctBigEl  = document.getElementById('pctBig');
const raisedEl  = document.getElementById('raised');
const holdersEl = document.getElementById('holders');
const liquidBar = document.getElementById('liquidBar');
const fillPct   = document.getElementById('fillPct');
const mcEl      = document.getElementById('market-cap');

const GW = 220, GT = 46, GH = 220;

function getWaveY(p) { return GT + GH - (p / 100) * GH; }

function buildWave(p, off) {
  const y = getWaveY(p);
  let d = `M 0 ${y}`;
  for (let x = 0; x <= GW; x += 4) {
    const wy = y
      + Math.sin((x + off) * 0.04) * 5
      + Math.sin((x + off * 1.3) * 0.065) * 2.5;
    d += ` L ${x} ${wy}`;
  }
  return d + ` L ${GW} ${GT + GH} L 0 ${GT + GH} Z`;
}

let wOff = 0;
(function animateWave() {
  wOff += 1.1;
  if (wavePath) wavePath.setAttribute('d', buildWave(pct, wOff));
  requestAnimationFrame(animateWave);
})();

function formatMoney(n) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n;
}

function updateAll() {
  const p = Math.min(100, Math.max(0, pct));
  if (pctSvgEl)  pctSvgEl.textContent = Math.round(p) + '%';
  if (pctBigEl)  pctBigEl.textContent = Math.round(p) + '%';
  if (liquidBar) liquidBar.style.height = p + '%';
  if (fillPct)   fillPct.textContent = Math.round(p) + '%';
}
updateAll();

// Render real starting numbers immediately
if (raisedEl)  raisedEl.textContent  = formatMoney(raised);
if (holdersEl) holdersEl.textContent = holders > 0 ? holders.toLocaleString() : '—';

// Demo simulation — ONLY runs before launch (CA === 'TBA')
if (!isLive) {
  setInterval(() => {
    raised  += Math.floor(Math.random() * 80 + 20);
    holders += Math.floor(Math.random() * 5 + 1);
    pct = (raised / GOAL) * 100;
    updateAll();
    if (raisedEl)  raisedEl.textContent  = formatMoney(raised);
    if (holdersEl) holdersEl.textContent = holders.toLocaleString();
  }, 3500);
}

/* ============ BUBBLES ============ */
function spawnBubble() {
  const bg = document.getElementById('bubbles');
  if (!bg) return;
  const x = 25 + Math.random() * 170;
  const r = 1.5 + Math.random() * 4;
  const sy = GT + GH - 10;
  const ey = getWaveY(pct) + 5;
  const dur = 1.5 + Math.random() * 2;
  const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx', x); c.setAttribute('cy', sy);
  c.setAttribute('r', r);  c.setAttribute('fill','rgba(255,255,255,0.5)');
  bg.appendChild(c);
  c.animate(
    [{ transform:'translateY(0)', opacity:0.6 },
     { transform:`translateY(-${sy - ey}px)`, opacity:0 }],
    { duration: dur * 1000, easing:'ease-out', fill:'forwards' }
  ).onfinish = () => c.remove();
}
setInterval(spawnBubble, 480);

/* ============ CA COPY ============ */
function copyCA() {
  if (CONFIG.CA === 'TBA') {
    showToast('🍋 CA not live yet — launching soon!');
    return;
  }
  navigator.clipboard.writeText(CONFIG.CA)
    .then(() => {
      showToast('✓ Contract address copied!');
      const btnText = document.getElementById('ca-btn-text');
      const navText = document.getElementById('nav-ca-text');
      if (btnText) { btnText.textContent = 'Copied! ✓'; setTimeout(() => { btnText.textContent = 'Copy CA'; }, 2500); }
      if (navText) { navText.textContent = 'Copied! ✓'; setTimeout(() => { navText.textContent = '📋 CA: ' + CONFIG.CA.slice(0,6) + '...' + CONFIG.CA.slice(-4); }, 2500); }
    })
    .catch(() => showToast('🍋 Launching soon — stay tuned!'));
}

/* ============ LIVE MARKET DATA ============ */
// Fetches real market cap — two sources depending on stage:
//   Phase 1 (bonding curve):  Pump.fun API  → activated by CONFIG.CA
//   Phase 2 (post-Raydium):   DexScreener   → activated by CONFIG.DEXSCREENER_PAIR
//   DexScreener always wins if both are set (more accurate after graduation).
async function fetchLiveData() {
  if (!isLive) return; // no live data before CA is set

  // === Phase 1: Pump.fun API (bonding curve — free, no key) ===
  try {
    const res  = await fetch(`https://frontend-api.pump.fun/coins/${CONFIG.CA}`);
    const coin = await res.json();
    const usdMc = parseFloat(coin?.usd_market_cap || 0);
    if (usdMc > 0 && mcEl) mcEl.textContent = formatMoney(usdMc);
  } catch (_) { /* Pump.fun unreachable — keep current value */ }

  // === Phase 2: DexScreener (after bonding curve — overrides Pump.fun) ===
  if (CONFIG.DEXSCREENER_PAIR) {
    try {
      const res  = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${CONFIG.DEXSCREENER_PAIR}`);
      const data = await res.json();
      const pair = data?.pairs?.[0];
      const fdv  = parseFloat(pair?.fdv || 0);
      if (fdv > 0 && mcEl) mcEl.textContent = formatMoney(fdv);
    } catch (_) { /* keep current value */ }
  }
}

// Auto-update nav CA pill + CA bar when CONFIG.CA is set
(function initCA() {
  const navText  = document.getElementById('nav-ca-text');
  const caDisp   = document.getElementById('ca-display');
  if (isLive) {
    if (navText) navText.textContent = '📋 CA: ' + CONFIG.CA.slice(0,6) + '...' + CONFIG.CA.slice(-4);
    if (caDisp)  caDisp.textContent  = CONFIG.CA;
  }
})();

fetchLiveData();
// Poll every 30s while live
if (isLive) setInterval(fetchLiveData, 30_000);

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============ SCROLL REVEAL ============ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ============ COUNTER ANIMATION ============ */
function animateCount(el, target, prefix='', suffix='') {
  if (!el) return;
  const dur = 2200;
  const t0  = performance.now();
  (function tick(now) {
    const prog  = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
    if (prog < 1) requestAnimationFrame(tick);
  })(t0);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateCount(document.getElementById('c-raised'),  16500, '$');
      animateCount(document.getElementById('c-holders'), 2841);
      animateCount(document.getElementById('c-goal'),    50000, '$');
      animateCount(document.getElementById('c-pct'),     33, '', '%');
    }
  }, { threshold: 0.3 }).observe(statsSection);
}

/* ============ NAV SCROLL + STICKY BUY + SCROLL TOP ============ */
const nav        = document.getElementById('nav');
const stickyBuy  = document.getElementById('stickyBuy');
const scrollTop  = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);

  // Sticky buy bar: show after 80vh, hide near footer
  const heroH  = window.innerHeight * 0.8;
  const footerTop = document.querySelector('footer')?.offsetTop ?? Infinity;
  const nearFooter = y + window.innerHeight > footerTop - 80;
  if (stickyBuy) {
    stickyBuy.classList.toggle('visible', y > heroH && !nearFooter);
    stickyBuy.setAttribute('aria-hidden', String(!(y > heroH && !nearFooter)));
  }

  // Scroll-to-top button
  if (scrollTop) {
    scrollTop.classList.toggle('visible', y > 600);
  }
}, { passive: true });

/* ============ MOBILE MENU ============ */
function toggleMenu() {
  const menu  = document.getElementById('mobileMenu');
  const ham   = document.getElementById('hamburger');
  const open  = menu.classList.toggle('open');
  ham.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

/* ============ FAQ ACCORDION ============ */
function toggleFaq(btn) {
  const answer   = btn.nextElementSibling;
  const expanded = btn.getAttribute('aria-expanded') === 'true';

  // Close all others
  document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(q => {
    if (q !== btn) {
      q.setAttribute('aria-expanded', 'false');
      q.nextElementSibling.hidden = true;
    }
  });

  btn.setAttribute('aria-expanded', String(!expanded));
  answer.hidden = expanded;
}

/* ============ WOBBLE CARDS on hover ============ */
document.querySelectorAll('.cartoon-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const tiltX = (e.clientX - rect.left) / rect.width - 0.5;
    card.style.transform = `translate(-3px,-3px) rotate(${tiltX * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
