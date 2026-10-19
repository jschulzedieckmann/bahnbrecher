"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erfassenPflicht } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WERTE } from "@/lib/daten";
import type { FormStatus } from "@/app/(zugang)/aktionen";

export async function spieltagOeffnen(_: FormStatus, form: FormData): Promise<FormStatus> {
  await erfassenPflicht();
  const datum = String(form.get("datum") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return { fehler: "Bitte wähl ein Datum." };

  const supabase = await createClient();
  const { data: vorhanden } = await supabase.from("spieltage").select("id").eq("datum", datum).maybeSingle();
  if (vorhanden) redirect(`/spieltage/${vorhanden.id}/erfassen`);

  const { data, error } = await supabase.from("spieltage").insert({ datum }).select("id").single();
  if (error || !data) return { fehler: "Speichern hat nicht geklappt. Versuch es noch mal." };
  redirect(`/spieltage/${data.id}/erfassen`);
}

export type ErfassteZeile = { profil_id: string } & Record<(typeof WERTE)[number], number>;

export async function ergebnisseSpeichern(eingabe: {
  spieltagId: string;
  zeilen: ErfassteZeile[];
  gossenErfasst: boolean;
  pudelErfasst: boolean;
  abschliessen: boolean;
}): Promise<{ ok: boolean; fehler?: string }> {
  await erfassenPflicht();
  const supabase = await createClient();
  const { spieltagId, zeilen } = eingabe;
  const sauber = (n: unknown) => Math.max(0, Math.min(999, Math.trunc(Number(n) || 0)));

  const { error: e1 } = await supabase
    .from("spieltage")
    .update({
      gossen_erfasst: eingabe.gossenErfasst,
      pudel_erfasst: eingabe.pudelErfasst,
      ...(eingabe.abschliessen ? { abgeschlossen: true } : {}),
    })
    .eq("id", spieltagId);
  if (e1) return { ok: false, fehler: "Speichern hat nicht geklappt. Deine Eingaben sind noch da. Versuch es noch mal." };

  const ids = zeilen.map((z) => z.profil_id);
  let entfernen = supabase.from("ergebnisse").delete().eq("spieltag_id", spieltagId);
  if (ids.length) entfernen = entfernen.not("profil_id", "in", `(${ids.join(",")})`);
  const { error: e2 } = await entfernen;

  const { error: e3 } = ids.length
    ? await supabase.from("ergebnisse").upsert(
        zeilen.map((z) => ({
          spieltag_id: spieltagId,
          profil_id: z.profil_id,
          siege: sauber(z.siege),
          alle_neune: sauber(z.alle_neune),
          kranz: sauber(z.kranz),
          gossen: sauber(z.gossen),
          pudel: sauber(z.pudel),
        })),
      )
    : { error: null };

  if (e2 || e3) return { ok: false, fehler: "Speichern hat nicht geklappt. Deine Eingaben sind noch da. Versuch es noch mal." };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function spieltagLoeschen(form: FormData) {
  await erfassenPflicht();
  const id = String(form.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("spieltage").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/spieltage");
}

/** Nächsten Kegelabend als Spieltag anlegen oder Datum, Uhrzeit, Ort und Notiz ändern. */
export async function spieltagPlanen(_: FormStatus, form: FormData): Promise<FormStatus> {
  await erfassenPflicht();
  const id = String(form.get("id") ?? "");
  const daten = {
    datum: String(form.get("datum") ?? ""),
    uhrzeit: String(form.get("uhrzeit") ?? "") || null,
    ort: String(form.get("ort") ?? "").trim() || null,
    notiz: String(form.get("notiz") ?? "").trim() || null,
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(daten.datum)) return { fehler: "Bitte wähl ein Datum." };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("spieltage").update(daten).eq("id", id)
    : await supabase.from("spieltage").insert(daten);
  if (error) {
    return {
      fehler: error.code === "23505" ? "Für dieses Datum gibt es schon einen Spieltag." : "Speichern hat nicht geklappt. Versuch es noch mal.",
    };
  }
  revalidatePath("/", "layout");
  redirect("/?geplant=1");
}
