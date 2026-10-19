import type { Metadata } from "next";
import Link from "next/link";
import styles from "../zugang.module.css";

export const metadata: Metadata = { title: "Passwort vergessen" };

export default function PasswortVergessen() {
  return (
    <>
      <h1 className={`seitentitel ${styles.untertitel}`}>Passwort vergessen?</h1>
      <p className={styles.text}>
        Kein Problem. Frag den Admin beim Kegelabend oder per WhatsApp. Er setzt dein Passwort auf das
        Startpasswort zurück. Beim nächsten Anmelden vergibst du dann ein neues.
      </p>
      <Link href="/anmelden" className="knopf knopf--hell">Zurück zur Anmeldung</Link>
    </>
  );
}
