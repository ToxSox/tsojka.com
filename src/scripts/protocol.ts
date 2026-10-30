/**
 * Messprotokoll im Testlabor (Peak, BRIEF.md §5).
 * Zeichnet vier Plots als SVG-Pfade. Wie weit jeder Pfad gezeichnet ist, steuert
 * CSS über --sc-p der Engine. Der Frequenzgang ist die EQ-Einstellung des
 * Besuchers aus dem Hero; Leistung, THD+N und Dämpfung sind als Schema markiert.
 */
import { DECADES, F_MIN, fmtF, fmtG, fmtQ, getEq, response, targetCurve, type EqState } from './eq-model';

const W = 200;
const H = 110;
const N = 160;

const line = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

/** Sinus, dessen Pegel steigt, bis er an der Grenze abschneidet. */
function power() {
  const clip = 0.78;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N * 2; i++) {
    const u = i / (N * 2);
    const amp = 0.12 + u * 1.15;
    const v = Math.max(-clip, Math.min(clip, Math.sin(u * Math.PI * 2 * 9) * amp));
    pts.push([u * W, H / 2 - v * H * 0.42]);
  }
  const ref = `M0 ${H / 2 - clip * H * 0.42} L${W} ${H / 2 - clip * H * 0.42} M0 ${H / 2 + clip * H * 0.42} L${W} ${H / 2 + clip * H * 0.42}`;
  return { trace: line(pts), ref };
}

/** Spektrum: Grundton 1 kHz, abfallende Oberwellen, Rauschteppich. */
function thd() {
  const xOf = (f: number) => (Math.log10(f / 20) / 3) * W;
  const base = H - 8;
  const parts: string[] = [];
  const floor: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W;
    floor.push([x, base - 6 - 3 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * 0.37))]);
  }
  parts.push(line(floor));
  for (let k = 1; k <= 8; k++) {
    const f = 1000 * k;
    if (f > 20000) break;
    const lvl = k === 1 ? 0.84 : 0.3 / k;
    const x = xOf(f);
    parts.push(`M${x.toFixed(2)} ${base - 6} L${x.toFixed(2)} ${(base - H * lvl).toFixed(2)}`);
  }
  return { trace: parts.join(' '), ref: `M0 ${base - 6} L${W} ${base - 6}` };
}

/** Sprungantwort: Einschwingen und Ausschwingen. */
function damping() {
  const pts: [number, number][] = [];
  const start = 0.14;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    let v = 0;
    if (u > start) {
      const t = (u - start) * 10;
      v = 0.62 - 0.62 * Math.exp(-t * 0.9) * Math.cos(t * 5.5) * 1.15;
    }
    pts.push([u * W, H * 0.78 - v * H * 0.6]);
  }
  return { trace: line(pts), ref: `M0 ${H * 0.78 - 0.62 * H * 0.6} L${W} ${H * 0.78 - 0.62 * H * 0.6}` };
}

/** Frequenzgang mit dem EQ-Band des Besuchers, Zielkurve gestrichelt. */
function freq(s: EqState) {
  const yOf = (db: number) => H * 0.5 - db * (H / 40);
  const pts: [number, number][] = [];
  const ref: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const lf = Math.log10(F_MIN) + (i / N) * DECADES;
    const x = (i / N) * W;
    pts.push([x, yOf(response(lf, s))]);
    ref.push([x, yOf(targetCurve(10 ** lf))]);
  }
  return { trace: line(pts), ref: line(ref) };
}

export function initProtocol() {
  const root = document.querySelector<HTMLElement>('[data-protocol]');
  if (!root) return;

  const set = (key: string, d: { trace: string; ref: string }) => {
    const plot = root.querySelector(`[data-plot="${key}"]`);
    plot?.querySelector('[data-trace]')?.setAttribute('d', d.trace);
    plot?.querySelector('[data-ref]')?.setAttribute('d', d.ref);
  };

  set('power', power());
  set('thd', thd());
  set('damping', damping());

  const eqLabel = root.querySelector<HTMLElement>('[data-proto-eq]');
  const srcLabel = root.querySelector<HTMLElement>('[data-proto-src]');

  let frame = 0;
  const update = () => {
    frame = 0;
    const s = getEq();
    set('response', freq(s));
    if (eqLabel) eqLabel.textContent = `EQ-Band: ${fmtF(10 ** s.lf)} · ${fmtG(s.g)} · Q ${fmtQ(s.q)}`;
    if (srcLabel) srcLabel.textContent = s.user ? 'Deine Einstellung aus dem Kopfbereich' : 'Demo-Band aus dem Kopfbereich (nicht eingestellt)';
  };

  window.addEventListener('eq:change', () => {
    if (!frame) frame = requestAnimationFrame(update);
  });
  update();
}
