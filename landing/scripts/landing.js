/* ============================================================
   LANDING.JS — Shared interactions for all landing pages
   ============================================================ */

// ── Nav scroll effect ────────────────────────────────────────
const nav = document.getElementById('topnav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Scroll reveal animations ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── Animated counters ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Animated chat bubbles in hero ────────────────────────────
function runChatAnimation() {
  const chat = document.querySelector('.phone-chat');
  if (!chat) return;
  const bubbles = chat.querySelectorAll('.chat-bubble');
  bubbles.forEach(b => { b.style.opacity = '0'; b.style.transform = 'scale(.85) translateY(6px)'; });
  bubbles.forEach((b, i) => {
    setTimeout(() => {
      b.style.transition = 'opacity 400ms ease, transform 400ms cubic-bezier(.34,1.56,.64,1)';
      b.style.opacity = '1';
      b.style.transform = 'scale(1) translateY(0)';
    }, 600 + i * 600);
  });
}

if (document.querySelector('.phone-chat')) {
  runChatAnimation();
  setInterval(runChatAnimation, 7000);
}

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Pricing toggle ────────────────────────────────────────────
const pricingToggle = document.getElementById('pricing-toggle');
const monthlyPrices = { starter: '$149', growth: '$399', enterprise: 'Custom' };
const annualPrices  = { starter: '$119', growth: '$319', enterprise: 'Custom' };

if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const annual = pricingToggle.checked;
    const prices = annual ? annualPrices : monthlyPrices;
    const label = document.getElementById('billing-label');
    if (label) label.textContent = annual ? 'Annual billing' : 'Monthly billing';

    document.querySelectorAll('[data-tier]').forEach(el => {
      const tier = el.dataset.tier;
      if (prices[tier]) el.textContent = prices[tier];
    });

    const savingsBadge = document.getElementById('savings-badge');
    if (savingsBadge) savingsBadge.style.display = annual ? 'inline-block' : 'none';
  });
}

// ── Audience tabs ─────────────────────────────────────────────
document.querySelectorAll('.audience-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.audience-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.audience-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.panel);
    if (panel) panel.classList.add('active');
  });
});

// ── Demo form submission ──────────────────────────────────────
const demoForm = document.getElementById('demo-form');
if (demoForm) {
  demoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = demoForm.querySelector('button[type="submit"]');
    const successEl = document.getElementById('form-success');
    btn.textContent = 'Submitting…'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Submitted ✓';
      btn.style.background = '#dcfce7'; btn.style.color = '#15803d';
      if (successEl) successEl.classList.add('show');
      demoForm.style.opacity = '.5'; demoForm.style.pointerEvents = 'none';
    }, 1200);
  });
}

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Progress bar animation on scroll ─────────────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fills = e.target.querySelectorAll('.mock-progress-fill');
      fills.forEach((f, i) => {
        const target = f.dataset.width || '70%';
        f.style.width = '0%';
        setTimeout(() => {
          f.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
          f.style.width = target;
        }, i * 150 + 200);
      });
      progressObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.bento-visual').forEach(el => progressObserver.observe(el));
