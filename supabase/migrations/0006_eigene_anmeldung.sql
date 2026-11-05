-- Jedes Mitglied darf die eigene Antwort setzen, ändern und auf „offen“ zurücksetzen,
-- aber nur für Spieltage ab heute. Admin und Schriftführer dürfen weiter alles.

alter policy "anlegen" on public.anmeldungen
  with check (
    (select privat.darf_erfassen())
    or (
      profil_id = (select auth.uid())
      and (select privat.ist_mitglied())
      and exists (
        select 1 from public.spieltage s
        where s.id = spieltag_id and s.datum >= (now() at time zone 'Europe/Berlin')::date
      )
    )
  );

alter policy "ändern" on public.anmeldungen
  using (
    (select privat.darf_erfassen())
    or (
      profil_id = (select auth.uid())
      and (select privat.ist_mitglied())
      and exists (
        select 1 from public.spieltage s
        where s.id = spieltag_id and s.datum >= (now() at time zone 'Europe/Berlin')::date
      )
    )
  )
  with check (
    (select privat.darf_erfassen())
    or (
      profil_id = (select auth.uid())
      and (select privat.ist_mitglied())
      and exists (
        select 1 from public.spieltage s
        where s.id = spieltag_id and s.datum >= (now() at time zone 'Europe/Berlin')::date
      )
    )
  );

alter policy "löschen" on public.anmeldungen
  using (
    (select privat.darf_erfassen())
    or (
      profil_id = (select auth.uid())
      and (select privat.ist_mitglied())
      and exists (
        select 1 from public.spieltage s
        where s.id = spieltag_id and s.datum >= (now() at time zone 'Europe/Berlin')::date
      )
    )
  );
