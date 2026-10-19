import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminPflicht } from "@/lib/auth";
import { termin as terminLaden } from "@/lib/daten";
import { datumMitJahr, heuteIso } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { LoeschenKnopf } from "@/components/loeschen-knopf";
import { TerminFormular } from "../formular";
import { terminLoeschen } from "../aktionen";

export const metadata: Metadata = { title: "Termin ändern" };

export default async function TerminAendern({ params }: { params: Promise<{ id: string }> }) {
  await adminPflicht();
  const { id } = await params;
  const termin = await terminLaden(id);
  if (!termin) notFound();

  return (
    <>
      <Seitenkopf titel="Termin ändern" />
      <TerminFormular termin={termin} heute={heuteIso()} />
      <LoeschenKnopf
        aktion={terminLoeschen}
        id={termin.id}
        knopf="Termin löschen"
        frage={`Termin am ${datumMitJahr(termin.datum)} wirklich löschen? Das lässt sich nicht rückgängig machen.`}
        ja="Löschen"
        nein="Behalten"
      />
    </>
  );
}
