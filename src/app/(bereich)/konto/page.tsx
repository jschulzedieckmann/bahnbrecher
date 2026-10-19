import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { anzeigename, mitgliedPflicht } from "@/lib/auth";
import { abmelden } from "@/app/(zugang)/aktionen";
import { Banderole, Seitenkopf } from "@/components/bausteine";
import { PasswortAendern } from "./formular";

export const metadata: Metadata = { title: "Mein Konto" };

const ROLLE = { admin: "Admin", schriftfuehrer: "Schriftführer", mitglied: "Mitglied" } as const;

export default async function Konto() {
  const profil = await mitgliedPflicht();
  return (
    <>
      <Seitenkopf titel="Mein Konto" />
      <Banderole titel="Angaben" farbe="blau" id="angaben">
        <dl className="blatt-inhalt" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 18px" }}>
          <dt style={{ fontWeight: 800 }}>Name</dt><dd style={{ margin: 0 }}>{anzeigename(profil)}</dd>
          <dt style={{ fontWeight: 800 }}>Benutzername</dt><dd style={{ margin: 0 }}>{profil.benutzername}</dd>
          <dt style={{ fontWeight: 800 }}>Rolle</dt><dd style={{ margin: 0 }}>{ROLLE[profil.rolle]}</dd>
        </dl>
      </Banderole>
      <Banderole titel="Passwort ändern" id="passwort">
        <div className="blatt-inhalt"><PasswortAendern /></div>
      </Banderole>
      <form action={abmelden}>
        <button type="submit" className="knopf knopf--hell"><LogOut size={18} strokeWidth={2.6} aria-hidden /> Abmelden</button>
      </form>
    </>
  );
}
