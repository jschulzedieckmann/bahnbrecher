"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminPflicht } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { FormStatus } from "@/app/(zugang)/aktionen";

const ARTEN = ["ausflug", "sonstiges"];

function felder(form: FormData) {
  const art = String(form.get("art") ?? "kegelabend");
  return {
    art: ARTEN.includes(art) ? art : "ausflug",
    titel: String(form.get("titel") ?? "").trim() || null,
    datum: String(form.get("datum") ?? ""),
    uhrzeit: String(form.get("uhrzeit") ?? "") || null,
    ort: String(form.get("ort") ?? "").trim() || null,
    notiz: String(form.get("notiz") ?? "").trim() || null,
  };
}

export async function terminSpeichern(_: FormStatus, form: FormData): Promise<FormStatus> {
  const profil = await adminPflicht();
  const id = String(form.get("id") ?? "");
  const daten = felder(form);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(daten.datum)) return { fehler: "Bitte wähl ein Datum." };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("termine").update(daten).eq("id", id)
    : await supabase.from("termine").insert({ ...daten, erstellt_von: profil.id });
  if (error) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };

  revalidatePath("/", "layout");
  redirect("/termine?gespeichert=1");
}

export async function terminLoeschen(form: FormData) {
  await adminPflicht();
  const id = String(form.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("termine").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/termine?geloescht=1");
}
