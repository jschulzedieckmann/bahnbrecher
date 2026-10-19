import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { darfErfassen, mitgliedPflicht } from "@/lib/auth";
import { ergebnisse, gossenjungenVon, mitglieder, naechsterSpieltag, namensKarte, spieltage, verfuegbareJahre } from "@/lib/daten";
import { datumKurz, heuteIso, namenListe, nochTage, tageBis, uhrzeit, wochentagKurz, wochentagLang } from "@/lib/format";
import { NichtErfasst, Seitenkopf } from "@/components/bausteine";
import { JahrWahl } from "@/components/jahr-wahl";
import styles from "./spieltage.module.css";

export const metadata: Metadata = { title: "Spieltage" };

export default async function Spieltage({ searchParams }: { searchParams: Promise<{ jahr?: string }> }) {
  const profil = await mitgliedPflicht();
  const { jahr: jahrParam } = await searchParams;
  const jahre = await verfuegbareJahre();
  const jahr = Number(jahrParam) || Number(heuteIso().slice(0, 4));
  const [alleImJahr, leute, naechster] = await Promise.all([spieltage(jahr), mitglieder(false), naechsterSpieltag()]);
  const erg = await ergebnisse(alleImJahr.map((t) => t.id));
  // Gespielt: jemand ist eingetragen oder der Abend liegt zurück. Geplant: ab heute und noch leer.
  const heute = heuteIso();
  const hatErgebnis = (id: string) => erg.some((e) => e.spieltag_id === id);
  const tage = alleImJahr.filter((t) => hatErgebnis(t.id) || t.datum < heute);
  const naechsterOhneErgebnis = naechster && !hatErgebnis(naechster.id) ? naechster : null;
  const spaeterGeplant = alleImJahr
    .filter((t) => t.datum >= heute && !hatErgebnis(t.id) && t.id !== naechsterOhneErgebnis?.id)
    .sort((a, b) => a.datum.localeCompare(b.datum));
  const kannErfassen = darfErfassen(profil);
  const namen = namensKarte(leute);

  // Alle Karten im selben Maßstab: Die Balken beziehen sich auf das Maximum des ganzen Jahres.
  const maxDabei = Math.max(1, ...tage.map((t) => erg.filter((e) => e.spieltag_id === t.id).length));
  const maxGossen = Math.max(1, ...erg.map((e) => e.gossen));

  return (
    <>
      <Seitenkopf
        titel="Spieltage"
        text="Der nächste Kegelabend und alle gespielten Abende, der neueste oben."
        aktion={
          <>
            <JahrWahl jahre={jahre} jahr={jahr} pfad="/spieltage" />
            {kannErfassen && !naechster && (
              <Link href="/spieltage/planen" className="knopf"><Plus size={18} strokeWidth={3} aria-hidden /> Spieltag planen</Link>
            )}
            {kannErfassen && <Link href="/spieltage/erfassen" className="knopf knopf--hell">Abend nachtragen</Link>}
          </>
        }
      />

      {naechsterOhneErgebnis ? (
        <section className={`blatt ${styles.geplant}`} aria-labelledby="geplant">
          <h2 id="geplant" className="banderole-kopf versal banderole-kopf--blau">
            <span>Nächster Spieltag</span>
            <span className={styles.geplantFrist}>{nochTage(naechsterOhneErgebnis.datum)}</span>
          </h2>
          <div className="blatt-inhalt">
            <p className={styles.geplantDatum}>{wochentagLang(naechsterOhneErgebnis.datum)}, {datumKurz(naechsterOhneErgebnis.datum)}</p>
            <p>{[uhrzeit(naechsterOhneErgebnis.uhrzeit) && `${uhrzeit(naechsterOhneErgebnis.uhrzeit)} Uhr`, naechsterOhneErgebnis.ort].filter(Boolean).join(" · ") || "Ort und Uhrzeit folgen"}</p>
            {naechsterOhneErgebnis.notiz && <p className="einleitung">{naechsterOhneErgebnis.notiz}</p>}
            {spaeterGeplant.length > 0 && (
              <p className="einleitung">
                Danach geplant:{" "}
                {spaeterGeplant.map((t, i) => (
                  <span key={t.id}>
                    <Link href={`/spieltage/${t.id}`}>{wochentagKurz(t.datum)}, {datumKurz(t.datum)}</Link>
                    {i < spaeterGeplant.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
            {kannErfassen && (
              <div className="knopfreihe" style={{ marginTop: 12 }}>
                {tageBis(naechsterOhneErgebnis.datum) === 0 && (
                  <Link href={`/spieltage/${naechsterOhneErgebnis.id}/erfassen`} className="knopf">Ergebnisse erfassen</Link>
                )}
                <Link href={`/spieltage/${naechsterOhneErgebnis.id}/planen`} className="knopf knopf--hell">Ändern</Link>
              </div>
            )}
          </div>
        </section>
      ) : !naechster && (
        <p className="leer blatt">Der nächste Kegelabend ist noch nicht geplant.</p>
      )}
      {tage.length === 0 ? (
        <p className="leer blatt">Noch keine gespielten Abende in {jahr}.</p>
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
