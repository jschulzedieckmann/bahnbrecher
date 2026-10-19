// Einfache 2D-Physik für das Kegel-Minispiel, Draufsicht auf die Bahn.
// Spielwelt in Bahn-Einheiten: Bahn x 0..100, links und rechts je eine Rinne,
// y wächst nach unten. Die Kugel startet unten, die Kegel stehen oben.

export const BAHN_BREITE = 100;
export const RINNE = 12;
export const WELT_BREITE = BAHN_BREITE + 2 * RINNE;
export const WELT_HOEHE = 220;
export const KUGEL_START_Y = 200;
export const KUGEL_RADIUS = 6;
export const KEGEL_RADIUS = 3.4;
export const KOENIG = 5;

/** Neun Kegel als Raute: 1 vorn, 5 König in der Mitte, 9 hinten. */
const AUFSTELLUNG: [number, number, number][] = [
  [1, 50, 72],
  [2, 40, 62], [3, 60, 62],
  [4, 30, 52], [5, 50, 52], [6, 70, 52],
  [7, 40, 42], [8, 60, 42],
  [9, 50, 32],
];

export type Koerper = { x: number; y: number; vx: number; vy: number; r: number; masse: number };
export type Kegel = Koerper & { nr: number; startX: number; startY: number; gefallen: boolean; winkel: number; raus: boolean };
export type Kugel = Koerper & { inRinne: boolean; raus: boolean };
export type Welt = { kugel: Kugel; kegel: Kegel[]; zeit: number; fertig: boolean };

export type Ergebnis = { holz: number; art: "alle-neune" | "kranz" | "gosse" | "holz"; gefallen: number[] };

export function neueWelt(kugelX = 50): Welt {
  return {
    kugel: { x: kugelX, y: KUGEL_START_Y, vx: 0, vy: 0, r: KUGEL_RADIUS, masse: 6, inRinne: false, raus: false },
    kegel: AUFSTELLUNG.map(([nr, x, y]) => ({
      nr, x, y, startX: x, startY: y, vx: 0, vy: 0, r: KEGEL_RADIUS, masse: 1, gefallen: false, winkel: 0, raus: false,
    })),
    zeit: 0,
    fertig: false,
  };
}

/** Stößt die Kugel an. Geschwindigkeit in Bahn-Einheiten pro Sekunde. */
export function werfen(welt: Welt, vx: number, vy: number) {
  welt.kugel.vx = vx;
  welt.kugel.vy = vy;
}

const REIBUNG_KUGEL = 0.12; // Anteil Geschwindigkeitsverlust pro Sekunde
const REIBUNG_KEGEL = 2.2;
const STOSSZAHL = 0.82;
const FALL_GESCHWINDIGKEIT = 12;
const FALL_WEG = 2.2;
const LIEGEND = 1.5;
const STREUUNG = 0.3;

function bremsen(k: Koerper, faktor: number, dt: number) {
  const f = Math.max(0, 1 - faktor * dt);
  k.vx *= f;
  k.vy *= f;
}

function stoss(a: Koerper, b: Koerper) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const abstand = Math.hypot(dx, dy);
  const min = a.r + b.r;
  if (abstand === 0 || abstand >= min) return false;
  const nx = dx / abstand;
  const ny = dy / abstand;
  // Überlappung auflösen, nach Masse verteilt
  const ueber = min - abstand;
  const summe = a.masse + b.masse;
  a.x -= nx * ueber * (b.masse / summe);
  a.y -= ny * ueber * (b.masse / summe);
  b.x += nx * ueber * (a.masse / summe);
  b.y += ny * ueber * (a.masse / summe);
  // Impulsaustausch entlang der Stoßnormalen
  const relativ = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (relativ > 0) return true;
  const j = (-(1 + STOSSZAHL) * relativ) / (1 / a.masse + 1 / b.masse);
  a.vx -= (j / a.masse) * nx;
  a.vy -= (j / a.masse) * ny;
  b.vx += (j / b.masse) * nx;
  b.vy += (j / b.masse) * ny;
  return true;
}

