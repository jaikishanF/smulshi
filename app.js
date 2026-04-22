'use strict';

// ── Loader ──────────────────────────────────────────────────────────────────
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('loaded');
    document.body.style.overflow = '';
    // Kick off post-load animations
    initSplitText();
    initClipReveals();
    initStaggerGrids();
    initImgWipes();
    initScrollDividers();
  }, 2200);
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. SPLIT-TEXT WORD REVEAL
//    Targets every .section-title and .preview-body h2 outside the hero.
//    Splits text into per-word spans that animate up on scroll.
// ═══════════════════════════════════════════════════════════════════════════
function initSplitText() {
  const targets = document.querySelectorAll(
    '.section-title:not(.hero *), .preview-body h2, .catering-style-body h3, .boot-card-body h3, .overons-hero-text .section-title, .job-header h3'
  );

  targets.forEach(el => {
    const html = el.innerHTML;
    // Skip if already split
    if (el.dataset.split) return;
    el.dataset.split = '1';

    // Preserve <em> / <br> — split line by line
    const lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line => {
      // Split words, keeping <em> tags intact
      const words = line.trim().split(/\s+/);
      const wrapped = words.map((w, i) => {
        const delay = (i * 0.07).toFixed(2);
        return `<span class="split-word" style="transition-delay:${delay}s">${w}</span>`;
      }).join(' ');
      return `<span class="split-line">${wrapped}</span>`;
    }).join('');
  });

  const splitObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.split-word').forEach(w => w.classList.add('word-visible'));
      splitObs.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => splitObs.observe(el));
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. CLIP-PATH IMAGE REVEAL
//    Large hero/section images sweep in from the bottom edge.
// ═══════════════════════════════════════════════════════════════════════════
function initClipReveals() {
  const imgs = document.querySelectorAll(
    '.catering-hero-img img, .contact-header-img img, .boot-card-img img, .team-img img, .overons-intro-img img, .verhaal-img img, .preview-img-wrap img'
  );
  imgs.forEach(img => img.classList.add('clip-reveal'));

  const clipObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      // Slight delay so the wrapper also animates
      setTimeout(() => e.target.classList.add('clip-visible'), 80);
      clipObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  imgs.forEach(img => clipObs.observe(img));
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. STAGGER GRID CHILDREN
//    Automatically staggers direct children of the major grid containers.
// ═══════════════════════════════════════════════════════════════════════════
function initStaggerGrids() {
  const grids = document.querySelectorAll(
    '.previews-grid, .catering-styles-grid, .boot-props, .team-grid, .locations-grid, .pickup-list, .contact-details, .footer-col, .moments-chips, .job-body'
  );
  grids.forEach(g => g.classList.add('stagger-children'));

  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('stagger-visible');
      staggerObs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  grids.forEach(g => staggerObs.observe(g));
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. IMAGE WIPE (colour overlay slides away)
//    Wraps key standalone images so a dark panel wipes off on scroll.
// ═══════════════════════════════════════════════════════════════════════════
function initImgWipes() {
  const targets = document.querySelectorAll(
    '.cimg, .catering-gallery img'
  );
  targets.forEach(img => {
    const wrap = img.parentElement;
    if (!wrap.classList.contains('img-wipe-wrapper')) {
      wrap.classList.add('img-wipe-wrapper');
    }
  });

  const wipeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('wipe-done'), 100);
      wipeObs.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.img-wipe-wrapper').forEach(w => wipeObs.observe(w));
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SCROLL DIVIDERS (decorative gold lines that draw across)
// ═══════════════════════════════════════════════════════════════════════════
function initScrollDividers() {
  // Insert dividers between major sections
  const dividerTargets = [
    '.home-previews', '.bestel-section', '.catering-section',
    '.boot-section', '.overons-section', '.contact-section'
  ];
  dividerTargets.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'scroll-divider';
    el.prepend(div);
  });

  const divObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('div-visible');
      divObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.scroll-divider').forEach(d => divObs.observe(d));
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. BLUR-UP reveals for card-level text blocks (section descriptions)
// ═══════════════════════════════════════════════════════════════════════════
(function initBlurUp() {
  const blurTargets = document.querySelectorAll(
    '.section-sub, .about-desc, .catering-style-body p, .boot-desc, .verhaal-text p, .overons-block p, .job-quote'
  );
  blurTargets.forEach(el => el.classList.add('blur-up'));

  const blurObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('blur-visible');
      blurObs.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  blurTargets.forEach(el => blurObs.observe(el));
})();

// ═══════════════════════════════════════════════════════════════════════════
// 7. SCALE REVEAL for cards that aren't covered by other anims
// ═══════════════════════════════════════════════════════════════════════════
(function initScaleReveal() {
  const scaleTargets = document.querySelectorAll(
    '.bestel-step, .boot-prop, .pillar, .faq-section, .contact-form, .location-item'
  );
  scaleTargets.forEach(el => el.classList.add('scale-reveal'));

  const scaleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('scale-visible');
      scaleObs.unobserve(e.target);
    });
  }, { threshold: 0.15 });

  scaleTargets.forEach(el => scaleObs.observe(el));
})();

