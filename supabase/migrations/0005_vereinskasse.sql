-- Kassenstand für die Kachel auf der Startseite. Der Admin trägt ihn in der Verwaltung ein.
-- Nur neue Spalten, die Rechte der Tabelle einstellungen gelten weiter
-- (alle Mitglieder lesen, nur der Admin ändert).

alter table public.einstellungen
  add column kasse_stand numeric(10, 2),
  add column kasse_stand_am date,
  add column kasse_ziel numeric(10, 2) check (kasse_ziel is null or kasse_ziel > 0),
  add column kasse_ziel_text text;
