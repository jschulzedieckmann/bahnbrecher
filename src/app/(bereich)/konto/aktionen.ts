"use server";

import { mitgliedPflicht } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { benutzernameZuEmail, MIN_PASSWORT_LAENGE, passwortFuerSupabase } from "@/lib/zugang";
import type { FormStatus } from "@/app/(zugang)/aktionen";

export async function passwortAendern(_: FormStatus, form: FormData): Promise<FormStatus> {
  const profil = await mitgliedPflicht();
  const aktuell = String(form.get("aktuell") ?? "");
  const neu = String(form.get("neu") ?? "");
  const wiederholt = String(form.get("wiederholt") ?? "");

  if (neu.length < MIN_PASSWORT_LAENGE) return { fehler: `Das Passwort ist zu kurz. Nimm mindestens ${MIN_PASSWORT_LAENGE} Zeichen.` };
  if (neu !== wiederholt) return { fehler: "Die beiden Passwörter sind nicht gleich." };
  if (process.env.START_PASSWORT && neu === process.env.START_PASSWORT) {
    return { fehler: "Das ist das Startpasswort. Nimm bitte ein eigenes." };
  }

  const supabase = await createClient();
  const { error: falsch } = await supabase.auth.signInWithPassword({
    email: benutzernameZuEmail(profil.benutzername),
    password: passwortFuerSupabase(aktuell),
  });
  if (falsch) return { fehler: "Das aktuelle Passwort stimmt nicht." };

  const { error } = await supabase.auth.updateUser({ password: passwortFuerSupabase(neu) });
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };
  return { ok: "Dein Passwort ist geändert." };
}