// ═══════════════════════════════════════════════════════════════════════════
// 8. LINE DRAW on section eyebrows
// ═══════════════════════════════════════════════════════════════════════════
(function initLineDraws() {
  document.querySelectorAll('.section-eyebrow').forEach(el => el.classList.add('line-draw'));

  const lineObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('line-visible');
      lineObs.unobserve(e.target);
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.line-draw').forEach(el => lineObs.observe(el));
})();

// ═══════════════════════════════════════════════════════════════════════════
// 9. SECTION SHIMMER sweep (one-time gold shimmer when section enters view)
// ═══════════════════════════════════════════════════════════════════════════
(function initShimmer() {
  const shimmers = document.querySelectorAll(
    '.bestel-section, .boot-section, .overons-section, .vacatures-section'
  );
  shimmers.forEach(s => s.classList.add('section-shimmer'));

  const shimObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('shimmer-visible');
      shimObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  shimmers.forEach(s => shimObs.observe(s));
})();

// ═══════════════════════════════════════════════════════════════════════════
// 10. SCROLL-VELOCITY SKEW
//     Calculates scroll speed each frame and tilts the page content slightly.
// ═══════════════════════════════════════════════════════════════════════════
(function initScrollSkew() {
  if (window.innerWidth <= 768) return;
  let lastY = 0, skew = 0;
  const main = document.querySelector('body');

  function updateSkew() {
    const diff  = window.scrollY - lastY;
    lastY = window.scrollY;
    // Ease toward target skew, max ±3deg
    const target = Math.max(-3, Math.min(3, diff * 0.08));
    skew += (target - skew) * 0.12;
    if (Math.abs(skew) > 0.01) {
      main.style.setProperty('--skew-val', `${skew.toFixed(3)}deg`);
      // Apply to inner content wrappers only
      document.querySelectorAll('.previews-grid, .catering-styles-grid, .boot-cards, .jobs-grid').forEach(el => {
        el.style.transform = `skewY(${(skew * 0.4).toFixed(3)}deg)`;
      });
    }
    requestAnimationFrame(updateSkew);
  }
  requestAnimationFrame(updateSkew);
})();

// ═══════════════════════════════════════════════════════════════════════════
// 11. PARALLAX IMAGES (images move at 40% of scroll speed)
//     Applied to section background images and stacked images.
// ═══════════════════════════════════════════════════════════════════════════
(function initParallax() {
  if (window.innerWidth <= 768) return;

  const parallaxMap = [
    { selector: '.hero-bg-img',               rate: 0.35 },
    { selector: '.catering-hero-img img',     rate: 0.3  },
    { selector: '.contact-header-img img',    rate: 0.3  },
    { selector: '.cimg-top',                  rate: 0.18 },
    { selector: '.cimg-bot',                  rate: -0.12 },
    { selector: '.verhaal-img img',           rate: 0.2  },
    { selector: '.overons-intro-img img',     rate: 0.15 },
  ];

  // Cache rects once, re-compute on resize
  let items = [];
  function buildItems() {
    items = [];
    parallaxMap.forEach(({ selector, rate }) => {
      document.querySelectorAll(selector).forEach(el => {
        items.push({ el, rate });
      });
    });
  }
  buildItems();
  window.addEventListener('resize', buildItems, { passive: true });

  function applyParallax() {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    items.forEach(({ el, rate }) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) * rate;
      el.style.transform = `translateY(${offset.toFixed(2)}px) scale(1.08)`;
    });
  }

  window.addEventListener('scroll', applyParallax, { passive: true });
  applyParallax();
})();

