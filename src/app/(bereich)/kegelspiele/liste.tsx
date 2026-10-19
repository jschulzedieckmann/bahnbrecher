"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Dices } from "lucide-react";
import type { Kegelspiel } from "@/lib/daten";
import styles from "./kegelspiele.module.css";

const FORM_NAME: Record<Kegelspiel["form"], string> = {
  jeder_fuer_sich: "jeder für sich",
  jeder_gegen_jeden: "jeder gegen jeden",
  mannschaften: "Mannschaften",
  einer_gegen_alle: "einer gegen alle",
  saisonspiel: "Saisonspiel",
};

export function Schwierigkeit({ grad }: { grad: Kegelspiel["schwierigkeit"] }) {
  const stufe = grad === "leicht" ? 1 : grad === "mittel" ? 2 : 3;
  return (
    <span className={`${styles.grad} ${styles[grad]}`}>
      <span className={styles.kegel} aria-hidden>
        {[1, 2, 3].map((i) => <span key={i} className={i <= stufe ? styles.voll : undefined} />)}
      </span>
      {grad}
    </span>
  );
}

export function SpieleListe({ spiele }: { spiele: Kegelspiel[] }) {
  const [grad, setGrad] = useState<string>("alle");
  const [form, setForm] = useState<string>("alle");
  const [zufall, setZufall] = useState<Kegelspiel | null>(null);

  const gefiltert = useMemo(
    () => spiele.filter((s) => (grad === "alle" || s.schwierigkeit === grad) && (form === "alle" || s.form === form)),
    [spiele, grad, form],
  );
  const formen = [...new Set(spiele.map((s) => s.form))];

  const wuerfeln = () => {
    const pool = gefiltert.length ? gefiltert : spiele;
    const andere = pool.length > 1 ? pool.filter((s) => s.id !== zufall?.id) : pool;
    setZufall(andere[Math.floor(Math.random() * andere.length)]);
  };

  return (
    <>
      <div className={styles.filter}>
        <label className="feld">
          <span className="feld-name">Schwierigkeit</span>
          <select className="eingabe" value={grad} onChange={(e) => setGrad(e.target.value)}>
            <option value="alle">alle</option>
            <option value="leicht">leicht</option>
            <option value="mittel">mittel</option>
            <option value="schwer">schwer</option>
          </select>
        </label>
        <label className="feld">
          <span className="feld-name">Form</span>
          <select className="eingabe" value={form} onChange={(e) => setForm(e.target.value)}>
            <option value="alle">alle</option>
            {formen.map((f) => <option key={f} value={f}>{FORM_NAME[f]}</option>)}
          </select>
        </label>
        <button type="button" className="knopf" onClick={wuerfeln}>
          <Dices size={20} strokeWidth={2.4} aria-hidden /> {zufall ? "Noch mal würfeln" : "Zufallsspiel"}
        </button>
      </div>

      {zufall && (
        <div className={styles.zufall} role="status" aria-live="polite">
          <p className={styles.zufallTitel}>Heute spielen wir {zufall.name}.</p>
          <p>{zufall.regel}</p>
          <Link href={`/kegelspiele/${zufall.id}`} style={{ fontWeight: 800 }}>Zum Spiel</Link>
        </div>
      )}

      <p className="einleitung">
        leicht: in einem Satz erklärt, Glück spielt mit · mittel: braucht die Tafel oder etwas Taktik · schwer: gezielte Würfe oder viele Sonderregeln
      </p>

      {gefiltert.length === 0 ? (
        <p className="leer blatt">Kein Spiel passt zu diesem Filter.</p>
      ) : (
        <ul className={styles.liste}>
          {gefiltert.map((s) => (
            <li key={s.id}>
              <Link href={`/kegelspiele/${s.id}`} className={`blatt ${styles.karte}`}>
                <span className={styles.kopf}>
                  <strong className={styles.name}>{s.name}</strong>
                  <Schwierigkeit grad={s.schwierigkeit} />
                </span>
                <span className={styles.form}>{FORM_NAME[s.form]}</span>
                <span className={styles.regel}>{s.regel}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
