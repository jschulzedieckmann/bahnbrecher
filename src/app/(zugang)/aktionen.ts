"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
  benutzernameZuEmail,
  MIN_PASSWORT_LAENGE,
  passwortFuerSupabase,
  STARTPASSWORT_GUELTIG_TAGE,
} from "@/lib/zugang";

export type FormStatus = { fehler?: string; ok?: string } | undefined;

export async function anmelden(_: FormStatus, form: FormData): Promise<FormStatus> {
  const benutzername = String(form.get("benutzername") ?? "").trim();
  const passwort = String(form.get("passwort") ?? "");
  if (!benutzername) return { fehler: "Bitte gib deinen Benutzernamen ein." };
  if (!passwort) return { fehler: "Bitte gib dein Passwort ein." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: benutzernameZuEmail(benutzername),
    password: passwortFuerSupabase(passwort),
  });

  if (error) {
    if (error.status === 429) return { fehler: "Zu viele Versuche. Warte ein paar Minuten und probier es dann noch mal." };
    if (error.status && error.status >= 500) return { fehler: "Keine Verbindung. Prüf dein Internet und versuch es noch mal." };
    return { fehler: "Benutzername oder Passwort stimmt nicht. Versuch es noch mal." };
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("aktiv, muss_passwort_aendern, passwort_zurueckgesetzt_am")
    .eq("id", data.user.id)
    .single();

  if (!profil || !profil.aktiv) {
    await supabase.auth.signOut();
    return { fehler: "Dieser Zugang ist gesperrt. Sprich den Admin an." };
  }

  if (profil.muss_passwort_aendern) {
    const seit = Date.now() - new Date(profil.passwort_zurueckgesetzt_am).getTime();
    if (seit > STARTPASSWORT_GUELTIG_TAGE * 86_400_000) {
      await supabase.auth.signOut();
      return {
        fehler: "Das Startpasswort ist abgelaufen. Frag den Admin, damit er es zurücksetzt.",
      };
    }
    redirect("/willkommen");
  }

  redirect("/");
}

export async function startpasswortErsetzen(_: FormStatus, form: FormData): Promise<FormStatus> {
  const neu = String(form.get("neu") ?? "");
  const wiederholt = String(form.get("wiederholt") ?? "");

  if (neu.length < MIN_PASSWORT_LAENGE) return { fehler: `Das Passwort ist zu kurz. Nimm mindestens ${MIN_PASSWORT_LAENGE} Zeichen.` };
  if (neu !== wiederholt) return { fehler: "Die beiden Passwörter sind nicht gleich." };
  if (process.env.START_PASSWORT && neu === process.env.START_PASSWORT) {
    return { fehler: "Das ist noch das Startpasswort. Nimm bitte ein eigenes." };
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/anmelden");

  const { error } = await supabase.auth.updateUser({ password: passwortFuerSupabase(neu) });
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };

  const admin = createAdminClient();
  await admin.from("profiles").update({ muss_passwort_aendern: false }).eq("id", userId);

  redirect("/?willkommen=1");
}

export async function abmelden() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/anmelden?abgemeldet=1");
}
