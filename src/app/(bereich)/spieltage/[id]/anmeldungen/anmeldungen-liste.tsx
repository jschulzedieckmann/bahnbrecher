"use client";

import { useOptimistic, useState, useTransition } from "react";
import { anmeldungSetzen } from "../../aktionen";
import styles from "./anmeldungen.module.css";

type Status = "dabei" | "abgesagt" | null;
const OPTIONEN: { wert: Status; name: string }[] = [
  { wert: "dabei", name: "Dabei" },
  { wert: "abgesagt", name: "Abgesagt" },
  { wert: null, name: "Offen" },
];

export function AnmeldungenListe({
  spieltagId, personen, start,
}: {
  spieltagId: string;
  personen: { id: string; name: string }[];
  start: Record<string, "dabei" | "abgesagt">;
}) {
  const [gespeichert, setGespeichert] = useState<Record<string, Status>>(start);
  const [anzeige, setzeOptimistisch] = useOptimistic(gespeichert, (alt, [id, st]: [string, Status]) => ({ ...alt, [id]: st }));
  const [fehler, setFehler] = useState<string | null>(null);
  const [, starte] = useTransition();

  const waehlen = (id: string, st: Status) => {
    setFehler(null);
    starte(async () => {
      setzeOptimistisch([id, st]);
      try {
        const antwort = await anmeldungSetzen(spieltagId, id, st);
        if (antwort.ok) setGespeichert((g) => ({ ...g, [id]: st }));
        else setFehler("Speichern hat nicht geklappt. Versuch es noch mal.");
      } catch {
        setFehler("Keine Verbindung. Versuch es gleich noch mal.");
      }
    });
  };

  const zaehle = (st: Status) => personen.filter((p) => (anzeige[p.id] ?? null) === st).length;

  return (
    <div className={styles.huelle}>
      <p className={styles.summe} aria-live="polite">
        <strong>{zaehle("dabei")} dabei</strong> · {zaehle("abgesagt")} abgesagt · {zaehle(null)} offen
      </p>
      {fehler && <p className="fehler" role="alert">{fehler}</p>}
      <ul className={`blatt ${styles.liste}`}>
        {personen.map((p) => {
          const aktuell = anzeige[p.id] ?? null;
          return (
            <li key={p.id} className={styles.zeile}>
              <span className={styles.name}>{p.name}</span>
              <div className={styles.umschalter} role="radiogroup" aria-label={`Antwort von ${p.name}`}>
                {OPTIONEN.map((o) => (
                  <button
                    key={o.name}
                    type="button"
                    role="radio"
                    aria-checked={aktuell === o.wert}
                    data-wert={o.wert ?? "offen"}
                    className={styles.option}
                    onClick={() => aktuell !== o.wert && waehlen(p.id, o.wert)}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
