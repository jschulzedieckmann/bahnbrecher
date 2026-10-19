"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Dices, RotateCcw } from "lucide-react";
import {
  auswerten, BAHN_BREITE, durchrechnen, type Ergebnis, KEGEL_RADIUS, KOENIG, KUGEL_RADIUS,
  neueWelt, RINNE, schritt, werfen, type Welt, WELT_BREITE, WELT_HOEHE,
} from "./physik";
import styles from "./kegeln.module.css";

const FARBE = {
  creme: "#fef7de", cremeTief: "#f6ebc4", ink: "#000c16", inkWeich: "#3a3f45",
  gelb: "#fed51c", rot: "#eb0620", weiss: "#fffdf6", liegend: "#e2d6b4",
};
const BEST_SCHLUESSEL = "bahnbrecher-kegeln-bestwert";
const WURF_ZONE_Y = 150; // Wischen beginnt im unteren Teil der Bahn
const MAX_TEMPO = 320;
const MIN_TEMPO = 45;

type Punkt = { x: number; y: number; t: number };
type Phase = "bereit" | "rollt" | "fertig";

// Bestwert im Gerätespeicher. Klappt der Speicher nicht, geht es ohne.
function abonnieren(neu: () => void) {
  window.addEventListener("storage", neu);
  window.addEventListener("bahnbrecher-kegeln", neu);
  return () => {
    window.removeEventListener("storage", neu);
    window.removeEventListener("bahnbrecher-kegeln", neu);
  };
}
function bestwertLesen() {
  try { return Number(localStorage.getItem(BEST_SCHLUESSEL) ?? 0) || 0; } catch { return 0; }
}
function bestwertSchreiben(n: number) {
  try {
    localStorage.setItem(BEST_SCHLUESSEL, String(n));
    window.dispatchEvent(new Event("bahnbrecher-kegeln"));
  } catch {}
}

export function ergebnisText(e: Ergebnis) {
  if (e.art === "alle-neune") return "Alle Neune!";
  if (e.art === "kranz") return "Kranz!";
  if (e.art === "gosse") return "Gosse!";
  return `${e.holz} Holz`;
}

