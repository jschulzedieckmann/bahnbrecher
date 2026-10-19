import Link from "next/link";
import styles from "./bausteine.module.css";

export function Seitenkopf({ titel, text, aktion }: { titel: string; text?: React.ReactNode; aktion?: React.ReactNode }) {
  return (
    <div className={styles.seitenkopf}>
      <div>
        <h1 className="seitentitel">{titel}</h1>
        {text && <p className="einleitung">{text}</p>}
      </div>
      {aktion && <div className={styles.seitenkopfAktion}>{aktion}</div>}
    </div>
  );
}

type Farbe = "rot" | "blau";

export function Banderole({
  titel, farbe = "rot", link, children, id,
}: {
  titel: string;
  farbe?: Farbe;
  link?: { href: string; text: string };
  children: React.ReactNode;
  id?: string;
}) {
  const kopfKlasse = farbe === "rot" ? "" : `banderole-kopf--${farbe}`;
  return (
    <section className="blatt" aria-labelledby={id}>
      <h2 className={`banderole-kopf versal ${kopfKlasse}`} id={id}>
        <span>{titel}</span>
        {link && <Link href={link.href}>{link.text}</Link>}
      </h2>
      {children}
    </section>
  );
}

export type RangEintrag = { id: string; name: string; wert: number; hervorgehoben?: boolean };

/** Rangliste mit Balken, deren Länge exakt dem Wert entspricht. Gleiche Werte teilen sich den Platz. */
export function Rangliste({ eintraege, ariaEinheit, leer }: { eintraege: RangEintrag[]; ariaEinheit?: (n: number) => string; leer: string }) {
  const liste = eintraege.filter((e) => e.wert > 0).sort((a, b) => b.wert - a.wert || a.name.localeCompare(b.name));
  if (liste.length === 0) return <p className="leer">{leer}</p>;
  const max = liste[0].wert;
  const plaetze: number[] = [];
  liste.forEach((e, i) => plaetze.push(i > 0 && e.wert === liste[i - 1].wert ? plaetze[i - 1] : i + 1));
  return (
    <ol className={styles.rangliste}>
      {liste.map((e, i) => (
        <li key={e.id} className={e.hervorgehoben ? styles.rangHervor : undefined} aria-label={`${plaetze[i]}. ${e.name}: ${ariaEinheit ? ariaEinheit(e.wert) : e.wert}`}>
          <span className={styles.rangPlatz}>{plaetze[i]}.</span>
          <span className={styles.rangName}>{e.name}</span>
          <span className={styles.rangBalkenSpur} aria-hidden>
            <span className={styles.rangBalken} style={{ width: `${(e.wert / max) * 100}%` }} />
          </span>
          <span className={`zahl ${styles.rangWert}`}>{e.wert}</span>
        </li>
      ))}
    </ol>
  );
}

export function NichtErfasst() {
  return <span className="nicht-erfasst" title="an diesem Abend nicht gezählt">?</span>;
}
