/**
 * Hero-Hintergrund: ein REW-artiges Messdiagramm (20 Hz – 20 kHz, ±dB).
 * Der Mauszeiger ist ein parametrischer EQ-Band: x = Frequenz, y = Gain.
 */

const F_MIN = 20;
const F_MAX = 20000;
const DECADES = Math.log10(F_MAX / F_MIN);
const POINTS = 220;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/** Glockenkurve im log-Frequenzbereich (Näherung eines Peaking-Filters). */
const bell = (lf: number, lf0: number, gain: number, width: number) =>
  gain * Math.exp(-((lf - lf0) ** 2) / (2 * width * width));

/** Zielkurve: Bass-Anhebung + leichter Abfall in den Höhen. */
const target = (f: number) => 7 / (1 + (f / 90) ** 2) - 2.2 * Math.max(0, Math.log10(f / 1000));

function makeRoom(seed: number): Peak[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: 9 }, () => ({
    lf: Math.log10(40) + rnd() * (Math.log10(14000) - Math.log10(40)),
    g: (rnd() - 0.5) * 16,
    w: 0.04 + rnd() * 0.12,
  }));
}

const fmtF = (f: number) => (f >= 1000 ? `${(f / 1000).toFixed(f >= 10000 ? 1 : 2)} kHz` : `${Math.round(f)} Hz`);
const fmtG = (g: number) => `${g >= 0 ? '+' : '−'}${Math.abs(g).toFixed(1)} dB`;

