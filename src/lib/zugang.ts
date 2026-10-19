// Supabase verlangt E-Mail-Adresse und Passwörter mit mindestens 6 Zeichen.
// Die Bahnbrecher melden sich mit Benutzernamen an, und das Startpasswort ist
// kürzer. Beides wird hier in das Format übersetzt, das Supabase erwartet.
// Es werden keine Mails verschickt: Die Domain .invalid ist nie zustellbar.

const DOMAIN = "mitglied.bahnbrecher.invalid";
const PASSWORT_ZUSATZ = "Gut-Holz!";

export function benutzernameNormalisieren(eingabe: string): string {
  return eingabe.trim().toLowerCase();
}

export function benutzernameZuEmail(benutzername: string): string {
  return `${benutzernameNormalisieren(benutzername)}@${DOMAIN}`;
}

export function passwortFuerSupabase(passwort: string): string {
  return `${PASSWORT_ZUSATZ}${passwort}`;
}

export const MIN_PASSWORT_LAENGE = 8;

/** Tage, die ein zurückgesetzter Zugang mit dem Startpasswort benutzbar bleibt. */
export const STARTPASSWORT_GUELTIG_TAGE = 7;
