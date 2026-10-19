import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { anzeigename, erfassenPflicht } from "@/lib/auth";
import { anmeldungen, mitglieder, spieltag as spieltagLaden } from "@/lib/daten";
import { datumKurz, wochentagLang } from "@/lib/format";
import { Seitenkopf } from "@/components/bausteine";
import { AnmeldungenListe } from "./anmeldungen-liste";

export const metadata: Metadata = { title: "Anmeldungen" };

export default async function Anmeldungen({ params }: { params: Promise<{ id: string }> }) {
  await erfassenPflicht();
  const { id } = await params;
  const tag = await spieltagLaden(id);
  if (!tag) notFound();
  const [anm, leute] = await Promise.all([anmeldungen(tag.id), mitglieder()]);
  const status = Object.fromEntries(anm.map((a) => [a.profil_id, a.status]));

  return (
    <>
      <Seitenkopf
        titel="Anmeldungen"
        text={`${wochentagLang(tag.datum)}, ${datumKurz(tag.datum)} Trag ein, wer per WhatsApp zu- oder abgesagt hat. Jeder Tipp wird sofort gespeichert.`}
      />
      <AnmeldungenListe
        spieltagId={tag.id}
        personen={leute.map((m) => ({ id: m.id, name: anzeigename(m) }))}
        start={status}
      />
      <Link href="/" style={{ fontWeight: 700 }}>Zur Startseite</Link>
    </>
  );
}
