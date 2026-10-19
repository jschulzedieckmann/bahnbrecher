import type { Metadata } from "next";
import { anzeigename, mitgliedPflicht } from "@/lib/auth";
import { auswertung, ergebnisse, gossenjungenVon, letzterGewerteterSpieltag, mitglieder, namensKarte, spieltage } from "@/lib/daten";
import { heuteIso, monatJahr } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import styles from "./mitglieder.module.css";

export const metadata: Metadata = { title: "Mitglieder" };

const ROLLE = { admin: "Admin", schriftfuehrer: "Schriftführer", mitglied: null } as const;

export default async function Mitglieder() {
  const profil = await mitgliedPflicht();
  const jahr = Number(heuteIso().slice(0, 4));
  const [leute, tageJahr, alleTage] = await Promise.all([mitglieder(false), spieltage(jahr), spieltage()]);
  const aktive = leute.filter((m) => m.aktiv);
  const letzter = await letzterGewerteterSpieltag(alleTage);
  const erg = await ergebnisse([...new Set([...tageJahr.map((t) => t.id), ...(letzter ? [letzter.id] : [])])]);
  const zeilen = new Map(auswertung(tageJahr, erg.filter((e) => tageJahr.some((t) => t.id === e.spieltag_id)), leute).map((z) => [z.profil_id, z]));
  const gj = letzter ? gossenjungenVon(letzter, erg, namensKarte(leute)) : null;
  const gossenjungenIds = new Set(
    letzter && gj && gj.anzahl > 0 ? erg.filter((e) => e.spieltag_id === letzter.id && e.gossen === gj.anzahl).map((e) => e.profil_id) : [],
  );

  return (
    <>
      <Seitenkopf titel="Mitglieder" text="Wer bei den Bahnbrechern dabei ist." />
      {aktive.length === 0 ? (
        <p className="leer blatt">Noch keine Mitglieder angelegt.</p>
      ) : (
        <ul className={styles.liste}>
          {aktive.map((m) => {
            const z = zeilen.get(m.id);
            return (
              <li key={m.id} className={`blatt ${styles.karte} ${m.id === profil.id ? styles.ich : ""}`}>
                <span className={styles.monogramm} aria-hidden>{m.vorname.slice(0, 1)}</span>
                <div className={styles.text}>
                  <p className={styles.name}>{anzeigename(m)}</p>
                  <p className={styles.zeile}>
                    {ROLLE[m.rolle] && <span className={styles.rolle}>{ROLLE[m.rolle]}</span>}
                    {m.dabei_seit && <span>dabei seit {monatJahr(m.dabei_seit)}</span>}
                  </p>
                  <p className={`zahl ${styles.werte}`}>
                    {z?.siege ?? 0} {z?.siege === 1 ? "Sieg" : "Siege"} · {z?.alle_neune ?? 0} alle Neune in {jahr}
                  </p>
                </div>
                {gossenjungenIds.has(m.id) && <span className={styles.abzeichen}>Gossenjunge</span>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
