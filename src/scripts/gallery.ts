/** 3D-Druck-Reihe: Fortschrittsbalken beim Wischen und Lightbox. */
export function initGallery() {
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const bar = document.querySelector<HTMLElement>('[data-rail-bar]');

  if (rail && bar) {
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const visible = rail.clientWidth / rail.scrollWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      // Balken zeigt den sichtbaren Ausschnitt, wandert mit dem Wischen
      bar.style.transform = `scaleX(${Math.max(visible, p)})`;
    };
    rail.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(rail);
    update();
  }

  /* ---------- Lightbox ---------- */
  const dialog = document.querySelector<HTMLDialogElement>('[data-lb]');
  const img = document.querySelector<HTMLImageElement>('[data-lb-img]');
  const cap = document.querySelector<HTMLElement>('[data-lb-cap]');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox]'));
  if (!dialog || !img || !cap || !buttons.length) return;

  let index = 0;
  let opener: HTMLElement | null = null;
  const show = (i: number) => {
    index = (i + buttons.length) % buttons.length;
    const btn = buttons[index];
    const thumb = btn.querySelector('img');
    img.src = btn.dataset.full ?? thumb?.currentSrc ?? '';
    img.alt = thumb?.alt ?? '';
    cap.textContent = img.alt;
  };

  buttons.forEach((b, i) =>
    b.addEventListener('click', () => {
      opener = b;
      show(i);
      dialog.showModal();
    }),
  );
  dialog.addEventListener('close', () => opener?.focus());
  dialog.querySelector('[data-lb-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  let sx = 0;
  dialog.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  dialog.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });
}
