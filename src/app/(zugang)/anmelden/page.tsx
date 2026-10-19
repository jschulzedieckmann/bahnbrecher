import type { Metadata } from "next";
import { AnmeldeFormular } from "./formular";
import styles from "../zugang.module.css";

export const metadata: Metadata = { title: "Anmelden" };

export default async function AnmeldenSeite({ searchParams }: { searchParams: Promise<{ abgemeldet?: string; abgelaufen?: string }> }) {
  const { abgemeldet, abgelaufen } = await searchParams;
  return (
    <>
      <h1 className={`plakatschrift ${styles.titel}`}>Gut Holz!</h1>
      {abgemeldet ? (
        <p className={`${styles.text} erfolg`} role="status">Du bist abgemeldet. Gut Holz bis zum nächsten Mal!</p>
      ) : abgelaufen ? (
        <p className={styles.text} role="status">Du warst eine Weile weg. Melde dich bitte neu an.</p>
      ) : (
        <p className={styles.text}>Hier geht&rsquo;s nur für Bahnbrecher weiter. Melde dich mit deinen Zugangsdaten an.</p>
      )}
      <AnmeldeFormular />
      <p className={styles.fuss}>Noch kein Zugang? Sprich den Admin beim nächsten Kegelabend an.</p>
    </>
  );
}
