import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { anzeigename, erfassenPflicht } from "@/lib/auth";
import { ergebnisse, mitglieder, spieltag as spieltagLaden } from "@/lib/daten";
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
  const [erg, leute] = await Promise.all([ergebnisse([tag.id]), mitglieder(false)]);
  const dabeiIds = new Set(erg.map((e) => e.profil_id));
  // Aktive Mitglieder plus alle, die an diesem Abend schon eingetragen sind.
  const personen = leute
    .filter((m) => m.aktiv || dabeiIds.has(m.id))
    .map((m) => ({ id: m.id, name: anzeigename(m) }));

  return (
    <>
      <Seitenkopf titel="Spieltag erfassen" text={`Kegelabend am ${datumMitJahr(tag.datum)}`} />
      <Erfassung
        spieltagId={tag.id}
        datum={tag.datum}
        personen={personen}
        vorhanden={erg}
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
