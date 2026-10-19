-- Rechte-Funktionen aus dem öffentlichen API-Schema in ein privates Schema verschieben.
-- Die Policies verweisen auf die Funktionen, nicht auf ihren Namen, und gelten unverändert weiter.
-- Hinweis: Der Performance-Berater meldet mehrere permissive Policies pro Tabelle.
-- Bei maximal 12 Mitgliedern ist das ohne spürbare Wirkung und bleibt bewusst so.

create schema if not exists privat;
revoke all on schema privat from public, anon;
grant usage on schema privat to authenticated;

alter function public.ist_mitglied() set schema privat;
alter function public.ist_admin() set schema privat;
alter function public.darf_erfassen() set schema privat;
