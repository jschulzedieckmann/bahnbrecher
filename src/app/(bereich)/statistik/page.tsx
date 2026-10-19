import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { mitgliedPflicht } from "@/lib/auth";
import { auswertung, ergebnisse, mitglieder, spieltage, verfuegbareJahre, WERT_NAME, WERTE, type Wert, type Zeile } from "@/lib/daten";
import { datumKurz, heuteIso, namenListe } from "@/lib/format";
import { Banderole, NichtErfasst, Rangliste, Seitenkopf } from "@/components/bausteine";
import { JahrWahl } from "@/components/jahr-wahl";
import tabelle from "@/components/tabelle.module.css";
import styles from "./statistik.module.css";

export const metadata: Metadata = { title: "Statistik" };

const SPALTEN: { key: keyof Zeile; name: string }[] = [
  { key: "dabei", name: "dabei" },
  ...WERTE.map((w) => ({ key: w as keyof Zeile, name: WERT_NAME[w] })),
];

export default async function Statistik({ searchParams }: { searchParams: Promise<{ jahr?: string; spieler?: string; sort?: string }> }) {
  const profil = await mitgliedPflicht();
  const sp = await searchParams;
  const aktuellesJahr = Number(heuteIso().slice(0, 4));
  const jahr = Number(sp.jahr) || aktuellesJahr;
  const [jahre, alleTage, leute] = await Promise.all([verfuegbareJahre(), spieltage(jahr), mitglieder(false)]);
  const erg = await ergebnisse(alleTage.map((t) => t.id));
  // Nur gespielte Abende zählen, geplante ohne Ergebnisse bleiben draußen.
  const tage = alleTage.filter((t) => erg.some((e) => e.spieltag_id === t.id) || t.datum < heuteIso());
  const zeilen = auswertung(tage, erg, leute);
  const markiert = sp.spieler ?? profil.id;
  const sortKey = (SPALTEN.find((s) => s.key === sp.sort)?.key ?? "siege") as keyof Zeile;
  const sortiert = [...zeilen].sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]) || a.name.localeCompare(b.name));

  const spitze = (w: Wert) => {
    const max = Math.max(0, ...zeilen.map((z) => z[w]));
    return { max, namen: zeilen.filter((z) => z[w] === max && max > 0).map((z) => z.name) };
  };
  const koenig = spitze("siege");
  const neune = spitze("alle_neune");
  const gossen = spitze("gossen");
  const ohneGossen = tage.filter((t) => !t.gossen_erfasst);
  const pudelGezaehlt = tage.some((t) => t.pudel_erfasst);
  const url = (extra: Record<string, string>) => `/statistik?${new URLSearchParams({ jahr: String(jahr), ...(sp.spieler ? { spieler: sp.spieler } : {}), ...(sp.sort ? { sort: sp.sort } : {}), ...extra })}`;

  return (
    <>
      <Seitenkopf titel="Statistik" aktion={<JahrWahl jahre={jahre} jahr={jahr} pfad="/statistik" />} />

      {tage.length === 0 ? (
        <p className="leer blatt">Für {jahr} gibt es noch keine Ergebnisse.</p>
      ) : (
        <>
          <section className={styles.kennzahlen} aria-label="Kennzahlen">
            <div className={styles.koenig}>
              <h2 className="versal">{`Kegelkönig ${jahr}`}</h2>
              <p className="plakatschrift">{koenig.namen.length ? namenListe(koenig.namen) : "noch offen"}</p>
              <p className={styles.kleiner}>
                {koenig.max > 0 && <>{koenig.namen.length > 1 ? "je " : ""}{koenig.max} {koenig.max === 1 ? "Sieg" : "Siege"}. </>}
                {jahr === aktuellesJahr && <>Stand nach {tage.length} {tage.length === 1 ? "Spieltag" : "Spieltagen"}. Entschieden wird am Jahresende.</>}
              </p>
            </div>
            <dl className={styles.eckdaten}>
              <div><dt>Meiste alle Neune</dt><dd>{neune.namen.length ? <>{namenListe(neune.namen)} <span className="zahl">({neune.max})</span></> : "noch keine"}</dd></div>
              <div><dt>Gossenjunge {jahr}</dt><dd>{gossen.namen.length ? <>{namenListe(gossen.namen)} <span className="zahl">({gossen.max})</span></> : "noch keine"}</dd></div>
              <div><dt>Spieltage</dt><dd className="zahl">{tage.length}</dd></div>
            </dl>
          </section>

          <div className={styles.ranglisten}>
            {WERTE.map((w) => (
              <Banderole key={w} titel={WERT_NAME[w]} farbe={w === "gossen" ? "rot" : "blau"} id={`rang-${w}`}>
                {w === "pudel" && !pudelGezaehlt ? (
                  <p className="leer">Pudel werden noch nicht gezählt.</p>
                ) : (
                  <Rangliste
                    eintraege={zeilen.map((z) => ({ id: z.profil_id, name: z.name, wert: z[w], hervorgehoben: z.profil_id === markiert }))}
                    leer={`Noch keine ${WERT_NAME[w]} in ${jahr}.`}
                  />
                )}
                {w === "gossen" && ohneGossen.length > 0 && (
                  <p className={styles.fussnote}>
                    <NichtErfasst /> Am {namenListe(ohneGossen.map((t) => datumKurz(t.datum)))} wurden keine Gossen gezählt.
                  </p>
                )}
              </Banderole>
            ))}
          </div>

          <section className="blatt" aria-labelledby="alle-zahlen">
            <h2 id="alle-zahlen" className="banderole-kopf versal banderole-kopf--blau">
              <span>Alle Zahlen</span>
              <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>Name antippen hebt hervor</span>
            </h2>
            <p className={tabelle.wischHinweis}>Seitlich wischen für alle Spalten</p>
            <div className={tabelle.huelle}>
              <table className={`${tabelle.tabelle} ${tabelle.ersteSpalteFest}`}>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    {SPALTEN.map((s) => (
                      <th key={s.key} scope="col" className="zahl" aria-sort={sortKey === s.key ? "descending" : undefined}>
                        <Link href={url({ sort: s.key })} className={tabelle.sortierKnopf}>
                          {s.name}{sortKey === s.key && <ChevronDown size={14} strokeWidth={3} aria-hidden />}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortiert.map((z) => (
                    <tr key={z.profil_id} className={z.profil_id === markiert ? tabelle.eigene : undefined}>
                      <th scope="row"><Link href={url({ spieler: z.profil_id })}>{z.name}</Link></th>
                      {SPALTEN.map((s) => (
                        <td key={s.key} className="zahl">
                          {s.key === "pudel" && !pudelGezaehlt ? <NichtErfasst /> : z[s.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <p className={styles.schluss}>Die Leistung ist nebensächlich. Steht so in § 1.</p>
    </>
  );
}
