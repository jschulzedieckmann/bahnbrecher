import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { darfErfassen, mitgliedPflicht } from "@/lib/auth";
import { ergebnisse, gossenjungenVon, mitglieder, namensKarte, spieltage, verfuegbareJahre } from "@/lib/daten";
import { datumKurz, heuteIso, namenListe, wochentagKurz } from "@/lib/format";
import { NichtErfasst, Seitenkopf } from "@/components/bausteine";
import { JahrWahl } from "@/components/jahr-wahl";
import styles from "./spieltage.module.css";

export const metadata: Metadata = { title: "Spieltage" };

export default async function Spieltage({ searchParams }: { searchParams: Promise<{ jahr?: string }> }) {
  const profil = await mitgliedPflicht();
  const { jahr: jahrParam } = await searchParams;
  const jahre = await verfuegbareJahre();
  const jahr = Number(jahrParam) || Number(heuteIso().slice(0, 4));
  const [tage, leute] = await Promise.all([spieltage(jahr), mitglieder(false)]);
  const erg = await ergebnisse(tage.map((t) => t.id));
  const namen = namensKarte(leute);

  // Alle Karten im selben Maßstab: Die Balken beziehen sich auf das Maximum des ganzen Jahres.
  const maxDabei = Math.max(1, ...tage.map((t) => erg.filter((e) => e.spieltag_id === t.id).length));
  const maxGossen = Math.max(1, ...erg.map((e) => e.gossen));

  return (
    <>
      <Seitenkopf
        titel="Spieltage"
        text="Alle Kegelabende mit Ergebnissen, der neueste oben."
        aktion={
          <>
            <JahrWahl jahre={jahre} jahr={jahr} pfad="/spieltage" />
            {darfErfassen(profil) && (
              <Link href="/spieltage/erfassen" className="knopf"><Plus size={18} strokeWidth={3} aria-hidden /> Spieltag erfassen</Link>
            )}
          </>
        }
      />
      {tage.length === 0 ? (
        <p className="leer blatt">Noch keine Spieltage in {jahr}. Der erste wird am nächsten Kegelabend erfasst.</p>
      ) : (
        <ul className={styles.karten}>
          {tage.map((t) => {
            const eigene = erg.filter((e) => e.spieltag_id === t.id);
            const gj = gossenjungenVon(t, erg, namen);
            const siege = eigene.reduce((s, e) => s + e.siege, 0);
            return (
              <li key={t.id}>
                <Link href={`/spieltage/${t.id}`} className={`blatt ${styles.karte}`}>
                  <span className={styles.kartenKopf}>
                    <span className="versal">{wochentagKurz(t.datum)}</span>
                    <strong className="zahl">{datumKurz(t.datum)}</strong>
                    {!t.abgeschlossen && <span className={styles.offen}>offen</span>}
                  </span>
                  <span className={styles.messung}>
                    <span>Dabei</span>
                    <span className={styles.spur}><span style={{ width: `${(eigene.length / maxDabei) * 100}%` }} /></span>
                    <strong className="zahl">{eigene.length}</strong>
                  </span>
                  <span className={styles.messung}>
                    <span>Gossenjunge</span>
                    {t.gossen_erfasst ? (
                      <>
                        <span className={`${styles.spur} ${styles.spurRot}`}><span style={{ width: `${(gj.anzahl / maxGossen) * 100}%` }} /></span>
                        <strong className="zahl">{gj.anzahl}</strong>
                      </>
                    ) : (
                      <span className={styles.ungezaehlt}><NichtErfasst /> nicht erfasst</span>
                    )}
                  </span>
                  <span className={styles.fuss}>
                    {gj.namen.length > 0 ? namenListe(gj.namen) : "kein Gossenjunge"} · {siege} {siege === 1 ? "Sieg" : "Siege"} verteilt
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
