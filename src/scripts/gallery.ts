/** Horizontal gepinnte 3D-Druck-Galerie + Lightbox. */
export function initGallery() {
  const hgal = document.querySelector<HTMLElement>('[data-hgal]');
  const track = document.querySelector<HTMLElement>('[data-hgal-track]');
  if (!hgal || !track) return;

  const pinQuery = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
  let pinned = false;
  let distance = 0;

  function measure() {
    pinned = pinQuery.matches;
    hgal!.classList.toggle('is-pinned', pinned);
    if (!pinned) {
      hgal!.style.height = '';
      track!.style.transform = '';
      return;
    }
    distance = Math.max(0, track!.scrollWidth - window.innerWidth);
    hgal!.style.height = `${window.innerHeight + distance}px`;
    update();
  }

  function update() {
    if (!pinned) return;
    const r = hgal!.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    track!.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure);
  pinQuery.addEventListener('change', measure);
  new ResizeObserver(measure).observe(track);
  measure();

  /* ---------- Lightbox ---------- */
  const dialog = document.querySelector<HTMLDialogElement>('[data-lb]');
  const img = document.querySelector<HTMLImageElement>('[data-lb-img]');
  const cap = document.querySelector<HTMLElement>('[data-lb-cap]');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox]'));
  if (!dialog || !img || !cap || !buttons.length) return;

  let index = 0;
  const show = (i: number) => {
    index = (i + buttons.length) % buttons.length;
    const btn = buttons[index];
    const thumb = btn.querySelector('img');
    img.src = btn.dataset.full ?? thumb?.currentSrc ?? '';
    img.alt = thumb?.alt ?? '';
    cap.textContent = `${String(index + 1).padStart(2, '0')} / ${String(buttons.length).padStart(2, '0')} — ${img.alt}`;
  };

  buttons.forEach((b, i) =>
    b.addEventListener('click', () => {
      show(i);
      dialog.showModal();
      window.dispatchEvent(new Event('lenis:stop'));
    }),
  );
  dialog.addEventListener('close', () => window.dispatchEvent(new Event('lenis:start')));
  dialog.querySelector('[data-lb-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Wischen auf Touch-Geräten
  let sx = 0;
  dialog.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  dialog.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });
}
