/**
 * Gemeinsames Modell für den Hero-EQ und das Messprotokoll im Testlabor.
 * Keine Messwerte: alles hier ist eine Rechnung aus der Einstellung des Besuchers.
 */

export const F_MIN = 20;
export const F_MAX = 20000;
export const DECADES = Math.log10(F_MAX / F_MIN);
export const Q_DEFAULT = 1.41;

/** Glockenkurve im log-Frequenzbereich (Näherung eines Peaking-Filters). */
export const bell = (lf: number, lf0: number, gain: number, width: number) =>
  gain * Math.exp(-((lf - lf0) ** 2) / (2 * width * width));

/** Zielkurve: Bass-Anhebung und leichter Abfall in den Höhen (Hauskurve). */
export const targetCurve = (f: number) => 7 / (1 + (f / 90) ** 2) - 2.2 * Math.max(0, Math.log10(f / 1000));

const de = (n: number, digits: number) => n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtF = (f: number) => (f >= 1000 ? `${de(f / 1000, f >= 10000 ? 1 : 2)} kHz` : `${Math.round(f)} Hz`);
export const fmtG = (g: number) => `${g >= 0 ? '+' : '−'}${de(Math.abs(g), 1)} dB`;
export const fmtQ = (q: number) => de(q, 2);

export type EqState = { lf: number; g: number; q: number; user: boolean };

declare global {
  interface Window {
    __tsaEq?: EqState;
  }
}

export function getEq(): EqState {
  return window.__tsaEq ?? { lf: Math.log10(1000), g: 0, q: Q_DEFAULT, user: false };
}

export function setEq(s: EqState) {
  window.__tsaEq = s;
  window.dispatchEvent(new CustomEvent('eq:change', { detail: s }));
}

/** Frequenzgang nach dem Band, wie ihn das Protokoll misst. */
export const response = (lf: number, s: EqState) => targetCurve(10 ** lf) + bell(lf, s.lf, s.g, 0.16);
