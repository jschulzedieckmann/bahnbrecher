import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { anzeigename, darfErfassen, mitgliedPflicht } from "@/lib/auth";
import { ergebnisse, gossenjungenVon, mitglieder, namensKarte, spieltag as spieltagLaden, WERT_NAME, WERTE } from "@/lib/daten";
import { datumMitJahr, heuteIso, namenListe, uhrzeit } from "@/lib/format";
import { NichtErfasst, Seitenkopf } from "@/components/bausteine";
import styles from "@/components/tabelle.module.css";

export const metadata: Metadata = { title: "Spieltag" };

export default async function SpieltagSeite({ params }: { params: Promise<{ id: string }> }) {
  const profil = await mitgliedPflicht();
  const { id } = await params;
  const tag = await spieltagLaden(id);
  if (!tag) notFound();
  const [erg, leute] = await Promise.all([ergebnisse([tag.id]), mitglieder(false)]);
  const namen = namensKarte(leute);
  const gj = gossenjungenVon(tag, erg, namen);
  const dabeiIds = new Set(erg.map((e) => e.profil_id));
  const nichtDabei = leute.filter((m) => m.aktiv && !dabeiIds.has(m.id));
  const zeilen = [...erg].sort((a, b) => b.siege - a.siege || (namen.get(a.profil_id) ?? "").localeCompare(namen.get(b.profil_id) ?? ""));
  const erfasst = (w: (typeof WERTE)[number]) => (w === "gossen" ? tag.gossen_erfasst : w === "pudel" ? tag.pudel_erfasst : true);
  const fehltEtwas = !tag.gossen_erfasst || !tag.pudel_erfasst;

  return (
    <>
      <Seitenkopf
        titel={`Spieltag vom ${datumMitJahr(tag.datum)}`}
        text={<>{erg.length} Bahnbrecher dabei{gj.namen.length > 0 && <> · Gossenjunge: {namenListe(gj.namen)}</>}</>}
        aktion={darfErfassen(profil) && (
          <>
            <Link href={`/spieltage/${tag.id}/erfassen`} className="knopf">{erg.length ? "Ergebnisse bearbeiten" : "Ergebnisse erfassen"}</Link>
            <Link href={`/spieltage/${tag.id}/planen`} className="knopf knopf--hell">Datum und Ort</Link>
          </>
        )}
      />

      {erg.length === 0 ? (
        <p className="leer blatt">
          {tag.datum >= heuteIso() ? "Geplant: " : ""}
          {[uhrzeit(tag.uhrzeit) && `${uhrzeit(tag.uhrzeit)} Uhr`, tag.ort].filter(Boolean).join(" · ") || "Ort und Uhrzeit folgen"}.
          {" "}Ergebnisse gibt es noch keine.
        </p>
      ) : (
        <div className={`blatt ${styles.huelle}`}>
          <table className={styles.tabelle}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                {WERTE.map((w) => <th key={w} scope="col" className="zahl">{WERT_NAME[w]}</th>)}
              </tr>
            </thead>
            <tbody>
              {zeilen.map((e) => (
                <tr key={e.profil_id} className={e.profil_id === profil.id ? styles.eigene : undefined}>
                  <th scope="row">{namen.get(e.profil_id)}</th>
                  {WERTE.map((w) => (
                    <td key={w} className="zahl">
                      {erfasst(w) ? (
                        <span className={w === "gossen" && gj.anzahl > 0 && e.gossen === gj.anzahl ? styles.spitze : undefined}>{e[w]}</span>
                      ) : <NichtErfasst />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fehltEtwas && <p className="einleitung"><NichtErfasst /> heißt: an diesem Abend nicht gezählt.</p>}

      {nichtDabei.length > 0 && (
        <p className="einleitung">
          Nicht dabei:{" "}
          {nichtDabei.map((m, i) => (
            <span key={m.id}>
              <span className="nicht-dabei">{anzeigename(m)}</span>
              {i < nichtDabei.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      )}

      <Link href="/spieltage" style={{ fontWeight: 700 }}>Alle Spieltage</Link>
    </>
  );
}
