import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { adminPflicht, anzeigename } from "@/lib/auth";
import { einstellungen, mitglieder } from "@/lib/daten";
import { Banderole, Seitenkopf } from "@/components/bausteine";
import { BeitragFormular, NeuesMitglied } from "./formulare";
import styles from "./verwaltung.module.css";

export const metadata: Metadata = { title: "Verwaltung" };

const ROLLE = { admin: "Admin", schriftfuehrer: "Schriftführer", mitglied: "Mitglied" } as const;

export default async function Verwaltung({ searchParams }: { searchParams: Promise<{ ausgetragen?: string }> }) {
  await adminPflicht();
  const { ausgetragen } = await searchParams;
  const [leute, e] = await Promise.all([mitglieder(false), einstellungen()]);

  return (
    <>
      <Seitenkopf titel="Verwaltung" />
      {ausgetragen && <p className="erfolg" role="status">Mitglied ausgetragen. Der Zugang ist gesperrt, die Ergebnisse bleiben in der Statistik.</p>}

      <Banderole titel="Mitglieder" farbe="blau" id="mitglieder">
        <ul className={styles.liste}>
          {leute.map((m) => (
            <li key={m.id}>
              <Link href={`/verwaltung/mitglieder/${m.id}`} className={styles.eintrag}>
                <span className={m.aktiv ? undefined : "nicht-dabei"}>{anzeigename(m)}</span>
                <span className={styles.rolle}>{m.aktiv ? ROLLE[m.rolle] : "ausgetragen"}</span>
                <ChevronRight size={18} strokeWidth={2.6} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Banderole>

      <Banderole titel="Mitglied anlegen" id="anlegen">
        <div className="blatt-inhalt"><NeuesMitglied /></div>
      </Banderole>

      <Banderole titel="Beitrag" farbe="blau" id="beitrag">
        <div className="blatt-inhalt"><BeitragFormular werte={e} /></div>
      </Banderole>
    </>
  );
}
