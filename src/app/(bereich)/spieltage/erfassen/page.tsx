import type { Metadata } from "next";
import { erfassenPflicht } from "@/lib/auth";
import { heuteIso } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { SpieltagStarten } from "./starten";

export const metadata: Metadata = { title: "Spieltag erfassen" };

export default async function Erfassen() {
  await erfassenPflicht();
  return (
    <>
      <Seitenkopf
        titel="Spieltag erfassen"
        text="Wähl den Abend. Gibt es für das Datum schon einen Spieltag, machst du dort weiter."
      />
      <SpieltagStarten heute={heuteIso()} />
    </>
  );
}