function zeichnen(ctx: CanvasRenderingContext2D, welt: Welt, ziel: { x: number; y: number } | null) {
  const s = ctx.canvas.width / WELT_BREITE;
  const X = (x: number) => (x + RINNE) * s;
  const Y = (y: number) => y * s;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Rinnen und Bahn
  ctx.fillStyle = FARBE.ink;
  ctx.fillRect(0, 0, X(0), Y(WELT_HOEHE));
  ctx.fillRect(X(BAHN_BREITE), 0, X(0), Y(WELT_HOEHE));
  ctx.fillStyle = FARBE.cremeTief;
  ctx.fillRect(X(0), 0, BAHN_BREITE * s, Y(WELT_HOEHE));
  ctx.strokeStyle = "rgba(0, 12, 22, 0.07)";
  ctx.lineWidth = Math.max(1, s * 0.25);
  for (let x = 10; x < BAHN_BREITE; x += 10) {
    ctx.beginPath();
    ctx.moveTo(X(x), 0);
    ctx.lineTo(X(x), Y(WELT_HOEHE));
    ctx.stroke();
  }
  // Kegelfeld und Wurflinie
  ctx.fillStyle = FARBE.creme;
  ctx.fillRect(X(0), Y(20), BAHN_BREITE * s, Y(66));
  ctx.strokeStyle = FARBE.rot;
  ctx.lineWidth = Math.max(1.5, s * 0.6);
  ctx.beginPath();
  ctx.moveTo(X(0), Y(WURF_ZONE_Y));
  ctx.lineTo(X(BAHN_BREITE), Y(WURF_ZONE_Y));
  ctx.stroke();

  // Liegende Kegel zuerst, dann stehende
  for (const k of welt.kegel) {
    if (!k.gefallen || k.raus) continue;
    ctx.save();
    ctx.translate(X(k.x), Y(k.y));
    ctx.rotate(k.winkel);
    const l = KEGEL_RADIUS * 3.2 * s;
    const b = KEGEL_RADIUS * 1.5 * s;
    ctx.fillStyle = FARBE.liegend;
    ctx.strokeStyle = FARBE.inkWeich;
    ctx.lineWidth = Math.max(1, s * 0.5);
    ctx.beginPath();
    ctx.roundRect(-l / 2, -b / 2, l, b, b / 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FARBE.rot;
    ctx.fillRect(-l * 0.12, -b / 2, l * 0.08, b);
    ctx.restore();
  }
  for (const k of welt.kegel) {
    if (k.gefallen || k.raus) continue;
    ctx.beginPath();
    ctx.arc(X(k.x), Y(k.y), KEGEL_RADIUS * s, 0, Math.PI * 2);
    ctx.fillStyle = FARBE.weiss;
    ctx.fill();
    ctx.lineWidth = Math.max(1.2, s * 0.8);
    ctx.strokeStyle = FARBE.ink;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X(k.x), Y(k.y), KEGEL_RADIUS * 0.55 * s, 0, Math.PI * 2);
    ctx.strokeStyle = FARBE.rot;
    ctx.lineWidth = Math.max(1, s * 0.6);
    ctx.stroke();
    if (k.nr === KOENIG) {
      ctx.beginPath();
      ctx.arc(X(k.x), Y(k.y), KEGEL_RADIUS * 0.32 * s, 0, Math.PI * 2);
      ctx.fillStyle = FARBE.gelb;
      ctx.fill();
    }
  }

  // Zielhilfe beim Wischen
  if (ziel) {
    ctx.save();
    ctx.setLineDash([s * 2, s * 2]);
    ctx.strokeStyle = FARBE.rot;
    ctx.lineWidth = Math.max(2, s * 0.8);
    ctx.beginPath();
    ctx.moveTo(X(welt.kugel.x), Y(welt.kugel.y));
    ctx.lineTo(X(ziel.x), Y(ziel.y));
    ctx.stroke();
    ctx.restore();
  }

  // Kugel
  const kugel = welt.kugel;
  if (!kugel.raus) {
    ctx.beginPath();
    ctx.arc(X(kugel.x), Y(kugel.y), KUGEL_RADIUS * s, 0, Math.PI * 2);
    ctx.fillStyle = FARBE.ink;
    ctx.fill();
    // Heller Rand, damit die Kugel auch in der schwarzen Rinne zu sehen ist
    ctx.lineWidth = Math.max(1.5, s * 0.7);
    ctx.strokeStyle = FARBE.cremeTief;
    ctx.stroke();
    ctx.fillStyle = FARBE.inkWeich;
    for (const [dx, dy] of [[-1.6, -1.8], [1.6, -1.8], [0, 0.4]]) {
      ctx.beginPath();
      ctx.arc(X(kugel.x + dx), Y(kugel.y + dy), 0.9 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function Kegelbahn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weltRef = useRef<Welt>(neueWelt());
  const punkteRef = useRef<Punkt[]>([]);
  const zielRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const [phase, setPhase] = useState<Phase>("bereit");
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
  const [verlauf, setVerlauf] = useState<Ergebnis[]>([]);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const bestwert = useSyncExternalStore(abonnieren, bestwertLesen, () => 0);

  const neuZeichnen = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) zeichnen(ctx, weltRef.current, zielRef.current);
  }, []);

  // Canvas an die Anzeigegröße anpassen, scharf auf hochauflösenden Displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anpassen = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientWidth * dpr * (WELT_HOEHE / WELT_BREITE));
      neuZeichnen();
    };
    anpassen();
    const beobachter = new ResizeObserver(anpassen);
    beobachter.observe(canvas);
    return () => {
      beobachter.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [neuZeichnen]);

  const fertig = useCallback(() => {
    const e = auswerten(weltRef.current);
    setErgebnis(e);
    setVerlauf((v) => [e, ...v].slice(0, 6));
    setPhase("fertig");
    if (e.holz > bestwertLesen()) bestwertSchreiben(e.holz);
  }, []);

  const losrollen = useCallback((vx: number, vy: number) => {
    const welt = weltRef.current;
    werfen(welt, vx, vy);
    zielRef.current = null;
    setPhase("rollt");
    setHinweis(null);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      durchrechnen(welt);
      neuZeichnen();
      fertig();
      return;
    }
    let letzte = performance.now();
    let rest = 0;
    let vibriert = false;
    const takt = (jetzt: number) => {
      rest += Math.min(0.05, (jetzt - letzte) / 1000);
      letzte = jetzt;
      while (rest >= 1 / 240 && !welt.fertig) {
        if (schritt(welt, 1 / 240) && !vibriert) {
          vibriert = true;
          navigator.vibrate?.(20);
        }
        rest -= 1 / 240;
      }
      neuZeichnen();
      if (welt.fertig) fertig();
      else rafRef.current = requestAnimationFrame(takt);
    };
    rafRef.current = requestAnimationFrame(takt);
  }, [fertig, neuZeichnen]);

  const inWelt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = r.width / WELT_BREITE;
    return { x: (e.clientX - r.left) / s - RINNE, y: (e.clientY - r.top) / s, t: e.timeStamp };
  };

  const druecken = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "bereit") return;
    const p = inWelt(e);
    if (p.y < WURF_ZONE_Y - 10) {
      setHinweis("Setz den Finger unten an die Kugel und wisch Richtung Kegel.");
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    weltRef.current.kugel.x = Math.min(BAHN_BREITE - KUGEL_RADIUS, Math.max(KUGEL_RADIUS, p.x));
    punkteRef.current = [p];
    neuZeichnen();
  };

  const ziehen = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "bereit" || punkteRef.current.length === 0) return;
    const p = inWelt(e);
    punkteRef.current = [...punkteRef.current, p].slice(-12);
    const start = punkteRef.current[0];
    const dx = p.x - start.x;
    const dy = p.y - start.y;
    const kugel = weltRef.current.kugel;
    zielRef.current = dy < -2 ? { x: kugel.x + dx * 3, y: kugel.y + dy * 3 } : null;
    neuZeichnen();
  };

  const loslassen = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "bereit" || punkteRef.current.length === 0) return;
    const ende = inWelt(e);
    const punkte = [...punkteRef.current, ende];
    punkteRef.current = [];
    zielRef.current = null;
    // Tempo aus den letzten rund 100 ms des Wischens
    const anfang = punkte.find((p) => ende.t - p.t <= 100) ?? punkte[0];
    const dauer = Math.max(16, ende.t - anfang.t);
    let vx = ((ende.x - anfang.x) / dauer) * 1000 * 0.9;
    let vy = ((ende.y - anfang.y) / dauer) * 1000 * 0.9;
    const tempo = Math.hypot(vx, vy);
    if (vy > -MIN_TEMPO || tempo < MIN_TEMPO) {
      setHinweis("Zu sanft. Wisch schwungvoll nach oben.");
      neuZeichnen();
      return;
    }
    if (tempo > MAX_TEMPO) {
      vx *= MAX_TEMPO / tempo;
      vy *= MAX_TEMPO / tempo;
    }
    losrollen(vx, vy);
  };

  const zufallswurf = () => {
    if (phase !== "bereit") return;
    weltRef.current.kugel.x = 38 + Math.random() * 24;
    losrollen((Math.random() - 0.5) * 50, -(150 + Math.random() * 150));
  };

  const neuAufstellen = () => {
    cancelAnimationFrame(rafRef.current);
    weltRef.current = neueWelt();
    zielRef.current = null;
    setErgebnis(null);
    setHinweis(null);
    setPhase("bereit");
    neuZeichnen();
  };

  return (
    <div className={styles.spiel}>
      <div className={styles.bahnRahmen}>
        <canvas
          ref={canvasRef}
          className={styles.bahn}
          onPointerDown={druecken}
          onPointerMove={ziehen}
          onPointerUp={loslassen}
          onPointerCancel={() => { punkteRef.current = []; zielRef.current = null; neuZeichnen(); }}
          role="img"
          aria-label="Kegelbahn. Unten aufsetzen und Richtung Kegel wischen, um die Kugel zu werfen."
        />
        {phase === "fertig" && ergebnis && (
          <div className={styles.ergebnis} data-art={ergebnis.art}>
            <p className="plakatschrift">{ergebnisText(ergebnis)}</p>
            {ergebnis.art !== "holz" && ergebnis.art !== "gosse" && <p className={styles.ergebnisZahl}>{ergebnis.holz} Holz</p>}
          </div>
        )}
      </div>

      <div className={styles.seite}>
        <p className={styles.anleitung} aria-live="polite">
          {phase === "fertig" && ergebnis
            ? `Ergebnis: ${ergebnisText(ergebnis)}${ergebnis.art === "kranz" || ergebnis.art === "alle-neune" ? `, ${ergebnis.holz} Holz` : ""}`
            : phase === "rollt"
              ? "Kugel rollt …"
              : hinweis ?? "Finger unten auf die Bahn setzen und Richtung Kegel wischen. Je schneller, desto mehr Schwung."}
        </p>

        <div className="knopfreihe">
          {phase === "fertig" ? (
            <button type="button" className="knopf" onClick={neuAufstellen}>
              <RotateCcw size={18} strokeWidth={2.6} aria-hidden /> Neu aufstellen
            </button>
          ) : (
            <button type="button" className="knopf knopf--hell" onClick={zufallswurf} disabled={phase !== "bereit"}>
              <Dices size={18} strokeWidth={2.4} aria-hidden /> Wurf mit Zufall
            </button>
          )}
        </div>

        <dl className={styles.zahlen}>
          <div><dt>Bestwert</dt><dd className="zahl">{bestwert} Holz</dd></div>
          <div>
            <dt>Letzte Würfe</dt>
            <dd>{verlauf.length ? verlauf.map((e) => ergebnisText(e).replace(" Holz", "")).join(" · ") : "noch keine"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
