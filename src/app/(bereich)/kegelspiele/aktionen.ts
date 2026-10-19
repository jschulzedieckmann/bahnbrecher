"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminPflicht } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { FormStatus } from "@/app/(zugang)/aktionen";

const GRADE = ["leicht", "mittel", "schwer"];
const FORMEN = ["jeder_fuer_sich", "jeder_gegen_jeden", "mannschaften", "einer_gegen_alle", "saisonspiel"];

export async function spielSpeichern(_: FormStatus, form: FormData): Promise<FormStatus> {
  await adminPflicht();
  const id = String(form.get("id") ?? "");
  const daten = {
    name: String(form.get("name") ?? "").trim(),
    schwierigkeit: String(form.get("schwierigkeit") ?? ""),
    form: String(form.get("form") ?? ""),
    regel: String(form.get("regel") ?? "").trim(),
    bei_uns: String(form.get("bei_uns") ?? "").trim() || null,
  };
  if (!daten.name) return { fehler: "Bitte gib dem Spiel einen Namen." };
  if (!daten.regel) return { fehler: "Bitte beschreib kurz, wie das Spiel geht." };
  if (!GRADE.includes(daten.schwierigkeit) || !FORMEN.includes(daten.form)) return { fehler: "Bitte wähl Schwierigkeit und Form." };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("kegelspiele").update(daten).eq("id", id)
    : await supabase.from("kegelspiele").insert(daten);
  if (error) {
    return { fehler: error.code === "23505" ? "Ein Spiel mit diesem Namen gibt es schon." : "Speichern hat nicht geklappt. Versuch es noch mal." };
  }
  revalidatePath("/kegelspiele", "layout");
  redirect("/kegelspiele");
}

export async function spielLoeschen(form: FormData) {
  await adminPflicht();
  const supabase = await createClient();
  await supabase.from("kegelspiele").delete().eq("id", String(form.get("id") ?? ""));
  revalidatePath("/kegelspiele", "layout");
  redirect("/kegelspiele");
}