export function initEq() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-eq]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const roF = document.querySelector<HTMLElement>('[data-ro-f]');
  const roG = document.querySelector<HTMLElement>('[data-ro-g]');
  const hint = document.querySelector<HTMLElement>('.readout-hint');
  // Auf Touch-Geräten gibt es keine Maus
  const idleHint = matchMedia('(any-hover: hover)').matches ? 'Maus bewegen' : 'Tippen';
  if (hint) hint.textContent = idleHint;

  const rooms = [makeRoom(7), makeRoom(23), makeRoom(91)];

  let w = 0;
  let h = 0;
  let dpr = 1;
  let visible = true;
  let raf = 0;
  let t = 0;
  let last = performance.now();

  // EQ-Band (geglättet)
  const band = { lf: Math.log10(1000), g: 0, tlf: Math.log10(1000), tg: 0 };
  let userActive = false;
  let idleTimer = 0;

  const xOf = (lf: number) => ((lf - Math.log10(F_MIN)) / DECADES) * w;
  const lfOfX = (x: number) => Math.log10(F_MIN) + (x / w) * DECADES;
  const cy = () => h * (w < 760 ? 0.42 : 0.4);
  const scale = () => Math.min(h * 0.011, 9);
  const yOf = (db: number) => cy() - db * scale();

  function resize() {
    const rect = canvas!.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!raf) draw();
  }

  function grid() {
    const c = ctx!;
    c.lineWidth = 1;
    c.font = '500 10px "JetBrains Mono Variable", monospace';
    c.textBaseline = 'top';

    const marks = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    for (let d = 0; d < 3; d++) {
      for (let m = 2; m < 10; m++) {
        const f = 20 * 10 ** d * (m / 2);
        if (f > F_MAX) continue;
        const x = Math.round(xOf(Math.log10(f))) + 0.5;
        c.strokeStyle = 'rgba(236,233,224,0.03)';
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
    }
    for (const f of marks) {
      const x = Math.round(xOf(Math.log10(f))) + 0.5;
      c.strokeStyle = 'rgba(236,233,224,0.07)';
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
      if (f !== F_MIN && f !== F_MAX) {
        c.fillStyle = 'rgba(236,233,224,0.28)';
        c.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, x + 5, yOf(18) - 16);
      }
    }
    for (let db = -18; db <= 18; db += 6) {
      const y = Math.round(yOf(db)) + 0.5;
      c.strokeStyle = db === 0 ? 'rgba(236,233,224,0.14)' : 'rgba(236,233,224,0.05)';
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
      if (db !== 0 && w > 560) {
        c.fillStyle = 'rgba(236,233,224,0.22)';
        c.fillText(`${db > 0 ? '+' : ''}${db} dB`, 10, y + 4);
      }
    }
  }

  function roomAt(room: Peak[], lf: number, phase: number) {
    let v = 0;
    for (const p of room) v += bell(lf, p.lf, p.g, p.w);
    v += 1.4 * Math.sin(lf * 23 + phase) + 0.8 * Math.sin(lf * 51 - phase * 1.3);
    // Roll-off an den Bandgrenzen
    const f = 10 ** lf;
    v -= 10 / (1 + (f / 28) ** 2) ** 2;
    v -= 14 * Math.max(0, Math.log10(f / 15000)) * 6;
    return v;
  }

  function path(fn: (lf: number) => number) {
    const c = ctx!;
    c.beginPath();
    for (let i = 0; i <= POINTS; i++) {
      const lf = Math.log10(F_MIN) + (i / POINTS) * DECADES;
      const x = xOf(lf);
      const y = yOf(fn(lf));
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, w, h);
    grid();

    // Rohmessungen
    rooms.forEach((room, i) => {
      path((lf) => roomAt(room, lf, t * (0.35 + i * 0.15) + i * 2) + target(10 ** lf) - 2);
      c.strokeStyle = `rgba(236,233,224,${0.1 + i * 0.04})`;
      c.lineWidth = 1;
      c.stroke();
    });

    // Zielkurve
    c.setLineDash([4, 6]);
    path((lf) => target(10 ** lf));
    c.strokeStyle = 'rgba(236,233,224,0.35)';
    c.lineWidth = 1;
    c.stroke();
    c.setLineDash([]);

    // Ergebnis = Ziel + EQ-Band + Restwelligkeit
    const result = (lf: number) =>
      target(10 ** lf) + bell(lf, band.lf, band.g, 0.16) + 0.6 * Math.sin(lf * 17 + t * 0.8) * Math.min(1, 10 ** lf / 200);

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
      c.lineTo(xOf(lf), yOf(target(10 ** lf)));
    }
    c.closePath();
    c.fillStyle = 'rgba(255,90,31,0.10)';
    c.fill();

    path(result);
    c.strokeStyle = '#ff5a1f';
    c.lineWidth = 2;
    c.shadowColor = 'rgba(255,90,31,0.8)';
    c.shadowBlur = 14;
    c.stroke();
    c.shadowBlur = 0;

    // Band-Marker
    const bx = xOf(band.lf);
    const by = yOf(result(band.lf));
    c.setLineDash([2, 4]);
    c.strokeStyle = 'rgba(255,90,31,0.45)';
    c.beginPath();
    c.moveTo(bx, 0);
    c.lineTo(bx, h);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = '#09090a';
    c.strokeStyle = '#ff5a1f';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(bx, by, 7, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(bx, by, 14 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
    c.strokeStyle = 'rgba(255,90,31,0.3)';
    c.lineWidth = 1;
    c.stroke();

    if (roF) roF.textContent = fmtF(10 ** band.lf);
    if (roG) roG.textContent = fmtG(band.g);
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    if (!userActive && !reduced()) {
      // Automatische Demo: Band wandert über das Spektrum
      band.tlf = Math.log10(1000) + Math.sin(t * 0.23) * 1.1;
      band.tg = Math.sin(t * 0.61) * 9;
    }
    const k = 1 - Math.pow(0.0015, dt);
    band.lf += (band.tlf - band.lf) * k;
    band.g += (band.tg - band.g) * k;

    draw();
    raf = visible ? requestAnimationFrame(tick) : 0;
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function setFromPointer(e: PointerEvent) {
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (y < 0 || y > rect.height) return;
    band.tlf = Math.min(Math.log10(18000), Math.max(Math.log10(25), lfOfX(x)));
    band.tg = Math.max(-12, Math.min(12, (cy() - y) / scale()));
    userActive = true;
    if (hint) hint.textContent = 'aktiv';
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      userActive = false;
      if (hint) hint.textContent = idleHint;
    }, 3500);
  }

  hero.addEventListener('pointermove', setFromPointer);
  hero.addEventListener('pointerdown', setFromPointer);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(hero);

  resize();
  start();
}
