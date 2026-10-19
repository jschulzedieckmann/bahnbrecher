// Lädt die Startdaten in Supabase: Mitglieder, vergangene Kegelabende, Kegelspiele.
// Aufruf: node --env-file=.env.local scripts/startdaten.mjs
// Läuft mehrfach ohne Schaden: Vorhandenes wird übersprungen bzw. aktualisiert.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const start = process.env.START_PASSWORT;
if (!url || !key || !start) {
  console.error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY und START_PASSWORT müssen in .env.local stehen.");
  process.exit(1);
}

// Muss zu src/lib/zugang.ts passen.
const DOMAIN = "mitglied.bahnbrecher.invalid";
const ZUSATZ = "Gut-Holz!";

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const MITGLIEDER = [
  { name: "Julian", benutzername: "julian", vorname: "Julian", kuerzel: null, rolle: "admin" },
  { name: "Christopher", benutzername: "christopher", vorname: "Christopher", kuerzel: null, rolle: "mitglied" },
  { name: "Christian L.", benutzername: "christianl", vorname: "Christian", kuerzel: "L.", rolle: "mitglied" },
  { name: "Nico", benutzername: "nico", vorname: "Nico", kuerzel: null, rolle: "mitglied" },
  { name: "Alex", benutzername: "alex", vorname: "Alex", kuerzel: null, rolle: "mitglied" },
  { name: "Sven", benutzername: "sven", vorname: "Sven", kuerzel: null, rolle: "mitglied" },
  { name: "Hendrik", benutzername: "hendrik", vorname: "Hendrik", kuerzel: null, rolle: "mitglied" },
  { name: "Marcus", benutzername: "marcus", vorname: "Marcus", kuerzel: null, rolle: "mitglied" },
];

async function pruefe(schritt, { error }) {
  if (error) {
    console.error(`Fehler bei ${schritt}:`, error.message);
    process.exit(1);
  }
}

// 1. Mitglieder -----------------------------------------------------------------
const { data: liste } = await db.auth.admin.listUsers({ perPage: 200 });
const idNachName = new Map();
for (const m of MITGLIEDER) {
  const email = `${m.benutzername}@${DOMAIN}`;
  let user = liste?.users.find((u) => u.email === email);
  if (!user) {
    const res = await db.auth.admin.createUser({ email, password: `${ZUSATZ}${start}`, email_confirm: true });
    await pruefe(`Zugang ${m.benutzername}`, res);
    user = res.data.user;
    console.log(`Zugang angelegt: ${m.benutzername}`);
  }
  const { data: vorhanden } = await db.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (!vorhanden) {
    await pruefe(`Profil ${m.benutzername}`, await db.from("profiles").insert({
      id: user.id,
      benutzername: m.benutzername,
      vorname: m.vorname,
      nachname_kuerzel: m.kuerzel,
      rolle: m.rolle,
      dabei_seit: "2026-02-01",
    }));
  }
  idNachName.set(m.name, user.id);
}

// 2. Vergangene Kegelabende ------------------------------------------------------
const abende = JSON.parse(readFileSync("inhalte/kegelabende.json", "utf8"));
for (const tag of abende.spieltage) {
  const gossenErfasst = tag.ergebnisse.every((e) => e.gossen !== null);
  const pudelErfasst = tag.ergebnisse.every((e) => e.pudel !== null);
  const res = await db
    .from("spieltage")
    .upsert({ datum: tag.datum, abgeschlossen: true, gossen_erfasst: gossenErfasst, pudel_erfasst: pudelErfasst }, { onConflict: "datum" })
    .select("id")
    .single();
  await pruefe(`Spieltag ${tag.datum}`, res);
  const zeilen = tag.ergebnisse.map((e) => ({
    spieltag_id: res.data.id,
    profil_id: idNachName.get(e.name),
    siege: e.siege,
    alle_neune: e.alle_neune,
    kranz: e.kranz,
    gossen: e.gossen ?? 0,
    pudel: e.pudel ?? 0,
  }));
  await pruefe(`Ergebnisse ${tag.datum}`, await db.from("ergebnisse").upsert(zeilen));
  console.log(`Spieltag ${tag.datum}: ${zeilen.length} dabei`);
}

// 3. Kegelspiele -------------------------------------------------------------------
const spiele = JSON.parse(readFileSync("inhalte/kegelspiele.json", "utf8"));
await pruefe("Kegelspiele", await db.from("kegelspiele").upsert(spiele, { onConflict: "name" }));
console.log(`${spiele.length} Kegelspiele geladen`);

console.log("Fertig. Gut Holz!");
