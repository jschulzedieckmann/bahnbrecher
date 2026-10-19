-- Bahnbrecher-App: Grundschema
-- Rollen: mitglied, schriftfuehrer, admin. Alles nur für angemeldete, aktive
-- Mitglieder, die ihr Startpasswort schon ersetzt haben.

create type public.rolle as enum ('mitglied', 'schriftfuehrer', 'admin');
create type public.terminart as enum ('kegelabend', 'ausflug', 'sonstiges');
create type public.schwierigkeit as enum ('leicht', 'mittel', 'schwer');
create type public.spielform as enum ('jeder_fuer_sich', 'jeder_gegen_jeden', 'mannschaften', 'einer_gegen_alle', 'saisonspiel');

-- Mitglieder ---------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  benutzername text not null unique check (benutzername ~ '^[a-z0-9._-]{2,32}$'),
  vorname text not null,
  nachname_kuerzel text,
  rolle public.rolle not null default 'mitglied',
  dabei_seit date,
  aktiv boolean not null default true,
  muss_passwort_aendern boolean not null default true,
  passwort_zurueckgesetzt_am timestamptz not null default now(),
  erstellt_am timestamptz not null default now()
);

comment on column public.profiles.passwort_zurueckgesetzt_am is
  'Zeitpunkt, ab dem das Startpasswort gilt. Nach 7 Tagen ohne eigenes Passwort sperrt die App den Zugang.';

-- Termine --------------------------------------------------------------------

create table public.termine (
  id uuid primary key default gen_random_uuid(),
  art public.terminart not null default 'kegelabend',
  titel text,
  datum date not null,
  uhrzeit time,
  ort text,
  notiz text,
  erstellt_von uuid references public.profiles (id) on delete set null,
  erstellt_am timestamptz not null default now()
);
create index termine_datum_idx on public.termine (datum);
create index termine_erstellt_von_idx on public.termine (erstellt_von);

-- Spieltage und Ergebnisse ---------------------------------------------------

create table public.spieltage (
  id uuid primary key default gen_random_uuid(),
  datum date not null unique,
  abgeschlossen boolean not null default false,
  -- false heißt: an diesem Abend wurden Gossen bzw. Pudel nicht gezählt
  gossen_erfasst boolean not null default true,
  pudel_erfasst boolean not null default true,
  erstellt_am timestamptz not null default now()
);

-- Eine Zeile pro anwesendem Mitglied. Keine Zeile heißt: nicht dabei.
create table public.ergebnisse (
  spieltag_id uuid not null references public.spieltage (id) on delete cascade,
  profil_id uuid not null references public.profiles (id) on delete restrict,
  siege int not null default 0 check (siege >= 0),
  alle_neune int not null default 0 check (alle_neune >= 0),
  kranz int not null default 0 check (kranz >= 0),
  gossen int not null default 0 check (gossen >= 0),
  pudel int not null default 0 check (pudel >= 0),
  primary key (spieltag_id, profil_id)
);
create index ergebnisse_profil_idx on public.ergebnisse (profil_id);

-- Kegelspiele ------------------------------------------------------------------

create table public.kegelspiele (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  schwierigkeit public.schwierigkeit not null,
  form public.spielform not null,
  regel text not null,
  bei_uns text,
  erstellt_am timestamptz not null default now()
);

-- Einstellungen (genau eine Zeile) ------------------------------------------------

create table public.einstellungen (
  id boolean primary key default true check (id),
  beitrag_empfaenger text,
  beitrag_iban text,
  beitrag_verwendungszweck text default 'Monatsbeitrag',
  beitrag_betrag numeric(6, 2) default 8.00
);
insert into public.einstellungen (id) values (true);

-- Hilfsfunktionen für die Rechte ------------------------------------------------

create or replace function public.ist_mitglied()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and aktiv and not muss_passwort_aendern
  );
$$;

create or replace function public.ist_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and aktiv and not muss_passwort_aendern and rolle = 'admin'
  );
$$;

create or replace function public.darf_erfassen()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and aktiv and not muss_passwort_aendern
      and rolle in ('admin', 'schriftfuehrer')
  );
$$;

revoke all on function public.ist_mitglied(), public.ist_admin(), public.darf_erfassen() from public, anon;
grant execute on function public.ist_mitglied(), public.ist_admin(), public.darf_erfassen() to authenticated;

-- Row Level Security -------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.termine enable row level security;
alter table public.spieltage enable row level security;
alter table public.ergebnisse enable row level security;
alter table public.kegelspiele enable row level security;
alter table public.einstellungen enable row level security;

-- Das eigene Profil ist immer lesbar (nötig für den ersten Login).
create policy "eigenes Profil lesen" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "Mitglieder lesen Profile" on public.profiles
  for select to authenticated using (public.ist_mitglied());
-- Änderungen an Profilen laufen nur über die Verwaltung auf dem Server (secret key).

create policy "Mitglieder lesen Termine" on public.termine
  for select to authenticated using (public.ist_mitglied());
create policy "Admin schreibt Termine" on public.termine
  for all to authenticated using (public.ist_admin()) with check (public.ist_admin());

create policy "Mitglieder lesen Spieltage" on public.spieltage
  for select to authenticated using (public.ist_mitglied());
create policy "Schriftführer schreibt Spieltage" on public.spieltage
  for all to authenticated using (public.darf_erfassen()) with check (public.darf_erfassen());

create policy "Mitglieder lesen Ergebnisse" on public.ergebnisse
  for select to authenticated using (public.ist_mitglied());
create policy "Schriftführer schreibt Ergebnisse" on public.ergebnisse
  for all to authenticated using (public.darf_erfassen()) with check (public.darf_erfassen());

create policy "Mitglieder lesen Kegelspiele" on public.kegelspiele
  for select to authenticated using (public.ist_mitglied());
create policy "Admin schreibt Kegelspiele" on public.kegelspiele
  for all to authenticated using (public.ist_admin()) with check (public.ist_admin());

create policy "Mitglieder lesen Einstellungen" on public.einstellungen
  for select to authenticated using (public.ist_mitglied());
create policy "Admin ändert Einstellungen" on public.einstellungen
  for update to authenticated using (public.ist_admin()) with check (public.ist_admin());
