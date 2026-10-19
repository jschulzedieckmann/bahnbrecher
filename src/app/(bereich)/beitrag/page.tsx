import type { Metadata } from "next";
import { anzeigename, mitgliedPflicht } from "@/lib/auth";
import { einstellungen } from "@/lib/daten";
import { girocodeSvg } from "@/lib/girocode";
import { Seitenkopf } from "@/components/bausteine";
import { KopierKnopf } from "./kopieren";
import styles from "./beitrag.module.css";

export const metadata: Metadata = { title: "Beitrag" };

function ibanLesbar(iban: string) {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

export default async function Beitrag() {
  const profil = await mitgliedPflicht();
  const e = await einstellungen();
  const betrag = e?.beitrag_betrag ?? 8;
  const zweck = [e?.beitrag_verwendungszweck, anzeigename(profil)].filter(Boolean).join(" ");
  const qr = e?.beitrag_iban
    ? await girocodeSvg({ name: e.beitrag_empfaenger ?? "", iban: e.beitrag_iban, betrag: Number(betrag), zweck })
    : null;
  const betragText = Number(betrag).toLocaleString("de-DE", { minimumFractionDigits: Number.isInteger(Number(betrag)) ? 0 : 2 });

  return (
    <>
      <Seitenkopf titel="Monatsbeitrag" />
      <section className={styles.plakat} aria-label="Beitrag">
        <p className={styles.betrag}>{betragText} €</p>
        <p className={styles.text}>im Monat, auch wenn du mal fehlst (§ 4). Das Geld kommt in die gemeinsame Kasse.</p>
      </section>

      <section className="blatt" aria-labelledby="ueberweisung">
        <h2 id="ueberweisung" className="banderole-kopf versal banderole-kopf--blau">Überweisung</h2>
        {e?.beitrag_iban ? (
          <div className={styles.ueberweisung}>
          <dl className={styles.daten}>
            <dt>Empfänger</dt>
            <dd>{e.beitrag_empfaenger}</dd>
            <dt>IBAN</dt>
            <dd className={styles.iban}>
              <span className="zahl" style={{ textAlign: "left" }}>{ibanLesbar(e.beitrag_iban)}</span>
              <KopierKnopf wert={e.beitrag_iban.replace(/\s+/g, "")} />
            </dd>
            <dt>Verwendungszweck</dt>
            <dd className={styles.iban}>
              <span>{zweck}</span>
              <KopierKnopf wert={zweck} label="Zweck kopieren" kopiertLabel="Zweck kopiert." />
            </dd>
          </dl>
          {qr && (
            <figure className={styles.qr}>
              <div role="img" aria-label="QR-Code für die Überweisung" dangerouslySetInnerHTML={{ __html: qr }} />
              <figcaption>Mit der Banking-App scannen</figcaption>
            </figure>
          )}
          </div>
        ) : (
          <p className="leer">Die Bankverbindung fehlt noch. Frag den Admin.</p>
        )}
      </section>
    </>
  );
}
