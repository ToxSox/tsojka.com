/**
 * Hero: REW-artiges Messdiagramm (20 Hz bis 20 kHz, ±dB) auf zwei Ebenen.
 *   hinten  [data-eq-back]   Raster, Rohmessungen, Zielkurve
 *   vorn    [data-eq-front]  Ergebniskurve und Band-Marker (läuft vor Thomas)
 * Der Pointer ist ein parametrisches EQ-Band: x = Frequenz, y = Gain.
 * Die Einstellung wird als window.__tsaEq bereitgestellt und per „eq:change“
 * gemeldet; das Messprotokoll im Testlabor misst genau diese Kurve.
 */

import { bell, fmtF, fmtG, F_MIN, DECADES, Q_DEFAULT, setEq, getEq, targetCurve } from './eq-model';

const POINTS = 220;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Peak = { lf: number; g: number; w: number };

function makeRoom(seed: number): Peak[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: 9 }, () => ({
    lf: Math.log10(40) + rnd() * (Math.log10(14000) - Math.log10(40)),
    g: (rnd() - 0.5) * 16,
    w: 0.04 + rnd() * 0.12,
  }));
}

export function initEq() {
  const back = document.querySelector<HTMLCanvasElement>('[data-eq-back]');
  const front = document.querySelector<HTMLCanvasElement>('[data-eq-front]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!back || !front || !hero) return;
  const bctx = back.getContext('2d');
  const fctx = front.getContext('2d');
  if (!bctx || !fctx) return;

  const roF = document.querySelector<HTMLElement>('[data-ro-f]');
  const roG = document.querySelector<HTMLElement>('[data-ro-g]');
  const hint = document.querySelector<HTMLElement>('[data-ro-hint]');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const idleHint = matchMedia('(any-hover: hover)').matches ? 'Maus bewegen' : 'Tippen';
  if (hint) hint.textContent = idleHint;

  const rooms = [makeRoom(7), makeRoom(23), makeRoom(91)];
  let w = 0;
  let h = 0;
  let visible = true;
  let raf = 0;
  let t = 0;
  let last = performance.now();

  const start = getEq();
  const band = { lf: start.lf, g: start.g, tlf: start.lf, tg: start.g };
  let userActive = false;

  const mobile = () => w < 860;
  const xOf = (lf: number) => ((lf - Math.log10(F_MIN)) / DECADES) * w;
  const lfOfX = (x: number) => Math.log10(F_MIN) + (x / w) * DECADES;
  // Kurvenmitte: auf dem Desktop auf Brusthöhe von Thomas, mobil zwischen Text und Kopf
  const cy = () => h * (mobile() ? 0.62 : 0.7);
  const scale = () => Math.min(h * (mobile() ? 0.007 : 0.009), 8);
  const yOf = (db: number) => cy() - db * scale();

  function size(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return r;
  }

  function resize() {
    const r = size(back!, bctx!);
    size(front!, fctx!);
    w = r.width;
    h = r.height;
    draw();
  }

  function roomAt(room: Peak[], lf: number, phase: number) {
    let v = 0;
    for (const p of room) v += bell(lf, p.lf, p.g, p.w);
    v += 1.4 * Math.sin(lf * 23 + phase) + 0.8 * Math.sin(lf * 51 - phase * 1.3);
    const f = 10 ** lf;
    v -= 10 / (1 + (f / 28) ** 2) ** 2;
    v -= 84 * Math.max(0, Math.log10(f / 15000));
    return v;
  }

  function path(c: CanvasRenderingContext2D, fn: (lf: number) => number) {
    c.beginPath();
    for (let i = 0; i <= POINTS; i++) {
      const lf = Math.log10(F_MIN) + (i / POINTS) * DECADES;
      const x = xOf(lf);
      const y = yOf(fn(lf));
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
  }

  const result = (lf: number) =>
    targetCurve(10 ** lf) + bell(lf, band.lf, band.g, 0.16) + 0.5 * Math.sin(lf * 17 + t * 0.8) * Math.min(1, 10 ** lf / 200);

  function drawBack() {
    const c = bctx!;
    c.clearRect(0, 0, w, h);
    c.lineWidth = 1;
    c.font = '500 10px "Geist Mono Variable", ui-monospace, monospace';
    c.textBaseline = 'top';

    // Raster: Dekaden kräftiger, Zwischenwerte zart
    for (let d = 0; d < 3; d++) {
      for (let m = 2; m < 10; m++) {
        const f = 20 * 10 ** d * (m / 2);
        const x = Math.round(xOf(Math.log10(f))) + 0.5;
        c.strokeStyle = 'rgba(245,245,247,0.035)';
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
    }
    const marks = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
    for (const f of marks) {
      const x = Math.round(xOf(Math.log10(f))) + 0.5;
      c.strokeStyle = 'rgba(245,245,247,0.07)';
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
      c.fillStyle = 'rgba(245,245,247,0.3)';
      c.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, x + 5, yOf(-18) + 8);
    }
    for (let db = -18; db <= 18; db += 6) {
      const y = Math.round(yOf(db)) + 0.5;
      c.strokeStyle = db === 0 ? 'rgba(245,245,247,0.14)' : 'rgba(245,245,247,0.05)';
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }

    rooms.forEach((room, i) => {
      path(c, (lf) => roomAt(room, lf, t * (0.35 + i * 0.15) + i * 2) + targetCurve(10 ** lf) - 2);
      c.strokeStyle = `rgba(245,245,247,${0.09 + i * 0.035})`;
      c.stroke();
    });

    c.setLineDash([4, 6]);
    path(c, (lf) => targetCurve(10 ** lf));
    c.strokeStyle = 'rgba(245,245,247,0.32)';
    c.stroke();
    c.setLineDash([]);
  }

  function drawFront() {
    const c = fctx!;
    c.clearRect(0, 0, w, h);

    // Fläche zwischen Ziel und Ergebnis
    c.beginPath();
    for (let i = 0; i <= POINTS; i++) {
      const lf = Math.log10(F_MIN) + (i / POINTS) * DECADES;
      const x = xOf(lf);
      if (i === 0) c.moveTo(x, yOf(result(lf)));
      else c.lineTo(x, yOf(result(lf)));
    }
    for (let i = POINTS; i >= 0; i--) {
      const lf = Math.log10(F_MIN) + (i / POINTS) * DECADES;
      c.lineTo(xOf(lf), yOf(targetCurve(10 ** lf)));
    }
    c.closePath();
    c.fillStyle = 'rgba(255,90,31,0.12)';
    c.fill();

    path(c, result);
    c.strokeStyle = '#ff5a1f';
    c.lineWidth = 2.5;
    c.lineJoin = 'round';
    c.stroke();

    const bx = xOf(band.lf);
    const by = yOf(result(band.lf));
    c.setLineDash([2, 5]);
    c.strokeStyle = 'rgba(255,90,31,0.5)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(bx, by + 14);
    c.lineTo(bx, h);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = '#0a0a0b';
    c.strokeStyle = '#ff5a1f';
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(bx, by, 7, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }

  function draw() {
    drawBack();
    drawFront();
    if (roF) roF.textContent = fmtF(10 ** band.lf);
    if (roG) roG.textContent = fmtG(band.g);
  }

  let lastSent = 0;
  function publish(user: boolean) {
    const now = performance.now();
    if (now - lastSent < 80) return;
    lastSent = now;
    setEq({ lf: band.lf, g: band.g, q: Q_DEFAULT, user });
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (!userActive && !reduced()) {
      // Demo: das Band wandert ruhig über das Spektrum
      band.tlf = Math.log10(1000) + Math.sin(t * 0.23) * 1.1;
      band.tg = Math.sin(t * 0.61) * 9;
    }
    const k = 1 - Math.pow(0.0015, dt);
    band.lf += (band.tlf - band.lf) * k;
    band.g += (band.tg - band.g) * k;
    draw();
    publish(getEq().user);
    raf = visible ? requestAnimationFrame(tick) : 0;
  }

  function run() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function setFromPointer(e: PointerEvent) {
    const rect = front!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
    band.tlf = Math.min(Math.log10(18000), Math.max(Math.log10(25), lfOfX(x)));
    band.tg = Math.max(-12, Math.min(12, (cy() - y) / scale()));
    // Nach der ersten echten Eingabe bleibt das Band beim Besucher, die Demo endet
    userActive = true;
    setEq({ lf: band.tlf, g: band.tg, q: Q_DEFAULT, user: true });
    if (hint) hint.textContent = 'eingestellt';
  }

  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || e.buttons) setFromPointer(e);
  });
  hero.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a, button')) return;
    setFromPointer(e);
  });

  new ResizeObserver(resize).observe(back);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) run();
  }).observe(hero);

  resize();
  run();
}