// ═══════════════════════════════════════════════════════════════════════════
// EXISTING FEATURES (preserved)
// ═══════════════════════════════════════════════════════════════════════════

// ── Custom Cursor ────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function tick() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,.preview-card,.boot-card,.team-card,.job-card,.catering-style-card,.moments-chips span').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── Scroll Progress ──────────────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ── Navbar ───────────────────────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const mobileM = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = mobileM.classList.toggle('open');
  const [s1, s2, s3] = burger.querySelectorAll('span');
  s1.style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
  s2.style.opacity   = open ? '0' : '';
  s3.style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileM.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Smooth anchor scroll ─────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight, behavior: 'smooth' });
  });
});

// ── Particles ────────────────────────────────────────────────────────────────
const pc = document.getElementById('particles');
if (pc) {
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;animation-duration:${9+Math.random()*13}s;animation-delay:${Math.random()*10}s`;
    pc.appendChild(p);
  }
}

// ── Basic reveal (non-hero) ───────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => {
  if (!el.closest('.hero')) revealObs.observe(el);
});

// ── Counter animation ─────────────────────────────────────────────────────────
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target;
    const end = parseInt(el.dataset.target);
    el.classList.add('counting');
    let n = 0;
    const step = end / (1600 / 16);
    const t = setInterval(() => {
      n = Math.min(n + step, end);
      el.textContent = Math.floor(n);
      if (n >= end) { clearInterval(t); el.classList.remove('counting'); }
    }, 16);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-number').forEach(el => counterObs.observe(el));

// ── Parallax rings + hero fade ───────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.ring').forEach((r, i) => {
    r.style.transform = `translateY(${sy * (0.04 + i * 0.025)}px)`;
  });
  const hc = document.querySelector('.hero-content');
  if (hc && sy < window.innerHeight) {
    hc.style.transform = `translateY(${sy * 0.12}px)`;
    hc.style.opacity   = Math.max(0, 1 - sy / (window.innerHeight * 0.8));
  }
}, { passive: true });

// ── Active nav highlighting ───────────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
    });
  });
}, { threshold: 0.35 });
document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

// ── FAQ accordion ────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Contact form ─────────────────────────────────────────────────────────────
const cf = document.getElementById('contactForm');
if (cf) {
  cf.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cf.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Verstuurd! ✓';
    btn.style.background = '#4caf50';
    cf.querySelectorAll('input,textarea,select').forEach(f => f.value = '');
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3500);
  });
}

// ── Vacatures apply ───────────────────────────────────────────────────────────
const solWrap   = document.getElementById('sollicitatieWrap');
const solTitle  = document.getElementById('sollicitatieTitle');
const solForm   = document.getElementById('sollicitatieForm');
const cancelBtn = document.getElementById('cancelSolBtn');

document.querySelectorAll('.job-apply-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const job = btn.dataset.job;
    solTitle.textContent = 'Solliciteer als: ' + job;
    solWrap.style.display = 'block';
    solWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
cancelBtn?.addEventListener('click', () => { solWrap.style.display = 'none'; });
solForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = solForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sollicitatie verstuurd! ✓';
  btn.style.background = '#4caf50';
  setTimeout(() => { solWrap.style.display = 'none'; btn.textContent = 'Verstuur sollicitatie'; btn.style.background = ''; }, 3000);
});

// ── Magnetic buttons ─────────────────────────────────────────────────────────
document.querySelectorAll('.btn-primary,.nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const r = this.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    this.style.transform = `translate(${x*.1}px,${y*.18}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', function() { this.style.transform = ''; });
});

// ── Gallery z-index hover ─────────────────────────────────────────────────────
document.querySelectorAll('.catering-gallery img').forEach(img => {
  img.addEventListener('mouseenter', function() { this.style.zIndex = '2'; });
  img.addEventListener('mouseleave', function() { this.style.zIndex = ''; });
});
