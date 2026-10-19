import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { anzeigename, erfassenPflicht } from "@/lib/auth";
import { anmeldungen, ergebnisse, mitglieder, spieltag as spieltagLaden } from "@/lib/daten";
import { datumMitJahr } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { LoeschenKnopf } from "@/components/loeschen-knopf";
import { Erfassung } from "./erfassung";
import { spieltagLoeschen } from "../../aktionen";

export const metadata: Metadata = { title: "Spieltag erfassen" };

export default async function SpieltagErfassen({ params }: { params: Promise<{ id: string }> }) {
  await erfassenPflicht();
  const { id } = await params;
  const tag = await spieltagLaden(id);
  if (!tag) notFound();
  const [erg, leute, anm] = await Promise.all([ergebnisse([tag.id]), mitglieder(false), anmeldungen(tag.id)]);
  const dabeiIds = new Set(erg.map((e) => e.profil_id));
  // Aktive Mitglieder plus alle, die an diesem Abend schon eingetragen sind.
  const personen = leute
    .filter((m) => m.aktiv || dabeiIds.has(m.id))
    .map((m) => ({ id: m.id, name: anzeigename(m) }));
  // Wer zugesagt hat, ist bei „Wer ist dabei?“ schon angehakt.
  const personenIds = new Set(personen.map((p) => p.id));
  const vorauswahl = anm.filter((a) => a.status === "dabei" && personenIds.has(a.profil_id)).map((a) => a.profil_id);

  return (
    <>
      <Seitenkopf titel="Spieltag erfassen" text={`Kegelabend am ${datumMitJahr(tag.datum)}`} />
      <Erfassung
        spieltagId={tag.id}
        datum={tag.datum}
        personen={personen}
        vorhanden={erg}
        vorauswahl={vorauswahl}
        gossenErfasst={tag.gossen_erfasst}
        pudelErfasst={tag.pudel_erfasst}
        abgeschlossen={tag.abgeschlossen}
      />
      <LoeschenKnopf
        aktion={spieltagLoeschen}
        id={tag.id}
        knopf="Spieltag löschen"
        frage={`Spieltag vom ${datumMitJahr(tag.datum)} mit allen Ergebnissen löschen? Das lässt sich nicht rückgängig machen.`}
        ja="Löschen"
        nein="Behalten"
      />
    </>
  );
}
