"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, X } from "lucide-react";
import type { Ergebnis } from "@/lib/daten";
import { ergebnisseSpeichern, type ErfassteZeile } from "../../aktionen";
import styles from "./erfassung.module.css";

const WERTE = [
  { key: "siege", name: "Siege" },
  { key: "alle_neune", name: "alle Neune" },
  { key: "kranz", name: "Kranz" },
  { key: "gossen", name: "Gossen" },
  { key: "pudel", name: "Pudel" },
] as const;
type Key = (typeof WERTE)[number]["key"];
type Zahlen = Record<Key, number>;
const NULL: Zahlen = { siege: 0, alle_neune: 0, kranz: 0, gossen: 0, pudel: 0 };

type Entwurf = { dabei: string[]; zahlen: Record<string, Zahlen>; gossen: boolean; pudel: boolean };

function speicherSchluessel(id: string) {
  return `bahnbrecher-entwurf-${id}`;
}

// Gerätespeicher als externe Quelle. Klappt er nicht (privates Fenster), geht es ohne.
function abonnieren(neu: () => void) {
  window.addEventListener("storage", neu);
  window.addEventListener("bahnbrecher-lokal", neu);
  return () => {
    window.removeEventListener("storage", neu);
    window.removeEventListener("bahnbrecher-lokal", neu);
  };
}
function lokalLesen(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lokalSchreiben(key: string, wert: string | null) {
  try {
    if (wert === null) localStorage.removeItem(key);
    else localStorage.setItem(key, wert);
    window.dispatchEvent(new Event("bahnbrecher-lokal"));
  } catch {}
}
function useLokal(key: string) {
  return useSyncExternalStore(abonnieren, () => lokalLesen(key), () => null);
}

export function Erfassung({
  spieltagId, datum, personen, vorhanden, gossenErfasst, pudelErfasst, abgeschlossen,
}: {
  spieltagId: string;
  datum: string;
  personen: { id: string; name: string }[];
  vorhanden: Ergebnis[];
  gossenErfasst: boolean;
  pudelErfasst: boolean;
  abgeschlossen: boolean;
}) {
  const router = useRouter();
  const start: Entwurf = useMemo(() => ({
    dabei: vorhanden.map((e) => e.profil_id),
    zahlen: Object.fromEntries(vorhanden.map((e) => [e.profil_id, { siege: e.siege, alle_neune: e.alle_neune, kranz: e.kranz, gossen: e.gossen, pudel: e.pudel }])),
    gossen: gossenErfasst,
    pudel: pudelErfasst,
  }), [vorhanden, gossenErfasst, pudelErfasst]);

  const [entwurf, setEntwurf] = useState<Entwurf>(start);
  const [schritt, setSchritt] = useState<1 | 2>(vorhanden.length > 0 ? 2 : 1);
  const [meldung, setMeldung] = useState<{ art: "ok" | "fehler"; text: string } | null>(null);
  const [abschlussFrage, setAbschlussFrage] = useState(false);
  const [laeuft, starte] = useTransition();
  const hinweisWeg = useLokal(`bahnbrecher-hinweis-${datum}`) === "weg";
  const gesicherterEntwurf = useLokal(speicherSchluessel(spieltagId));
  const [veraendert, setVeraendert] = useState(false);
  const entwurfAnbieten = !veraendert && gesicherterEntwurf !== null && gesicherterEntwurf !== JSON.stringify(start);

  // Jede Änderung wird auf dem Gerät gesichert, damit bei Funkloch nichts verloren geht.
  useEffect(() => {
    if (veraendert) {
      try { localStorage.setItem(speicherSchluessel(spieltagId), JSON.stringify(entwurf)); } catch {}
    }
  }, [entwurf, veraendert, spieltagId]);

  const umschalten = (id: string) => {
    setVeraendert(true);
    setEntwurf((e) => ({
      ...e,
      dabei: e.dabei.includes(id) ? e.dabei.filter((x) => x !== id) : [...e.dabei, id],
      zahlen: e.zahlen[id] ? e.zahlen : { ...e.zahlen, [id]: { ...NULL } },
    }));
  };

  const aendern = (id: string, key: Key, delta: number) => {
    setVeraendert(true);
    setEntwurf((e) => {
      const alt = e.zahlen[id] ?? NULL;
      return { ...e, zahlen: { ...e.zahlen, [id]: { ...alt, [key]: Math.max(0, alt[key] + delta) } } };
    });
  };

  const sichtbareWerte = WERTE.filter((w) => (w.key === "gossen" ? entwurf.gossen : w.key === "pudel" ? entwurf.pudel : true));
  const dabeiPersonen = personen.filter((p) => entwurf.dabei.includes(p.id));

  const maxGossen = entwurf.gossen ? Math.max(0, ...dabeiPersonen.map((p) => entwurf.zahlen[p.id]?.gossen ?? 0)) : 0;

  function speichern(abschliessen: boolean) {
    setMeldung(null);
    const zeilen: ErfassteZeile[] = dabeiPersonen.map((p) => ({ profil_id: p.id, ...(entwurf.zahlen[p.id] ?? NULL) }));
    starte(async () => {
      try {
        const antwort = await ergebnisseSpeichern({
          spieltagId, zeilen, gossenErfasst: entwurf.gossen, pudelErfasst: entwurf.pudel, abschliessen,
        });
        if (!antwort.ok) {
          setMeldung({ art: "fehler", text: antwort.fehler ?? "Speichern hat nicht geklappt." });
          return;
        }
        lokalSchreiben(speicherSchluessel(spieltagId), null);
        setVeraendert(false);
        if (abschliessen) {
          const namen = dabeiPersonen.filter((p) => maxGossen > 0 && entwurf.zahlen[p.id]?.gossen === maxGossen).map((p) => p.name);
          router.push(`/spieltage/${spieltagId}`);
          setMeldung({ art: "ok", text: namen.length ? `Spieltag gespeichert. Meiste Gossen heute: ${namen.join(" und ")}.` : "Spieltag gespeichert." });
        } else {
          setMeldung({ art: "ok", text: "Gespeichert." });
          router.refresh();
        }
      } catch {
        setMeldung({ art: "fehler", text: "Keine Verbindung. Deine Eingaben sind auf diesem Handy gesichert. Versuch es gleich noch mal." });
      }
    });
  }

  return (
    <div className={styles.erfassung}>
      {!hinweisWeg && (
        <div className={styles.hinweis} role="note">
          <p>Handy raus ist heute erlaubt. Du bist Schriftführer. § 3 gilt für dich nicht.</p>
          <button
            type="button"
            className={styles.hinweisZu}
            aria-label="Hinweis schließen"
            onClick={() => lokalSchreiben(`bahnbrecher-hinweis-${datum}`, "weg")}
          >
            <X size={18} strokeWidth={3} aria-hidden />
          </button>
        </div>
      )}

      {entwurfAnbieten && (
        <div className={styles.hinweis} role="status">
          <p>Auf diesem Handy gibt es noch nicht gespeicherte Eingaben für diesen Abend.</p>
          <div className="knopfreihe" style={{ marginLeft: "auto" }}>
            <button type="button" className="knopf knopf--klein" onClick={() => {
              try { setEntwurf(JSON.parse(gesicherterEntwurf!)); setVeraendert(true); setSchritt(2); } catch {}
            }}>Übernehmen</button>
            <button type="button" className="knopf knopf--hell knopf--klein" onClick={() => lokalSchreiben(speicherSchluessel(spieltagId), null)}>Verwerfen</button>
          </div>
        </div>
      )}

      <ol className={styles.schritte} aria-label="Schritte">
        <li aria-current={schritt === 1 ? "step" : undefined}><button type="button" onClick={() => setSchritt(1)}>1 · Wer ist dabei?</button></li>
        <li aria-current={schritt === 2 ? "step" : undefined}><button type="button" onClick={() => entwurf.dabei.length && setSchritt(2)} disabled={!entwurf.dabei.length}>2 · Ergebnisse</button></li>
      </ol>

      {schritt === 1 ? (
        <section className="blatt" aria-labelledby="wer">
          <h2 id="wer" className="banderole-kopf versal">Wer ist dabei?</h2>
          <p className="blatt-inhalt" style={{ paddingBottom: 0 }}>Tipp alle an, die heute kegeln.</p>
          <ul className={styles.personen}>
            {personen.map((p) => {
              const an = entwurf.dabei.includes(p.id);
              return (
                <li key={p.id}>
                  <button type="button" className={styles.person} aria-pressed={an} onClick={() => umschalten(p.id)}>
                    <span className={styles.haken} aria-hidden>{an && <Check size={18} strokeWidth={3.5} />}</span>
                    <span>{p.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="blatt-inhalt">
            {entwurf.dabei.length === 0 && <p className="hinweis" role="status" style={{ marginBottom: 10 }}>Wähl mindestens eine Person aus.</p>}
            <button type="button" className="knopf" disabled={!entwurf.dabei.length} onClick={() => setSchritt(2)}>
              Weiter ({entwurf.dabei.length} dabei)
            </button>
          </div>
        </section>
      ) : (
        <section aria-labelledby="ergebnisse" className={styles.ergebnisse}>
          <h2 id="ergebnisse" className="nur-bildschirmleser">Ergebnisse</h2>
          <div className={styles.schalter}>
            <label><input type="checkbox" checked={entwurf.gossen} onChange={(e) => { setVeraendert(true); setEntwurf({ ...entwurf, gossen: e.target.checked }); }} /> Gossen werden gezählt</label>
            <label><input type="checkbox" checked={entwurf.pudel} onChange={(e) => { setVeraendert(true); setEntwurf({ ...entwurf, pudel: e.target.checked }); }} /> Pudel werden gezählt</label>
          </div>
          <p className="einleitung">Du kannst jederzeit speichern und später weitermachen.</p>

          <ul className={styles.zeilen}>
            {dabeiPersonen.map((p) => {
              const z = entwurf.zahlen[p.id] ?? NULL;
              const gossenjunge = maxGossen > 0 && z.gossen === maxGossen;
              return (
                <li key={p.id} className={`blatt ${styles.zeile}`}>
                  <h3 className={styles.zeilenName}>
                    {p.name}
                    {gossenjunge && <span className={styles.titel}>Meiste Gossen</span>}
                  </h3>
                  <div className={styles.zaehlerReihe}>
                    {sichtbareWerte.map((w) => (
                      <div key={w.key} className={styles.zaehler}>
                        <span className={styles.zaehlerName}>{w.name}</span>
                        <div className={styles.zaehlerKnoepfe}>
                          <button type="button" aria-label={`${w.name} von ${p.name} weniger`} onClick={() => aendern(p.id, w.key, -1)} disabled={z[w.key] === 0}>
                            <Minus size={20} strokeWidth={3} aria-hidden />
                          </button>
                          <output aria-live="polite" aria-label={`${w.name} ${p.name}`} className="zahl">{z[w.key]}</output>
                          <button type="button" aria-label={`${w.name} von ${p.name} mehr`} onClick={() => aendern(p.id, w.key, 1)} className={styles.plus}>
                            <Plus size={20} strokeWidth={3} aria-hidden />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>

          {meldung && <p className={meldung.art === "ok" ? "erfolg" : "fehler"} role={meldung.art === "ok" ? "status" : "alert"}>{meldung.text}</p>}

          {abschlussFrage ? (
            <div className="blatt blatt-inhalt" role="alertdialog" aria-label="Spieltag abschließen" style={{ display: "grid", gap: 12 }}>
              <p style={{ fontWeight: 700 }}>Spieltag abschließen? Ändern kannst du die Zahlen trotzdem noch.</p>
              <div className="knopfreihe">
                <button type="button" className="knopf" onClick={() => speichern(true)} disabled={laeuft}>Abschließen</button>
                <button type="button" className="knopf knopf--hell" onClick={() => setAbschlussFrage(false)}>Weiter erfassen</button>
              </div>
            </div>
          ) : (
            <div className={`knopfreihe ${styles.aktionen}`}>
              <button type="button" className="knopf knopf--hell" onClick={() => speichern(false)} disabled={laeuft}>
                {laeuft ? "Kugel rollt …" : "Zwischenspeichern"}
              </button>
              <button type="button" className="knopf" onClick={() => setAbschlussFrage(true)} disabled={laeuft}>
                {abgeschlossen ? "Änderungen speichern" : "Spieltag abschließen"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
