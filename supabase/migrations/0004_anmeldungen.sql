-- Zu- und Absagen für einen Spieltag. Admin und Schriftführer tragen sie ein
-- (Antworten kommen per WhatsApp). Keine Zeile heißt: noch offen.

create type public.anmeldestatus as enum ('dabei', 'abgesagt');

create table public.anmeldungen (
  spieltag_id uuid not null references public.spieltage (id) on delete cascade,
  profil_id uuid not null references public.profiles (id) on delete cascade,
  status public.anmeldestatus not null,
  geaendert_am timestamptz not null default now(),
  geaendert_von uuid references public.profiles (id) on delete set null,
  primary key (spieltag_id, profil_id)
);
create index anmeldungen_profil_idx on public.anmeldungen (profil_id);
create index anmeldungen_geaendert_von_idx on public.anmeldungen (geaendert_von);

alter table public.anmeldungen enable row level security;

create policy "lesen" on public.anmeldungen
  for select to authenticated using ((select privat.ist_mitglied()));
create policy "anlegen" on public.anmeldungen
  for insert to authenticated with check ((select privat.darf_erfassen()));
create policy "ändern" on public.anmeldungen
  for update to authenticated using ((select privat.darf_erfassen())) with check ((select privat.darf_erfassen()));
create policy "löschen" on public.anmeldungen
  for delete to authenticated using ((select privat.darf_erfassen()));
