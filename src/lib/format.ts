const TZ = "Europe/Berlin";

/** Datum als Date in lokaler Mitternacht, aus "YYYY-MM-DD". */
export function datumAus(iso: string): Date {
  const [j, m, t] = iso.split("-").map(Number);
  return new Date(Date.UTC(j, m - 1, t, 12));
}

export function heuteIso(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date());
}

export function wochentagKurz(iso: string) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", timeZone: TZ }).format(datumAus(iso)).replace(".", "");
}

export function wochentagLang(iso: string) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "long", timeZone: TZ }).format(datumAus(iso));
}

/** 13.11. */
export function datumKurz(iso: string) {
  const [, m, t] = iso.split("-");
  return `${t}.${m}.`;
}

/** 13.11.2026 */
export function datumMitJahr(iso: string) {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j}`;
}

/** 13. November 2026 */
export function datumLang(iso: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(datumAus(iso));
}

/** November 2026 */
export function monatJahr(iso: string) {
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: TZ }).format(datumAus(iso));
}

export function uhrzeit(zeit: string | null) {
  return zeit ? zeit.slice(0, 5) : null;
}

export function tageBis(iso: string): number {
  const heute = datumAus(heuteIso());
  return Math.round((datumAus(iso).getTime() - heute.getTime()) / 86_400_000);
}

export function nochTage(iso: string): string {
  const n = tageBis(iso);
  if (n === 0) return "heute";
  if (n === 1) return "morgen";
  return `noch ${n} Tage`;
}

export function namenListe(namen: string[]): string {
  if (namen.length <= 1) return namen[0] ?? "";
  return `${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}`;
}
