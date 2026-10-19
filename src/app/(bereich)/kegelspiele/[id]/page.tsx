import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mitgliedPflicht } from "@/lib/auth";
import { FORM_NAME, kegelspiele } from "@/lib/daten";
import { Banderole } from "@/components/bausteine";
import { LoeschenKnopf } from "@/components/loeschen-knopf";
import { SpielFormular } from "../formular";
import { Schwierigkeit } from "../liste";
import { spielLoeschen } from "../aktionen";

export const metadata: Metadata = { title: "Kegelspiel" };

const GRAD_TEXT = {
  leicht: "In einem Satz erklärt, Glück spielt mit. Gut für Neulinge in der Probezeit.",
  mittel: "Braucht die Tafel oder etwas Taktik.",
  schwer: "Gezielte Würfe auf bestimmte Kegel oder viele Sonderregeln.",
};

export default async function SpielSeite({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aendern?: string }> }) {
  const profil = await mitgliedPflicht();
  const { id } = await params;
  const { aendern } = await searchParams;
  const spiel = (await kegelspiele()).find((s) => s.id === id);
  if (!spiel) notFound();
  const istAdmin = profil.rolle === "admin";

  if (aendern && istAdmin) {
    return (
      <>
        <h1 className="seitentitel">Spiel ändern</h1>
        <SpielFormular spiel={spiel} />
        <LoeschenKnopf aktion={spielLoeschen} id={spiel.id} knopf="Spiel löschen" frage={`„${spiel.name}“ wirklich löschen?`} ja="Löschen" nein="Behalten" />
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className="seitentitel">{spiel.name}</h1>
        <p className="einleitung" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Schwierigkeit grad={spiel.schwierigkeit} /> {FORM_NAME[spiel.form]}
        </p>
      </div>
      <Banderole titel="So geht's" farbe="blau" id="so-gehts">
        <p className="blatt-inhalt">{spiel.regel}</p>
      </Banderole>
      <Banderole titel="Bei uns" id="bei-uns">
        <p className={spiel.bei_uns ? "blatt-inhalt" : "leer"}>{spiel.bei_uns ?? "Noch keine Hausregeln eingetragen."}</p>
      </Banderole>
      <Banderole titel="Schwierigkeit" farbe="blau" id="grad">
        <p className="blatt-inhalt">{GRAD_TEXT[spiel.schwierigkeit]}</p>
      </Banderole>
      <div className="knopfreihe">
        <Link href="/kegelspiele" className="knopf knopf--hell">Alle Spiele</Link>
        {istAdmin && <Link href={`/kegelspiele/${spiel.id}?aendern=1`} className="knopf">Spiel ändern</Link>}
      </div>
    </>
  );
}
