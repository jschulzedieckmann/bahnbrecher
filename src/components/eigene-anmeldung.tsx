"use client";

import { useOptimistic, useState, useTransition } from "react";
import { eigeneAnmeldungSetzen } from "@/app/(bereich)/spieltage/aktionen";
import styles from "./eigene-anmeldung.module.css";

type Status = "dabei" | "abgesagt" | null;
const OPTIONEN: { wert: Status; name: string }[] = [
  { wert: "dabei", name: "Dabei" },
  { wert: "abgesagt", name: "Abgesagt" },
  { wert: null, name: "Offen" },
];

/** Die eigene Antwort zum nächsten Spieltag. Jeder Tipp wird sofort gespeichert. */
export function EigeneAnmeldung({ spieltagId, start }: { spieltagId: string; start: Status }) {
  const [gespeichert, setGespeichert] = useState<Status>(start);
  const [aktuell, setzeOptimistisch] = useOptimistic(gespeichert);
  const [fehler, setFehler] = useState<string | null>(null);
  const [, starte] = useTransition();

  const waehlen = (st: Status) => {
    setFehler(null);
    starte(async () => {
      setzeOptimistisch(st);
      try {
        const antwort = await eigeneAnmeldungSetzen(spieltagId, st);
        if (antwort.ok) setGespeichert(st);
        else setFehler("Speichern hat nicht geklappt. Versuch es noch mal.");
      } catch {
        setFehler("Keine Verbindung. Versuch es gleich noch mal.");
      }
    });
  };

  return (
    <div className={styles.huelle}>
      <p id="eigene-antwort" className={styles.frage}>Bist du dabei?</p>
      <div className={styles.umschalter} role="radiogroup" aria-labelledby="eigene-antwort">
        {OPTIONEN.map((o) => (
          <button
            key={o.name}
            type="button"
            role="radio"
            aria-checked={aktuell === o.wert}
            data-wert={o.wert ?? "offen"}
            className={styles.option}
            onClick={() => aktuell !== o.wert && waehlen(o.wert)}
          >
            {o.name}
          </button>
        ))}
      </div>
      {fehler && <p className="fehler" role="alert">{fehler}</p>}
    </div>
  );
}
