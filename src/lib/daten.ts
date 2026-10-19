import "server-only";
import { createClient } from "@/lib/supabase/server";
import { anzeigename } from "@/lib/auth";
import { heuteIso } from "@/lib/format";

export type Termin = {
  id: string;
  art: "kegelabend" | "ausflug" | "sonstiges";
  titel: string | null;
  datum: string;
  uhrzeit: string | null;
  ort: string | null;
  notiz: string | null;
};

export type Spieltag = {
  id: string;
  datum: string;
  uhrzeit: string | null;
  ort: string | null;
  notiz: string | null;
  abgeschlossen: boolean;
  gossen_erfasst: boolean;
  pudel_erfasst: boolean;
};

const SPIELTAG_FELDER = "id, datum, uhrzeit, ort, notiz, abgeschlossen, gossen_erfasst, pudel_erfasst";

export type Ergebnis = {
  spieltag_id: string;
  profil_id: string;
  siege: number;
  alle_neune: number;
  kranz: number;
  gossen: number;
  pudel: number;
};

export type MitgliedKurz = {
  id: string;
  vorname: string;
  nachname_kuerzel: string | null;
  rolle: "mitglied" | "schriftfuehrer" | "admin";
  dabei_seit: string | null;
  aktiv: boolean;
};

export const WERTE = ["siege", "alle_neune", "kranz", "gossen", "pudel"] as const;
export type Wert = (typeof WERTE)[number];

export const WERT_NAME: Record<Wert, string> = {
  siege: "Siege",
  alle_neune: "alle Neune",
  kranz: "Kranz",
  gossen: "Gossen",
  pudel: "Pudel",
};

export async function termine(von: "kommend" | "vergangen", limit?: number): Promise<Termin[]> {
  const supabase = await createClient();
  let q = supabase.from("termine").select("id, art, titel, datum, uhrzeit, ort, notiz");
  q = von === "kommend"
    ? q.gte("datum", heuteIso()).order("datum").order("uhrzeit", { nullsFirst: true })
    : q.lt("datum", heuteIso()).order("datum", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as Termin[];
}

export async function termin(id: string): Promise<Termin | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("termine").select("id, art, titel, datum, uhrzeit, ort, notiz").eq("id", id).maybeSingle();
  return (data as Termin | null) ?? null;
}

export async function mitglieder(nurAktive = true): Promise<MitgliedKurz[]> {
  const supabase = await createClient();
  let q = supabase.from("profiles").select("id, vorname, nachname_kuerzel, rolle, dabei_seit, aktiv").order("vorname");
  if (nurAktive) q = q.eq("aktiv", true);
  const { data } = await q;
  return (data ?? []) as MitgliedKurz[];
}

export async function spieltage(jahr?: number): Promise<Spieltag[]> {
  const supabase = await createClient();
  let q = supabase.from("spieltage").select(SPIELTAG_FELDER).order("datum", { ascending: false });
  if (jahr) q = q.gte("datum", `${jahr}-01-01`).lte("datum", `${jahr}-12-31`);
  const { data } = await q;
  return (data ?? []) as Spieltag[];
}

/** Der nächste Spieltag ab heute, ob schon mit Ergebnissen oder nur geplant. */
export async function naechsterSpieltag(): Promise<Spieltag | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("spieltage")
    .select(SPIELTAG_FELDER)
    .gte("datum", heuteIso())
    .order("datum")
    .limit(1)
    .maybeSingle();
  return (data as Spieltag | null) ?? null;
}

export async function spieltag(id: string): Promise<Spieltag | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("spieltage").select(SPIELTAG_FELDER).eq("id", id).maybeSingle();
  return (data as Spieltag | null) ?? null;
}

