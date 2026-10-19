# Die Bahnbrecher

Geschlossene Mitglieder-App des Kegelclubs „Die Bahnbrecher“ aus Lüdinghausen: Termine, Spieltage mit Statistik, Kegelspiele, Satzung und Beitrag. Nur mit Login.

## Technik

- Next.js 16 (App Router, `src/app`), React 19, TypeScript
- Supabase (Login, Postgres mit Row Level Security), Projekt in Frankfurt
- Hosting auf Vercel, Region Frankfurt; täglicher Wachhalte-Aufruf `/api/wach` per Vercel Cron

## Lokal starten

1. `.env.example` nach `.env.local` kopieren und ausfüllen (Werte im Supabase-Dashboard).
2. `npm install`
3. `npm run dev`, dann http://localhost:3000

## Datenbank

- Schema: `supabase/migrations/`
- Startdaten (Mitglieder, vergangene Kegelabende, Kegelspiele): `node --env-file=.env.local scripts/startdaten.mjs`
- Vorübergehender Testzugang für Prüfungen: `scripts/testzugang.mjs anlegen` bzw. `loeschen`

## Weitere Unterlagen

- `PRODUCT.md`: wofür die App da ist
- `DESIGN.md`: Design-System
- `texte.md`: alle Texte der App
- `WEBSITE-STATUS.md`: Projektstand und Entscheidungen
