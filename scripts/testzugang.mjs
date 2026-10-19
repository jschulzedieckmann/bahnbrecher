// Vorübergehender Testzugang für Prüfungen. Nicht für echte Mitglieder.
// Anlegen:  node --env-file=.env.local scripts/testzugang.mjs anlegen
// Löschen:  node --env-file=.env.local scripts/testzugang.mjs loeschen
// Der Zugang startet mit dem Startpasswort aus .env.local und muss es beim ersten Login ändern.

import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const email = "testzugang@mitglied.bahnbrecher.invalid";
const { data } = await db.auth.admin.listUsers({ perPage: 200 });
const vorhanden = data?.users.find((u) => u.email === email);

if (process.argv[2] === "loeschen") {
  if (vorhanden) {
    await db.from("ergebnisse").delete().eq("profil_id", vorhanden.id);
    await db.from("termine").update({ erstellt_von: null }).eq("erstellt_von", vorhanden.id);
    await db.auth.admin.deleteUser(vorhanden.id);
  }
  console.log("Testzugang gelöscht.");
} else {
  if (vorhanden) await db.auth.admin.deleteUser(vorhanden.id);
  const res = await db.auth.admin.createUser({ email, password: `Gut-Holz!${process.env.START_PASSWORT}`, email_confirm: true });
  if (res.error) throw res.error;
  const { error } = await db.from("profiles").insert({
    id: res.data.user.id, benutzername: "testzugang", vorname: "Test", rolle: "admin",
  });
  if (error) throw error;
  console.log("Testzugang angelegt (Benutzername testzugang, Rolle admin).");
}
