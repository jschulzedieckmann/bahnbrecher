"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminPflicht } from "@/lib/auth";
import { heuteIso } from "@/lib/format";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { benutzernameNormalisieren, benutzernameZuEmail, passwortFuerSupabase } from "@/lib/zugang";
import type { FormStatus } from "@/app/(zugang)/aktionen";

const ROLLEN = ["mitglied", "schriftfuehrer", "admin"];

function startpasswort() {
  const pw = process.env.START_PASSWORT;
  if (!pw) throw new Error("START_PASSWORT fehlt in .env.local");
  return passwortFuerSupabase(pw);
}

export async function mitgliedAnlegen(_: FormStatus, form: FormData): Promise<FormStatus> {
  await adminPflicht();
  const vorname = String(form.get("vorname") ?? "").trim();
  const nachname = String(form.get("nachname") ?? "").trim();
  const benutzername = benutzernameNormalisieren(String(form.get("benutzername") ?? ""));
  const rolle = String(form.get("rolle") ?? "mitglied");
  const dabeiSeit = String(form.get("dabei_seit") ?? "") || null;

  if (!vorname) return { fehler: "Bitte gib einen Vornamen ein." };
  if (!/^[a-z0-9._-]{2,32}$/.test(benutzername)) {
    return { fehler: "Der Benutzername darf nur Kleinbuchstaben, Ziffern, Punkt, Strich und Unterstrich enthalten (2 bis 32 Zeichen)." };
  }
  if (!ROLLEN.includes(rolle)) return { fehler: "Bitte wähl eine Rolle." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: benutzernameZuEmail(benutzername),
    password: startpasswort(),
    email_confirm: true,
  });
  if (error || !data.user) {
    return { fehler: error?.message.includes("already") ? "Dieser Benutzername ist schon vergeben." : "Anlegen hat nicht geklappt. Versuch es noch mal." };
  }

  const { error: e2 } = await admin.from("profiles").insert({
    id: data.user.id,
    benutzername,
    vorname,
    nachname_kuerzel: nachname ? `${nachname.slice(0, 1).toUpperCase()}.` : null,
    rolle,
    dabei_seit: dabeiSeit,
  });
  if (e2) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { fehler: e2.code === "23505" ? "Dieser Benutzername ist schon vergeben." : "Anlegen hat nicht geklappt. Versuch es noch mal." };
  }

  revalidatePath("/", "layout");
  return { ok: `${vorname} ist angelegt und kann sich jetzt anmelden. Benutzername: ${benutzername}` };
}

export async function mitgliedSpeichern(_: FormStatus, form: FormData): Promise<FormStatus> {
  const ich = await adminPflicht();
  const id = String(form.get("id") ?? "");
  const vorname = String(form.get("vorname") ?? "").trim();
  const kuerzel = String(form.get("nachname_kuerzel") ?? "").trim() || null;
  const rolle = String(form.get("rolle") ?? "mitglied");
  const dabeiSeit = String(form.get("dabei_seit") ?? "") || null;
  if (!vorname) return { fehler: "Bitte gib einen Vornamen ein." };
  if (!ROLLEN.includes(rolle)) return { fehler: "Bitte wähl eine Rolle." };
  if (id === ich.id && rolle !== "admin") return { fehler: "Du kannst dir die Admin-Rolle nicht selbst wegnehmen." };

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ vorname, nachname_kuerzel: kuerzel, rolle, dabei_seit: dabeiSeit }).eq("id", id);
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };
  revalidatePath("/", "layout");
  return { ok: "Änderungen gespeichert." };
}

export async function passwortZuruecksetzen(form: FormData) {
  await adminPflicht();
  const id = String(form.get("id") ?? "");
  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(id, { password: startpasswort() });
  await admin.from("profiles").update({ muss_passwort_aendern: true, passwort_zurueckgesetzt_am: new Date().toISOString() }).eq("id", id);
  redirect(`/verwaltung/mitglieder/${id}?zurueckgesetzt=1`);
}

export async function mitgliedAustragen(form: FormData) {
  const ich = await adminPflicht();
  const id = String(form.get("id") ?? "");
  if (id === ich.id) redirect(`/verwaltung/mitglieder/${id}`);
  const admin = createAdminClient();
  await admin.from("profiles").update({ aktiv: false }).eq("id", id);
  await admin.auth.admin.updateUserById(id, { ban_duration: "876000h" });
  revalidatePath("/", "layout");
  redirect("/verwaltung?ausgetragen=1");
}

export async function mitgliedReaktivieren(form: FormData) {
  await adminPflicht();
  const id = String(form.get("id") ?? "");
  const admin = createAdminClient();
  await admin.from("profiles").update({ aktiv: true }).eq("id", id);
  await admin.auth.admin.updateUserById(id, { ban_duration: "none" });
  revalidatePath("/", "layout");
  redirect(`/verwaltung/mitglieder/${id}`);
}

function ibanGueltig(iban: string) {
  const s = iban.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  const umgestellt = s.slice(4) + s.slice(0, 4);
  const ziffern = umgestellt.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const z of ziffern) rest = (rest * 10 + Number(z)) % 97;
  return rest === 1;
}

export async function beitragSpeichern(_: FormStatus, form: FormData): Promise<FormStatus> {
  await adminPflicht();
  const iban = String(form.get("iban") ?? "").replace(/\s+/g, "").toUpperCase();
  const betrag = Number(String(form.get("betrag") ?? "8").replace(",", "."));
  if (iban && !ibanGueltig(iban)) return { fehler: "Diese IBAN sieht nicht richtig aus. Prüf sie bitte noch mal." };
  if (!Number.isFinite(betrag) || betrag < 0) return { fehler: "Bitte gib einen gültigen Betrag ein." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("einstellungen")
    .update({
      beitrag_empfaenger: String(form.get("empfaenger") ?? "").trim() || null,
      beitrag_iban: iban || null,
      beitrag_verwendungszweck: String(form.get("zweck") ?? "").trim() || "Monatsbeitrag",
      beitrag_betrag: betrag,
    })
    .eq("id", true);
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };
  revalidatePath("/beitrag");
  return { ok: "Bankverbindung gespeichert." };
}

function betragAus(wert: FormDataEntryValue | null): number | null | undefined {
  const text = String(wert ?? "").replace(/\s|€/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!text) return null;
  const zahl = Number(text);
  return Number.isFinite(zahl) ? Math.round(zahl * 100) / 100 : undefined;
}

export async function kasseSpeichern(_: FormStatus, form: FormData): Promise<FormStatus> {
  await adminPflicht();
  const stand = betragAus(form.get("stand"));
  const ziel = betragAus(form.get("ziel"));
  if (stand === undefined) return { fehler: "Bitte gib einen gültigen Kontostand ein, zum Beispiel 312,50." };
  if (ziel === undefined || (ziel !== null && ziel <= 0)) return { fehler: "Das Sparziel muss ein Betrag über 0 sein, oder du lässt es leer." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("einstellungen")
    .update({
      kasse_stand: stand,
      kasse_stand_am: stand === null ? null : heuteIso(),
      kasse_ziel: ziel,
      kasse_ziel_text: ziel === null ? null : String(form.get("ziel_text") ?? "").trim() || null,
    })
    .eq("id", true);
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };
  revalidatePath("/");
  return { ok: "Kassenstand gespeichert. Er steht jetzt auf der Startseite." };
}
