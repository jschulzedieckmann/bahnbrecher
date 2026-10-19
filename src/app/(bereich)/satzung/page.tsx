import type { Metadata } from "next";
import { mitgliedPflicht } from "@/lib/auth";
import { satzung } from "@/lib/satzung";
import styles from "./satzung.module.css";

export const metadata: Metadata = { title: "Satzung" };

/** Fettdruck aus **…** in der Satzung übernehmen. */
function mitFett(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((teil, i) =>
    teil.startsWith("**") ? <strong key={i}>{teil.slice(2, -2)}</strong> : teil,
  );
}

export default async function Satzung() {
  await mitgliedPflicht();
  const { titel, paragraphen } = satzung();
  return (
    <article className={styles.satzung}>
      <h1 className="seitentitel">{titel}</h1>
      {paragraphen.map((p) => (
        <section key={p.titel} className={styles.paragraph}>
          <h2>{p.titel}</h2>
          {p.absaetze.map((a, i) => <p key={i}>{mitFett(a)}</p>)}
          {p.punkte.length > 0 && (
            <ul>
              {p.punkte.map((punkt, i) => <li key={i}>{mitFett(punkt)}</li>)}
            </ul>
          )}
        </section>
      ))}
      <p className={styles.fuss}>
        Änderungen beschließen wir mit einfacher Mehrheit. Wer eine neue Regel vorschlägt, spendiert eine Runde (§ 7).
      </p>
    </article>
  );
}
