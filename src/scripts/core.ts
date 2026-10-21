import Lenis from 'lenis';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ---------- Smooth Scroll ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  const raf = (time: number) => {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// Andere Module (z. B. Lightbox) können das Smooth Scrolling pausieren
window.addEventListener('lenis:stop', () => lenis?.stop());
window.addEventListener('lenis:start', () => lenis?.start());

function scrollToTarget(target: Element | number) {
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { offset: typeof target === 'number' ? 0 : -72, duration: 1.4 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
}

// Anker-Links auf derselben Seite
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const target = url.hash === '#main' ? 0 : document.querySelector(decodeURIComponent(url.hash));
  if (target === null) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(target);
  history.replaceState(null, '', url.hash === '#main' ? location.pathname : url.hash);
});

// Hash beim Laden (z. B. Weiterleitung von /kontakt → /#kontakt)
if (location.hash && location.hash.length > 1) {
  const el = document.querySelector(decodeURIComponent(location.hash));
  if (el) setTimeout(() => el.scrollIntoView(), 50);
}

/* ---------- Mobile-Menü ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

function closeMenu() {
  if (!root.classList.contains('menu-open')) return;
  root.classList.remove('menu-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Menü öffnen');
  menu?.setAttribute('aria-hidden', 'true');
  lenis?.start();
}

menuBtn?.addEventListener('click', () => {
  const open = !root.classList.contains('menu-open');
  if (!open) return closeMenu();
  root.classList.add('menu-open');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Menü schließen');
  menu?.setAttribute('aria-hidden', 'false');
  lenis?.stop();
});

menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

/* ---------- Header-Zustand ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
let lastY = window.scrollY;
function onScrollHeader() {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 40);
  header?.classList.toggle('is-hidden', y > 400 && y > lastY + 2 && !root.classList.contains('menu-open'));
  if (y < lastY - 2) header?.classList.remove('is-hidden');
  lastY = y;
}
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* ---------- Boot & Hero ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  const delay = root.classList.contains('boot') ? 1700 : 80;
  setTimeout(() => {
    hero.classList.add('is-in');
    hero.querySelectorAll('.split-line').forEach((l) => l.classList.add('is-in'));
  }, delay);
  setTimeout(() => root.classList.remove('boot'), 2600);
}

/* ---------- Reveal beim Scrollen ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
);

export function observeReveals(scope: ParentNode = document) {
  scope.querySelectorAll('[data-reveal], [data-split]').forEach((el) => revealObserver.observe(el));
}
observeReveals();

/* ---------- Scroll-Spy für Navigation & Pegel ---------- */
const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');
const meter = document.querySelector<HTMLElement>('[data-meter]');
const meterFill = document.querySelector<HTMLElement>('[data-meter-fill]');
const meterChs = document.querySelectorAll<HTMLElement>('[data-meter-ch]');
const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]')).filter((s) =>
  document.querySelector(`[data-nav="${s.id}"]`),
);

function spy() {
  const mid = window.innerHeight * 0.4;
  let current = '';
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) current = s.id;
  }
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === current));
  meterChs.forEach((m) => m.classList.toggle('is-active', m.dataset.meterCh === current));
  if (meter) {
    meter.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (meterFill) meterFill.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }
}
if (sections.length) {
  window.addEventListener('scroll', spy, { passive: true });
  spy();
}

/* ---------- Wort-für-Wort-Highlight ---------- */
const scrubs = Array.from(document.querySelectorAll<HTMLElement>('[data-scrub]'));
if (scrubs.length) {
  const words = scrubs.map((el) => Array.from(el.querySelectorAll<HTMLElement>('.w')));
  const update = () => {
    scrubs.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(p * words[i].length);
      words[i].forEach((w, j) => w.classList.toggle('on', j < n));
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Spotlight-Karten ---------- */
document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- Magnetische Buttons ---------- */
if (finePointer) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 0.6s var(--ease-out)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 600);
    });
  });
}
