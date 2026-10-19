import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { mitgliedPflicht } from "@/lib/auth";
import { termine } from "@/lib/daten";
import { datumKurz, nochTage, uhrzeit, wochentagLang } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import styles from "./termine.module.css";

export const metadata: Metadata = { title: "Termine" };

const ART = { kegelabend: "Kegelabend", ausflug: "Ausflug", sonstiges: "Sonstiges" } as const;

export default async function TerminSeite({ searchParams }: { searchParams: Promise<{ ansicht?: string; gespeichert?: string; geloescht?: string }> }) {
  const profil = await mitgliedPflicht();
  const { ansicht, gespeichert, geloescht } = await searchParams;
  const vergangen = ansicht === "vergangen";
  const liste = await termine(vergangen ? "vergangen" : "kommend");
  const istAdmin = profil.rolle === "admin";

  return (
    <>
      <Seitenkopf
        titel="Termine"
        text="Kegelabende, Ausflüge und alles, was sonst ansteht."
        aktion={istAdmin && (
          <Link href="/termine/neu" className="knopf"><Plus size={18} strokeWidth={3} aria-hidden /> Termin anlegen</Link>
        )}
      />
      {gespeichert && <p className="erfolg" role="status">Termin gespeichert.</p>}
      {geloescht && <p className="erfolg" role="status">Termin gelöscht.</p>}

      <div className={styles.reiter} role="tablist" aria-label="Zeitraum">
        <Link href="/termine" role="tab" aria-selected={!vergangen} className={styles.reiterKnopf}>Kommende</Link>
        <Link href="/termine?ansicht=vergangen" role="tab" aria-selected={vergangen} className={styles.reiterKnopf}>Vergangene</Link>
      </div>

      {liste.length === 0 ? (
        <p className="leer blatt">
          {vergangen
            ? "Noch keine vergangenen Termine."
            : "Gerade steht nichts im Kalender. Sobald der Admin einen Termin anlegt, taucht er hier auf."}
        </p>
      ) : (
        <ul className={styles.liste}>
          {liste.map((t) => (
            <li key={t.id} className={`blatt ${styles.karte} ${t.art === "kegelabend" ? styles.kegel : ""}`}>
              <div className={styles.datumBlock}>
                <span className="versal">{wochentagLang(t.datum).slice(0, 2)}</span>
                <strong className="zahl">{datumKurz(t.datum)}</strong>
                <span className={styles.jahr}>{t.datum.slice(0, 4)}</span>
              </div>
              <div className={styles.text}>
                <h2 className={styles.titel}>{t.titel ?? (t.art === "kegelabend" ? "Kegelabend" : ART[t.art])}</h2>
                <p>{[t.titel ? ART[t.art] : null, wochentagLang(t.datum), uhrzeit(t.uhrzeit) && `${uhrzeit(t.uhrzeit)} Uhr`, t.ort, !vergangen && nochTage(t.datum)].filter(Boolean).join(" · ")}</p>
                {t.notiz && <p className={styles.notiz}>{t.notiz}</p>}
              </div>
              {istAdmin && <Link href={`/termine/${t.id}`} className="knopf knopf--hell knopf--klein">Ändern</Link>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
