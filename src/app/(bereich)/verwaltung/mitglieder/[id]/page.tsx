import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminPflicht, anzeigename } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Banderole, Seitenkopf } from "@/components/bausteine";
import { LoeschenKnopf } from "@/components/loeschen-knopf";
import { MitgliedBearbeiten } from "../../formulare";
import { mitgliedAustragen, mitgliedReaktivieren, passwortZuruecksetzen } from "../../aktionen";

export const metadata: Metadata = { title: "Mitglied bearbeiten" };

export default async function MitgliedSeite({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ zurueckgesetzt?: string }> }) {
  const ich = await adminPflicht();
  const { id } = await params;
  const { zurueckgesetzt } = await searchParams;
  const supabase = await createClient();
  const { data: m } = await supabase
    .from("profiles")
    .select("id, benutzername, vorname, nachname_kuerzel, rolle, dabei_seit, aktiv, muss_passwort_aendern")
    .eq("id", id)
    .maybeSingle();
  if (!m) notFound();

  return (
    <>
      <Seitenkopf
        titel={anzeigename(m)}
        text={!m.aktiv ? "Ausgetragen. Der Zugang ist gesperrt." : m.muss_passwort_aendern ? "Hat sich noch nicht mit eigenem Passwort angemeldet." : undefined}
      />
      {zurueckgesetzt && (
        <p className="erfolg" role="status">Passwort zurückgesetzt. Gib {m.vorname} Bescheid, dass das Startpasswort wieder gilt.</p>
      )}

      <Banderole titel="Angaben" farbe="blau" id="angaben">
        <div className="blatt-inhalt"><MitgliedBearbeiten mitglied={m} benutzername={m.benutzername} /></div>
      </Banderole>

      {m.aktiv && (
        <LoeschenKnopf
          aktion={passwortZuruecksetzen}
          id={m.id}
          knopf="Passwort zurücksetzen"
          frage={`Passwort von ${m.vorname} auf das Startpasswort zurücksetzen? Beim nächsten Anmelden muss ${m.vorname} ein neues vergeben.`}
          ja="Zurücksetzen"
          nein="Abbrechen"
        />
      )}

      {m.id !== ich.id && (m.aktiv ? (
        <LoeschenKnopf
          aktion={mitgliedAustragen}
          id={m.id}
          knopf="Mitglied austragen"
          frage={`${m.vorname} austragen? Der Zugang wird gesperrt. Die Ergebnisse bleiben in der Statistik.`}
          ja="Austragen"
          nein="Behalten"
        />
      ) : (
        <form action={mitgliedReaktivieren}>
          <input type="hidden" name="id" value={m.id} />
          <button type="submit" className="knopf knopf--hell">Wieder aufnehmen</button>
        </form>
      ))}

      <Link href="/verwaltung" style={{ fontWeight: 700 }}>Zurück zur Verwaltung</Link>
    </>
  );
}