export async function ergebnisse(spieltagIds: string[]): Promise<Ergebnis[]> {
  if (spieltagIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("ergebnisse")
    .select("spieltag_id, profil_id, siege, alle_neune, kranz, gossen, pudel")
    .in("spieltag_id", spieltagIds);
  return (data ?? []) as Ergebnis[];
}

export type Anmeldung = { profil_id: string; status: "dabei" | "abgesagt" };

export async function anmeldungen(spieltagId: string): Promise<Anmeldung[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("anmeldungen").select("profil_id, status").eq("spieltag_id", spieltagId);
  return (data ?? []) as Anmeldung[];
}

/** Zu- und Absagen als Namenslisten. Wer nichts gemeldet hat, ist offen. Nur aktive Mitglieder. */
export function anmeldeListe(anm: Anmeldung[], leute: MitgliedKurz[]) {
  const status = new Map(anm.map((a) => [a.profil_id, a.status]));
  const liste = { dabei: [] as MitgliedKurz[], abgesagt: [] as MitgliedKurz[], offen: [] as MitgliedKurz[] };
  for (const m of leute.filter((x) => x.aktiv).sort((a, b) => anzeigename(a).localeCompare(anzeigename(b), "de"))) {
    const st = status.get(m.id);
    (st === "dabei" ? liste.dabei : st === "abgesagt" ? liste.abgesagt : liste.offen).push(m);
  }
  return liste;
}

export async function verfuegbareJahre(): Promise<number[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("spieltage").select("datum").order("datum", { ascending: false });
  const jahre = new Set((data ?? []).map((r: { datum: string }) => Number(r.datum.slice(0, 4))));
  jahre.add(Number(heuteIso().slice(0, 4)));
  return [...jahre].sort((a, b) => b - a);
}

/** Der jüngste Spieltag bis heute, an dem mindestens eine Person eingetragen ist (auch wenn noch offen). */
export async function letzterGewerteterSpieltag(alle: Spieltag[]): Promise<Spieltag | undefined> {
  const kandidaten = alle.filter((t) => t.datum <= heuteIso()).slice(0, 6);
  const erg = await ergebnisse(kandidaten.map((t) => t.id));
  return kandidaten.find((t) => erg.some((e) => e.spieltag_id === t.id));
}

/** Wer in einem Wert über das ganze Jahr vorn liegt, z. B. Gossenjunge (Gossen) oder Kegelkönig (Siege). Gleichstand teilt den Titel. */
export function jahresSpitze(zeilen: Zeile[], wert: Wert) {
  const max = Math.max(0, ...zeilen.map((z) => z[wert]));
  if (max === 0) return null;
  const spitze = zeilen.filter((z) => z[wert] === max).sort((a, b) => a.name.localeCompare(b.name, "de"));
  return { namen: spitze.map((z) => z.name), ids: spitze.map((z) => z.profil_id), anzahl: max };
}

/** Wer an einem Spieltag die meisten Gossen hatte. Leere Liste, wenn nicht gezählt. */
export function gossenjungenVon(tag: Spieltag, erg: Ergebnis[], namen: Map<string, string>) {
  if (!tag.gossen_erfasst) return { namen: [] as string[], anzahl: 0 };
  const eigene = erg.filter((e) => e.spieltag_id === tag.id);
  const max = Math.max(0, ...eigene.map((e) => e.gossen));
  if (max === 0) return { namen: [] as string[], anzahl: 0 };
  return {
    namen: eigene.filter((e) => e.gossen === max).map((e) => namen.get(e.profil_id) ?? "?").sort((a, b) => a.localeCompare(b, "de")),
    anzahl: max,
  };
}

export type Zeile = {
  profil_id: string;
  name: string;
  dabei: number;
  siege: number;
  alle_neune: number;
  kranz: number;
  gossen: number;
  pudel: number;
};

/** Summen pro Mitglied über die gegebenen Spieltage. */
export function auswertung(tage: Spieltag[], erg: Ergebnis[], leute: MitgliedKurz[]): Zeile[] {
  const namen = new Map(leute.map((m) => [m.id, anzeigename(m)]));
  const zeilen = new Map<string, Zeile>();
  for (const e of erg) {
    const z = zeilen.get(e.profil_id) ?? {
      profil_id: e.profil_id,
      name: namen.get(e.profil_id) ?? "?",
      dabei: 0, siege: 0, alle_neune: 0, kranz: 0, gossen: 0, pudel: 0,
    };
    z.dabei += 1;
    for (const w of WERTE) z[w] += e[w];
    zeilen.set(e.profil_id, z);
  }
  return [...zeilen.values()];
}

export function namensKarte(leute: MitgliedKurz[]) {
  return new Map(leute.map((m) => [m.id, anzeigename(m)]));
}

export type Einstellungen = {
  beitrag_empfaenger: string | null;
  beitrag_iban: string | null;
  beitrag_verwendungszweck: string | null;
  beitrag_betrag: number | null;
  kasse_stand: number | null;
  kasse_stand_am: string | null;
};

export async function einstellungen(): Promise<Einstellungen | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("einstellungen")
    .select("beitrag_empfaenger, beitrag_iban, beitrag_verwendungszweck, beitrag_betrag, kasse_stand, kasse_stand_am")
    .maybeSingle();
  return (data as Einstellungen | null) ?? null;
}

export type Kegelspiel = {
  id: string;
  name: string;
  schwierigkeit: "leicht" | "mittel" | "schwer";
  form: "jeder_fuer_sich" | "jeder_gegen_jeden" | "mannschaften" | "einer_gegen_alle" | "saisonspiel";
  regel: string;
  bei_uns: string | null;
};

export const FORM_NAME: Record<Kegelspiel["form"], string> = {
  jeder_fuer_sich: "jeder für sich",
  jeder_gegen_jeden: "jeder gegen jeden",
  mannschaften: "Mannschaften",
  einer_gegen_alle: "einer gegen alle",
  saisonspiel: "Saisonspiel",
};

export async function kegelspiele(): Promise<Kegelspiel[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("kegelspiele").select("id, name, schwierigkeit, form, regel, bei_uns").order("name");
  return (data ?? []) as Kegelspiel[];
}
