import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { erfassenPflicht } from "@/lib/auth";
import { spieltag as spieltagLaden } from "@/lib/daten";
import { heuteIso } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { PlanFormular } from "../../plan-formular";

export const metadata: Metadata = { title: "Spieltag ändern" };

export default async function SpieltagAendern({ params }: { params: Promise<{ id: string }> }) {
  await erfassenPflicht();
  const { id } = await params;
  const tag = await spieltagLaden(id);
  if (!tag) notFound();
  return (
    <>
      <Seitenkopf titel="Spieltag ändern" />
      <PlanFormular spieltag={tag} heute={heuteIso()} />
    </>
  );
}
