import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { mitgliedPflicht } from "@/lib/auth";
import { kegelspiele } from "@/lib/daten";
import { Seitenkopf } from "@/components/bausteine";
import { SpieleListe } from "./liste";

export const metadata: Metadata = { title: "Kegelspiele" };

export default async function Kegelspiele() {
  const profil = await mitgliedPflicht();
  const spiele = await kegelspiele();
  return (
    <>
      <Seitenkopf
        titel="Kegelspiele"
        text="Spiele für den Kegelabend. Die Regeln sind Grundformen. Was bei uns anders läuft, steht unter „Bei uns“."
        aktion={profil.rolle === "admin" && <Link href="/kegelspiele/neu" className="knopf"><Plus size={18} strokeWidth={3} aria-hidden /> Spiel anlegen</Link>}
      />
      {spiele.length === 0 ? <p className="leer blatt">Noch keine Kegelspiele eingetragen.</p> : <SpieleListe spiele={spiele} />}
    </>
  );
}
