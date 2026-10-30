/**
 * Seitenweite Logik. Die Scroll-Mechanik selbst gehört der scrollcraft-Engine
 * (public/scrollcraft/scrollcraft.js, unverändert); hier wird sie nur gestartet.
 */

type ScrollCraftApi = { layout: () => void; read: () => void };
declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element | string, opts?: object) => ScrollCraftApi };
  }
}

const root = document.documentElement;

/* ---------- Engine ---------- */
const sc = window.ScrollCraft?.mount(document.body);

// Die Engine misst Kapitel nur beim Start und bei Fenstergrößen-Änderungen.
// Nachgeladener Inhalt (Video-Kacheln, Bilder) verschiebt alles darunter,
// deshalb hier neu vermessen, sobald sich die Seitenhöhe ändert.
if (sc) {
  let pending = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => sc.layout());
  }).observe(document.body);
}

/* ---------- Mobile-Menü ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');

function setMenu(open: boolean) {
  if (!menuBtn || !menu) return;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  if (menuLabel) menuLabel.textContent = open ? 'Menü schließen' : 'Menü öffnen';
}

menuBtn?.addEventListener('click', () => setMenu(menu?.hidden ?? false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) {
    setMenu(false);
    menuBtn?.focus();
  }
});
matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setMenu(false));

/* ---------- Aktives Kapitel in der Leiste ---------- */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));
const sections = navLinks
  .map((a) => document.getElementById(a.dataset.nav!))
  .filter((s): s is HTMLElement => !!s);

/* ---------- Nach-oben-Button ---------- */
const toTop = document.querySelector<HTMLElement>('[data-to-top]');
let lastY = window.scrollY;

function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;

  if (sections.length) {
    const line = vh * 0.35;
    let current = '';
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = s.id;
    }
    navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === current));
  }

  // Erscheint beim Hochscrollen, wenn man weit unten ist
  if (toTop) {
    if (y < vh * 1.5) toTop.classList.remove('is-visible');
    else if (y < lastY - 2) toTop.classList.add('is-visible');
    else if (y > lastY + 2) toTop.classList.remove('is-visible');
  }
  lastY = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// „Nach oben“ und der Sprunglink zum Inhalt springen an den Seitenanfang
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href="#main"]');
  if (!a) return;
  e.preventDefault();
  window.scrollTo({ top: 0 });
  history.replaceState(null, '', location.pathname);
  document.getElementById('main')?.focus({ preventScroll: true });
});

root.classList.add('is-ready');

export {};
