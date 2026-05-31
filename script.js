/* ============================================================
   FRIENDS MOBILE — script.js
   Features: Loader, Dark/Light, Nav, Scroll Reveal,
             Counters, Lightbox, Back to Top, Active Nav
   ============================================================ */

'use strict';

/* ── LOADER ───────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide after 2.2s (matches the CSS bar animation)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 2200);
  });
})();


/* ── DARK / LIGHT MODE ───────────────────────────────────── */
(function initTheme() {
  const html    = document.documentElement;
  const btn     = document.getElementById('themeToggle');
  const STORAGE = 'fm_theme';

  // Apply saved or preferred theme
  const saved = localStorage.getItem(STORAGE);
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
  }

  btn && btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE, next);
  });
})();


/* ── STICKY NAVBAR ───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ── HAMBURGER MENU ──────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
})();


/* ── ACTIVE NAV ON SCROLL ────────────────────────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], div[id]');

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ── SMOOTH SCROLLING ────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
})();


/* ── COUNTER ANIMATION ───────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── GALLERY LIGHTBOX ────────────────────────────────────── */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const caption  = document.getElementById('lightboxCaption');
  if (!lightbox) return;

  // Map gallery items to their emoji + caption
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const cap     = item.getAttribute('data-lightbox');
      const emoji   = item.querySelector('.gallery-placeholder span')?.textContent || '📷';
      const lbVisual = lightbox.querySelector('.lightbox-visual');

      if (lbVisual) lbVisual.textContent = emoji;
      if (caption)  caption.textContent  = cap;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ── BACK TO TOP ─────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── HERO REVEAL (initial load) ─────────────────────────── */
(function initHeroReveal() {
  // Give loading screen time to fade, then reveal hero elements
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.15 + 0.2}s`;
      el.classList.add('revealed');
    });
  }, 2400);
})();