function pruefeFall(k: Kegel) {
  if (k.gefallen) return;
  const tempo = Math.hypot(k.vx, k.vy);
  const weg = Math.hypot(k.x - k.startX, k.y - k.startY);
  if (tempo > FALL_GESCHWINDIGKEIT || weg > FALL_WEG) {
    k.gefallen = true;
    k.winkel = Math.atan2(k.vy, k.vx) + (Math.random() - 0.5) * 1.2;
    // Ein umfallender Kegel liegt quer und reißt Nachbarn leichter mit.
    k.r = KEGEL_RADIUS * LIEGEND;
  }
}

/** Ein Zeitschritt. Gibt true zurück, wenn in diesem Schritt ein Kegel neu gefallen ist. */
export function schritt(welt: Welt, dt: number): boolean {
  const { kugel, kegel } = welt;
  let neuGefallen = false;
  welt.zeit += dt;

  // Kugel bewegen, Rinne prüfen
  kugel.x += kugel.vx * dt;
  kugel.y += kugel.vy * dt;
  bremsen(kugel, REIBUNG_KUGEL, dt);
  if (!kugel.inRinne && (kugel.x - kugel.r < 0 || kugel.x + kugel.r > BAHN_BREITE)) {
    kugel.inRinne = true;
    kugel.x = kugel.x < BAHN_BREITE / 2 ? -RINNE / 2 : BAHN_BREITE + RINNE / 2;
    kugel.vx = 0;
  }
  if (kugel.y < -kugel.r * 2) kugel.raus = true;

  // Kegel bewegen
  for (const k of kegel) {
    if (k.raus) continue;
    k.x += k.vx * dt;
    k.y += k.vy * dt;
    bremsen(k, REIBUNG_KEGEL, dt);
    if (k.y < -k.r || k.x < -RINNE || k.x > BAHN_BREITE + RINNE) k.raus = true;
  }

  // Stöße: Kugel gegen Kegel (nicht aus der Rinne heraus), Kegel gegen Kegel
  if (!kugel.inRinne && !kugel.raus) {
    for (const k of kegel) if (!k.raus && stoss(kugel, k)) pruefeFall(k);
  }
  for (let i = 0; i < kegel.length; i++) {
    for (let j = i + 1; j < kegel.length; j++) {
      const a = kegel[i];
      const b = kegel[j];
      if (a.raus || b.raus) continue;
      if (stoss(a, b)) {
        // Kegel prallen nie ganz gerade ab: etwas seitliche Streuung
        const tempo = Math.hypot(b.vx, b.vy);
        if (tempo > FALL_GESCHWINDIGKEIT) {
          const zufall = (Math.random() - 0.5) * STREUUNG * tempo;
          b.vx += (-b.vy / tempo) * zufall;
          b.vy += (b.vx / tempo) * zufall;
        }
        pruefeFall(a);
        pruefeFall(b);
      }
    }
  }
  for (const k of kegel) {
    const vorher = k.gefallen;
    pruefeFall(k);
    if (!vorher && k.gefallen) neuGefallen = true;
  }

  // Fertig, wenn alles steht oder die Zeit abgelaufen ist
  const ruhig = (k: Koerper) => Math.hypot(k.vx, k.vy) < 1.5;
  const kugelFertig = kugel.raus || ruhig(kugel);
  const kegelFertig = kegel.every((k) => k.raus || ruhig(k));
  if ((kugelFertig && kegelFertig && welt.zeit > 0.3) || welt.zeit > 8) welt.fertig = true;
  return neuGefallen;
}

export function auswerten(welt: Welt): Ergebnis {
  const gefallen = welt.kegel.filter((k) => k.gefallen).map((k) => k.nr);
  const holz = gefallen.length;
  const koenigSteht = !gefallen.includes(KOENIG);
  let art: Ergebnis["art"] = "holz";
  if (holz === 9) art = "alle-neune";
  else if (holz === 8 && koenigSteht) art = "kranz";
  else if (holz === 0 && welt.kugel.inRinne) art = "gosse";
  return { holz, art, gefallen };
}

/** Ganzen Wurf ohne Animation durchrechnen (für reduzierte Bewegung und Tests). */
export function durchrechnen(welt: Welt, dt = 1 / 240) {
  while (!welt.fertig) schritt(welt, dt);
  return auswerten(welt);
}
