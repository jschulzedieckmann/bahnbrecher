import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Rolle = "mitglied" | "schriftfuehrer" | "admin";

export type Mitglied = {
  id: string;
  benutzername: string;
  vorname: string;
  nachname_kuerzel: string | null;
  rolle: Rolle;
  dabei_seit: string | null;
  aktiv: boolean;
  muss_passwort_aendern: boolean;
};

/** Liest das Profil der angemeldeten Person, einmal pro Anfrage. */
export const aktuellesProfil = cache(async (): Promise<Mitglied | null> => {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, benutzername, vorname, nachname_kuerzel, rolle, dabei_seit, aktiv, muss_passwort_aendern")
    .eq("id", userId)
    .single();
  return (data as Mitglied | null) ?? null;
});

/** Für alle Seiten hinter dem Login. */
export async function mitgliedPflicht(): Promise<Mitglied> {
  const profil = await aktuellesProfil();
  if (!profil || !profil.aktiv) redirect("/anmelden");
  if (profil.muss_passwort_aendern) redirect("/willkommen");
  return profil;
}

export async function adminPflicht(): Promise<Mitglied> {
  const profil = await mitgliedPflicht();
  if (profil.rolle !== "admin") redirect("/kein-zugriff");
  return profil;
}

export async function erfassenPflicht(): Promise<Mitglied> {
  const profil = await mitgliedPflicht();
  if (profil.rolle === "mitglied") redirect("/kein-zugriff");
  return profil;
}

export function darfErfassen(profil: Mitglied) {
  return profil.rolle === "admin" || profil.rolle === "schriftfuehrer";
}

export function anzeigename(p: { vorname: string; nachname_kuerzel: string | null }) {
  return p.nachname_kuerzel ? `${p.vorname} ${p.nachname_kuerzel}` : p.vorname;
}
