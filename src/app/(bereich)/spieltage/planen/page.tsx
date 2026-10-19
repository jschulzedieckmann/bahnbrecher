import type { Metadata } from "next";
import { erfassenPflicht } from "@/lib/auth";
import { spieltage } from "@/lib/daten";
import { datumAus, heuteIso } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { PlanFormular } from "../plan-formular";

export const metadata: Metadata = { title: "Spieltag planen" };

/** Satzung § 3: alle 4 Wochen. Vorschlag = 28 Tage nach dem letzten Spieltag, frühestens heute. */
function vorschlagNachSatzung(letztes: string | undefined, heute: string) {
  if (!letztes) return undefined;
  const d = datumAus(letztes);
  d.setUTCDate(d.getUTCDate() + 28);
  while (d.toISOString().slice(0, 10) < heute) d.setUTCDate(d.getUTCDate() + 28);
  return d.toISOString().slice(0, 10);
}

export default async function SpieltagPlanen() {
  await erfassenPflicht();
  const heute = heuteIso();
  const alle = await spieltage();
  return (
    <>
      <Seitenkopf titel="Spieltag planen" text="Der nächste Kegelabend. Am Abend selbst trägst du hier auch die Ergebnisse ein." />
      <PlanFormular heute={heute} vorschlag={vorschlagNachSatzung(alle[0]?.datum, heute)} />
    </>
  );
}
