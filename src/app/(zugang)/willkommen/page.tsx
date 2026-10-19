import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { aktuellesProfil } from "@/lib/auth";
import { WillkommenFormular } from "./formular";
import styles from "../zugang.module.css";

export const metadata: Metadata = { title: "Willkommen" };

export default async function Willkommen() {
  const profil = await aktuellesProfil();
  if (!profil) redirect("/anmelden");
  if (!profil.muss_passwort_aendern) redirect("/");

  return (
    <>
      <h1 className={`seitentitel ${styles.untertitel}`}>Willkommen bei den Bahnbrechern</h1>
      <p className={styles.text}>
        Moin, {profil.vorname}! Du bist zum ersten Mal hier. Bevor es losgeht, ersetzt du das Startpasswort durch dein eigenes.
      </p>
      <WillkommenFormular />
    </>
  );
}
