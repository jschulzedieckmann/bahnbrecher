import Link from "next/link";
import { darfErfassen, mitgliedPflicht } from "@/lib/auth";
import {
  auswertung, ergebnisse, gossenjungenVon, letzterGewerteterSpieltag, mitglieder, namensKarte, spieltage, termine, type Termin,
} from "@/lib/daten";
import {
  datumKurz, datumMitJahr, heuteIso, namenListe, nochTage, tageBis, uhrzeit, wochentagKurz,
} from "@/lib/format";
import { Banderole, Rangliste } from "@/components/bausteine";
import styles from "./start.module.css";

const ART_NAME = { kegelabend: "Kegelabend", ausflug: "Ausflug", sonstiges: "Termin" } as const;

export default async function Start({ searchParams }: { searchParams: Promise<{ willkommen?: string }> }) {
  const profil = await mitgliedPflicht();
  const { willkommen } = await searchParams;
  const jahr = Number(heuteIso().slice(0, 4));

  const [kommende, leute, tageJahr, alleTage] = await Promise.all([
    termine("kommend", 6),
    mitglieder(false),
    spieltage(jahr),
    spieltage(),
  ]);
  const letzter = await letzterGewerteterSpieltag(alleTage);
  const erg = await ergebnisse([...new Set([...tageJahr.map((t) => t.id), ...(letzter ? [letzter.id] : [])])]);
  const namen = namensKarte(leute);

  const naechsterKegelabend = kommende.find((t) => t.art === "kegelabend");
  const danach = kommende.filter((t) => t.id !== naechsterKegelabend?.id).slice(0, 2);
  const gj = letzter ? gossenjungenVon(letzter, erg, namen) : null;
  const jahrErg = erg.filter((e) => tageJahr.some((t) => t.id === e.spieltag_id));
  const zeilen = auswertung(tageJahr, jahrErg, leute);
  const letzteErg = letzter ? erg.filter((e) => e.spieltag_id === letzter.id) : [];
  const meisteSiege = letzteErg.reduce((m, e) => Math.max(m, e.siege), 0);

  return (
    <>
      <h1 className="nur-bildschirmleser">Start</h1>
      {willkommen && <p className="erfolg" role="status">Passt. Ab jetzt meldest du dich mit deinem neuen Passwort an.</p>}

      {/* Am Handy eine Spalte in fester Reihenfolge, am PC zwei unabhängige Stapel. */}
      <div className={styles.raster}>
        <div className={styles.spalte}>
          <div className={styles.platzPlakat}>
            <Plakat termin={naechsterKegelabend} kannErfassen={darfErfassen(profil)} />
          </div>

          <div className={styles.platzDanach}>
            <Banderole titel="Danach" farbe="blau" link={{ href: "/termine", text: "Alle Termine" }} id="danach">
              {danach.length === 0 ? (
                <p className="leer">Sonst steht gerade nichts an.</p>
              ) : (
                <ul className={styles.terminListe}>
                  {danach.map((t) => (
                    <li key={t.id}>
                      <span className={styles.terminDatum}>
                        <span className="versal">{wochentagKurz(t.datum)}</span>
                        <strong className="zahl">{datumKurz(t.datum)}</strong>
                      </span>
                      <span>
                        <strong>{t.titel ?? ART_NAME[t.art]}</strong>
                        <span className={styles.notiz}> {[uhrzeit(t.uhrzeit) && `${uhrzeit(t.uhrzeit)} Uhr`, t.ort].filter(Boolean).join(" · ")}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Banderole>
          </div>

          {letzter && (
            <div className={styles.platzLetzter}>
              <Banderole titel="Letzter Spieltag" link={{ href: `/spieltage/${letzter.id}`, text: "Zum Spieltag" }} id="letzter">
                <div className="blatt-inhalt">
                  <p><strong className="zahl">{datumMitJahr(letzter.datum)}</strong> · {letzteErg.length} dabei</p>
                  {meisteSiege > 0 && (
                    <p className={styles.notiz}>
                      Meiste Siege: {namenListe(letzteErg.filter((e) => e.siege === meisteSiege).map((e) => namen.get(e.profil_id) ?? "?"))} ({meisteSiege})
                      {gj && gj.anzahl > 0 && <> · Meiste Gossen: {namenListe(gj.namen)} ({gj.anzahl})</>}
                    </p>
                  )}
                </div>
              </Banderole>
            </div>
          )}
        </div>

        <div className={styles.spalte}>
          <div className={styles.platzGossen}>
            <Banderole titel={gj && gj.namen.length > 1 ? "Amtierende Gossenjungen" : "Amtierender Gossenjunge"} id="gossenjunge">
              <div className="blatt-inhalt">
                {gj && gj.namen.length > 0 && letzter ? (
                  <>
                    <p className={styles.titeltraeger}>
                      <span className="plakatschrift--tinte">{namenListe(gj.namen)}</span>
                      <span className="zahl">{gj.namen.length > 1 ? `je ${gj.anzahl}` : gj.anzahl}</span>
                    </p>
                    <p className={styles.notiz}>
                      {gj.namen.length > 1 ? "Teilen sich den Titel. " : ""}
                      Gossen am {datumKurz(letzter.datum)} Der Titel gilt bis zum nächsten Kegelabend.
                    </p>
                  </>
                ) : (
                  <p className={styles.notiz}>Noch kein Gossenjunge. Der Titel wird nach dem ersten Spieltag mit Gossen vergeben.</p>
                )}
              </div>
            </Banderole>
          </div>

          <div className={styles.platzKoenig}>
            <Banderole titel={`Kegelkönig ${jahr} · Siege`} farbe="blau" link={{ href: "/statistik", text: "Statistik" }} id="kegelkoenig">
              <Rangliste
                eintraege={zeilen.map((z) => ({ id: z.profil_id, name: z.name, wert: z.siege, hervorgehoben: z.profil_id === profil.id })).sort((a, b) => b.wert - a.wert).slice(0, 3)}
                ariaEinheit={(n) => (n === 1 ? "1 Sieg" : `${n} Siege`)}
                leer={`Noch keine Siege in ${jahr}. Der Erste kann noch jeder werden.`}
              />
            </Banderole>
          </div>
        </div>
      </div>
    </>
  );
}

function Plakat({ termin, kannErfassen }: { termin?: Termin; kannErfassen: boolean }) {
  if (!termin) {
    return (
      <section className={`${styles.plakat} ${styles.plakatLeer}`} aria-labelledby="naechster">
        <h2 id="naechster" className="versal">Noch kein Termin</h2>
        <p className={styles.plakatText}>Der nächste Kegelabend steht noch nicht fest. Laut Satzung legen wir ihn gemeinsam fest.</p>
        <Link href="/termine" className="knopf knopf--hell">Zu den Terminen</Link>
      </section>
    );
  }
  const tage = tageBis(termin.datum);
  return (
    <section className={styles.plakat} aria-labelledby="naechster">
      <h2 id="naechster" className="versal">Nächster Kegelabend</h2>
      <p className={`plakatschrift ${styles.datum}`}>
        {wochentagKurz(termin.datum)}, {datumKurz(termin.datum)}
      </p>
      <p className={styles.ort}>
        {[uhrzeit(termin.uhrzeit) && `${uhrzeit(termin.uhrzeit)} Uhr`, termin.ort].filter(Boolean).join(" · ")}
      </p>
      {termin.notiz && <p className={styles.plakatText}>{termin.notiz}</p>}
      <div className={styles.stoerer} role="img" aria-label={nochTage(termin.datum)}>
        {tage === 0 ? (
          <span className={styles.stoererWort}>Heute!</span>
        ) : tage === 1 ? (
          <span className={styles.stoererWort}>Morgen</span>
        ) : (
          <>
            <span className={styles.stoererKlein}>noch</span>
            <span className={styles.stoererZahl}>{tage}</span>
            <span className={styles.stoererKlein}>Tage</span>
          </>
        )}
      </div>
      <div className="knopfreihe">
        {tage === 0 && kannErfassen && <Link href="/spieltage/erfassen" className="knopf">Spieltag erfassen</Link>}
        <Link href="/termine" className="knopf knopf--hell">Zu den Terminen</Link>
      </div>
    </section>
  );
}
