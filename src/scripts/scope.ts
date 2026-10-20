/**
 * Oszilloskop im Testlabor: zeigt je nach aktivem Test (Scroll-Position)
 * eine andere Darstellung – Clipping-Sinus, FFT, Ausschwingen, Frequenzgang.
 */

type Mode = 'power' | 'thd' | 'damping' | 'response';

const labels: Record<Mode, [string, string, string]> = {
  power: ['Leistung', 'Last 4 Ω → 2 Ω', 'Sinus 1 kHz'],
  thd: ['THD+N', 'FFT 20 Hz – 20 kHz', 'Grundton 1 kHz'],
  damping: ['Dämpfungsfaktor', 'Rechteck-Impuls', 'Ausschwingverhalten'],
  response: ['Frequenzgang', 'Log-Sweep', '20 Hz – 20 kHz'],
};

const ORANGE = '#ff5a1f';

export function initScope() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-scope]');
  const tests = Array.from(document.querySelectorAll<HTMLElement>('[data-test]'));
  if (!canvas || !tests.length) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const modeEl = document.querySelector<HTMLElement>('[data-scope-mode]');
  const aEl = document.querySelector<HTMLElement>('[data-scope-a]');
  const bEl = document.querySelector<HTMLElement>('[data-scope-b]');

  let mode: Mode = 'power';
  let modeT = 0; // Zeit seit Moduswechsel
  let t = 0;
  let w = 0;
  let h = 0;
  let raf = 0;
  let visible = false;
  let last = performance.now();

  function resize() {
    const r = canvas!.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function grid() {
    const c = ctx!;
    c.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const x = Math.round((w / 10) * i) + 0.5;
      c.strokeStyle = i === 5 ? 'rgba(236,233,224,0.12)' : 'rgba(236,233,224,0.05)';
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, h);
      c.stroke();
    }
    for (let i = 1; i < 8; i++) {
      const y = Math.round((h / 8) * i) + 0.5;
      c.strokeStyle = i === 4 ? 'rgba(236,233,224,0.12)' : 'rgba(236,233,224,0.05)';
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }
  }

  function glow(width = 2) {
    const c = ctx!;
    c.strokeStyle = ORANGE;
    c.lineWidth = width;
    c.shadowColor = 'rgba(255,90,31,0.9)';
    c.shadowBlur = 12;
    c.stroke();
    c.shadowBlur = 0;
  }

  function drawPower() {
    const c = ctx!;
    // Amplitude steigt bis zum Clipping, dann Reset
    const cycle = (t % 5) / 5;
    const amp = Math.min(1.35, 0.15 + cycle * 1.5);
    const clip = 0.82;
    c.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const ph = (x / w) * Math.PI * 2 * 4 - t * 3;
      let y = Math.sin(ph) * amp;
      y = Math.max(-clip, Math.min(clip, y));
      const py = h / 2 - y * h * 0.42;
      x === 0 ? c.moveTo(x, py) : c.lineTo(x, py);
    }
    glow();
    if (amp > clip) {
      c.fillStyle = 'rgba(255,90,31,0.9)';
      c.font = '600 11px "JetBrains Mono Variable", monospace';
      c.fillText('CLIP', w - 46, 20);
    }
    // Clip-Grenzen
    c.setLineDash([3, 5]);
    c.strokeStyle = 'rgba(255,176,32,0.4)';
    c.lineWidth = 1;
    for (const s of [-1, 1]) {
      const y = h / 2 - s * clip * h * 0.42;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }
    c.setLineDash([]);
  }

  function drawThd() {
    const c = ctx!;
    const base = h * 0.92;
    const xOf = (f: number) => (Math.log10(f / 20) / 3) * w;
    // Rauschteppich
    c.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const n = Math.sin(x * 0.9 + t * 20) * Math.sin(x * 0.37 - t * 13) * 0.5 + 0.5;
      const y = base - h * (0.05 + n * 0.035);
      x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.strokeStyle = 'rgba(255,90,31,0.45)';
    c.lineWidth = 1;
    c.stroke();
    // Grundton + Oberwellen
    const grow = Math.min(1, modeT * 1.5);
    for (let k = 1; k <= 9; k++) {
      const f = 1000 * k;
      if (f > 20000) break;
      const lvl = k === 1 ? 0.82 : (0.32 / k) * (1 + 0.15 * Math.sin(t * 4 + k));
      const x = xOf(f);
      c.beginPath();
      c.moveTo(x, base - h * 0.05);
      c.lineTo(x, base - h * lvl * grow);
      glow(k === 1 ? 2.5 : 1.5);
      if (k <= 4) {
        c.fillStyle = 'rgba(236,233,224,0.5)';
        c.font = '500 10px "JetBrains Mono Variable", monospace';
        c.fillText(`H${k}`, x + 4, base - h * lvl * grow - 4);
      }
    }
  }

  function drawDamping() {
    const c = ctx!;
    const period = 2.4;
    const local = (t % period) / period;
    c.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const u = x / w;
      const start = 0.12;
      let y = 0;
      if (u > start) {
        const tt = (u - start) * 10;
        y = 0.6 - 0.6 * Math.exp(-tt * 0.9) * Math.cos(tt * 5.5) * 1.2;
      }
      const py = h * 0.75 - y * h * 0.55;
      x === 0 ? c.moveTo(x, py) : c.lineTo(x, py);
      if (u > local + 0.15) break;
    }
    glow();
  }

  function drawResponse() {
    const c = ctx!;
    const prog = Math.min(1, (t % 4) / 3);
    const resp = (u: number) => {
      const f = 20 * 10 ** (u * 3);
      // Hochpass unten, sanfter Abfall oben, minimale Welligkeit
      return -12 / (1 + (f / 22) ** 2) - 12 / (1 + (45000 / f) ** 2) + 0.3 * Math.sin(u * 40);
    };
    c.beginPath();
    let lastX = 0;
    let lastY = 0;
    for (let x = 0; x <= w * prog; x += 2) {
      const y = h * 0.42 - resp(x / w) * h * 0.03;
      x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      lastX = x;
      lastY = y;
    }
    glow();
    c.fillStyle = ORANGE;
    c.beginPath();
    c.arc(lastX, lastY, 4, 0, Math.PI * 2);
    c.fill();
    c.font = '500 10px "JetBrains Mono Variable", monospace';
    c.fillStyle = 'rgba(236,233,224,0.4)';
    ['20', '200', '2k', '20k'].forEach((l, i) => c.fillText(l, (w / 3) * i + 4, h - 8));
    c.fillText('0 dB', 4, h * 0.42 - 6);
  }

  function draw() {
    const c = ctx!;
    c.clearRect(0, 0, w, h);
    grid();
    if (mode === 'power') drawPower();
    else if (mode === 'thd') drawThd();
    else if (mode === 'damping') drawDamping();
    else drawResponse();
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    modeT += dt;
    draw();
    raf = visible ? requestAnimationFrame(tick) : 0;
  }

  function setMode(m: Mode) {
    if (m === mode) return;
    mode = m;
    modeT = 0;
    t = 0;
    const [a, b, cc] = labels[m];
    if (modeEl) modeEl.textContent = a;
    if (aEl) aEl.textContent = b;
    if (bEl) bEl.textContent = cc;
  }

  function spy() {
    const line = window.innerHeight * 0.6;
    let active = tests[0];
    for (const el of tests) if (el.getBoundingClientRect().top < line) active = el;
    tests.forEach((el) => el.classList.toggle('is-active', el === active));
    setMode(active.dataset.test as Mode);
  }

  window.addEventListener('scroll', spy, { passive: true });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }).observe(canvas);
  spy();
}
