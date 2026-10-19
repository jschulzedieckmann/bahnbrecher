import type { Metadata } from "next";
import { adminPflicht } from "@/lib/auth";
import { heuteIso } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { TerminFormular } from "../formular";

export const metadata: Metadata = { title: "Neuer Termin" };

export default async function NeuerTermin() {
  await adminPflicht();
  return (
    <>
      <Seitenkopf titel="Neuer Termin" />
      <TerminFormular heute={heuteIso()} />
    </>
  );
}
