# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ | 2026-10-18 |
| 1 | Fundament | ✅ | 2026-10-18 |
| 2 | Recherche | ✅ | 2026-10-18 |
| 3 | Texte | ✅ | 2026-10-18 |
| 4 | Design-Richtung | ✅ | 2026-10-18 |
| 5 | Bauen | ✅ | 2026-10-19 |
| 6 | Prüfen und Feinschliff | ✅ | 2026-10-19 |
| 7 | Livegang | ✅ | 2026-10-19 |
| 8 | Danach | 🔄 | 2026-10-19 |

## Ausgangslage

- Bestehende Website oder Marke: keine Website, aber Logo/Markendateien vorhanden (Name: Bahnbrecher)
- Hauptziel der Seite: geschlossener Mitgliederbereich (nur mit Login) für Termine, Statistiken und Vereinsinfos. Ursprünglich „informieren“ gewählt, am 2026-10-18 präzisiert.
- Hosting: Vercel (Region Frankfurt), live unter https://bahnbrecher.vercel.app, Code in github.com/jschulzedieckmann/bahnbrecher (privat)
- Werkzeuge: impeccable ✅ (Plugin 4.6.0, Projekt; nach Neustart geladen) · Playwright ✅ (1.64, nutzt installiertes Chrome, channel="chrome") · DataForSEO – (bewusst weggelassen, Recherche ohne Suchdaten) · Hosting: Vercel per GitHub ✅ · Supabase-MCP ✅ · Node.js 24 ✅ · Formular: entfällt (kein Kontaktformular)

## Marke

| Rolle | Wert |
|---|---|
| Hauptfarbe | Gelb #FED51C (Schriftzug, Bier; ca. 10 % der Logofläche) |
| Akzent | Rot #EB0620 (Kontur, Kegelringe) · Blau #0F8AC7 (Himmel, Wasser) · Grün #25904C (Bäume, nur Nebenfarbe) |
| helle Fläche | Creme #FEF7DE |
| Text | Fast-Schwarz #000C16 (blaustichig, Konturen und Ring) |
| Überschriften | im Logo: fette, schräge Retro-Schreibschrift mit roter Kontur; Webschrift noch offen (Phase 4) |
| Fließtext | im Logo: kräftige Antiqua in Versalien ("LÜDINGHAUSEN"); Webschrift noch offen (Phase 4) |
| Merkmale | rundes Emblem im Retro-Plakatstil, dicke dunkle Konturen, Burg Lüdinghausen am Wasser, Bierkrug, Kegel und Kugel auf Holzbahn, Schild "Gaststätte Schwenken", Ähren |

Gemessen am 2026-10-18 aus `logo.png` (1254 × 1254 px, PNG ohne Transparenz, Hintergrund Creme). Keine Live-Seite, kein Styleguide.

## Entscheidungen

Jede Entscheidung der Person mit Datum, damit sie nicht erneut diskutiert wird.

- 2026-10-18: Recherche ohne DataForSEO.
- 2026-10-18: Hosting auf Netlify/Vercel.
- 2026-10-18: Verein: Die Bahnbrecher, neu gegründeter Kegelclub aus Lüdinghausen (junge Väter und Leute, die gern Zeit miteinander verbringen), Kegelbahn Gaststätte Schwenken.
- 2026-10-18: Zielgruppe sind nur die Mitglieder. Ohne Login kein Zugang. Jedes Mitglied hat einen eigenen Account, dazu gibt es einen Admin.
- 2026-10-18: Inhalte: nächster Kegeltermin und weitere Termine (z. B. Ausflüge, vom Admin angelegt), Statistiken pro Spieltag und Jahr (Gossen, alle 9e, Kranzwürfe, Pudel, Gewinne), Mitgliederübersicht, Spieltage, Sammlung von Kegelspielen mit Schwierigkeitsgrad, eventuell Fotogalerie.
- 2026-10-18: Ansprache „du“.
- 2026-10-18: Logo bleibt. Dazu kommt ein eigenes, vereinfachtes Favicon.
- 2026-10-18: Prozess angepasst: Es wird eine Mitglieder-Web-App. Keine SEO-, Keyword- oder GEO-Arbeit, die Seite wird für Suchmaschinen gesperrt (noindex). Phase 2 recherchiert stattdessen Vorbilder für Vereins- und Statistik-Apps und sammelt Kegelspiele. Phase 5 baut zusätzlich Login, Rollen und Datenbank.
- 2026-10-18: Technik: Supabase (Login, Datenbank, Fotospeicher, EU-Region) + Vercel. Ein Keep-alive-Ping verhindert, dass der Gratis-Tarif pausiert.
- 2026-10-18: Oberfläche mit Next.js (React). Genutzt wird die App gleichermaßen am Handy und am PC. Bis etwa 12 Mitglieder, laut Satzung Treffen alle 4 Wochen.
- 2026-10-18: Rollen: Admin, Schriftführer (darf Spieltage eintragen, vom Admin vergeben) und Mitglied.
- 2026-10-18: Accounts legt der Admin an und sagt den Mitgliedern Bescheid. Startpasswort ist ein gemeinsames Standardpasswort (steht bewusst nicht in Projektdateien). Beim ersten Login muss jedes Mitglied es ändern.

- 2026-10-18: Satzung geliefert und unter `inhalte/satzung.md` abgelegt. Sie wird im Mitgliederbereich angezeigt.
- 2026-10-18: Begriff einheitlich „Gosse“ und „Gossenjunge“ statt „Gasse“, auch in der Satzung angepasst. Kegelkönig des Jahres ist, wer die meisten Siege hat.
- 2026-10-18: Kasse nach § 4 kommt später, nicht im ersten Umfang.
- 2026-10-18: Ergebnisse von 3 vergangenen Kegelabenden übernommen (`inhalte/kegelabende.json`, Quelle `inhalte/kegelabende-quelle.md`). Sie werden in Phase 5 als Startdaten in die Datenbank geladen.
- 2026-10-18: Phase 1 abgenommen (Markenprofil, Logo bleibt, PRODUCT.md).
- 2026-10-18: Design-Referenzen gewählt: OLIPOP (Grundwelt: nostalgische Serifenschrift, Creme, Getränke-Charme) und Seline Analytics (Aufbau der Statistik). Notizen in `referenzen/notizen.md`.
- 2026-10-18: Phase 2 abgenommen.
- 2026-10-18: `texte.md` Entwurf 1 geschrieben. 15 Abschnitte, 9 offene Fragen am Ende.
- 2026-10-18: Passwort vergessen: kein Zurücksetzen per E-Mail. Mitglieder fragen den Admin persönlich oder per WhatsApp, der Admin setzt auf das Startpasswort zurück.
- 2026-10-18: Bankverbindung für den Monatsbeitrag geliefert. Sie wird in der App als Admin-Einstellung gepflegt und nicht in Projektdateien oder im Code gespeichert. Der Admin trägt sie nach dem Livegang unter Verwaltung → Beitrag ein. Verwendungszweck: „Monatsbeitrag“.
- 2026-10-18: Phase 3 abgenommen, Empfehlungen übernommen: Login mit Benutzername (keine E-Mail-Adressen), Vorname plus Kürzel, Titel bei Gleichstand geteilt, Begrüßung „Moin“, keine Zu- und Absagen, Galerie später.
- 2026-10-18: Design-Richtung „Brauerei-Plakat“ gewählt (vom Los gezogen und bestätigt). Richtungsvertrag in `.impeccable/surfaces/src-app.md`, Skizze in `.impeccable/mocks/decision/assigned.html`. Schriften: Shrikhand (Markenmomente) und Archivo (UI und Zahlen).
- 2026-10-18: Phase 5 gestartet: Next.js 16 (React 19, TypeScript, src/app) im Projektordner. Admin ist Julian, die Benutzernamen sind die Vornamen klein geschrieben (julian, christopher, christianl, nico, alex, sven, hendrik, marcus). Das Startpasswort wird intern mit einem festen Zusatz verlängert, weil Supabase mindestens 6 Zeichen verlangt. Ein Sieg ist ein gewonnenes Einzelspiel, mehrere pro Abend sind möglich.
- 2026-10-19: App gebaut (noch ohne Datenbank getestet): Anmeldung, Willkommen und Passwortwechsel, Start, Termine, Spieltage mit Erfassung, Statistik, Kegelspiele, Mitglieder, Satzung, Beitrag, Konto und Verwaltung. Schema in `supabase/migrations/0001_init.sql`, Startdaten über `scripts/startdaten.mjs`. Typprüfung, Linter und Build laufen ohne Fehler.
- 2026-10-19: Supabase-Projekt „bahnbrecher“ angelegt (ID dfbluxhogscbtejiscoe, Frankfurt eu-central-1, Free-Tarif). Migrationen 0001 und 0002 sind eingespielt, die Sicherheitsprüfung ist ohne Befund. `.env.local` ist angelegt, geheimer Schlüssel und Startpasswort fehlen noch (trägt die Person selbst ein).
- 2026-10-19: Startdaten geladen (8 Zugänge, 3 Spieltage, 18 Ergebnisse, 18 Kegelspiele). Die Summen stimmen mit der Auswertung überein. Julian hat sein eigenes Passwort gesetzt. Lokal mit Testzugang auf Handy und PC getestet: Anmeldung, Willkommen, alle Seiten, Termin anlegen und löschen, Spieltag erfassen, abschließen und löschen. Fehler behoben, Testzugang und Testdaten wieder entfernt. Start lokal: Vorschau „bahnbrecher“ (npm run dev, Port 3000).
- 2026-10-19: Phase 6: Prüfdurchgang (48 Aufnahmen, kein seitliches Scrollen, je eine H1, keine Schrift unter 12px). Unabhängiger Finish-Reviewer: erst „recapture“, dann „fix“ mit 8 Punkten, nach dem Fix-Durchgang „ship“ für alle 8 (das Urteil deckt die 8 Punkte ab, keine Gesamtprüfung jeder Seite). DESIGN.md und .impeccable/design.json vom Documenter geschrieben, die Bilder tragen ihre Herkunft. impeccable detect: 0 Befunde, mit 2 eng begrenzten Ausnahmen für dokumentierte Größen der Wortmarke. Regler-Panel entfällt (für statische Seiten gedacht), Feinschliff per Chat.
- 2026-10-19: Phase 6 abgenommen.
- 2026-10-19: Phase 7 angepasst an die Mitglieder-App: keine Sitemap, kein llms.txt, keine strukturierten Daten und kein Formular. robots.txt und der Header X-Robots-Tag sperren Suchmaschinen.
- 2026-10-19: Cookies und AGB geprüft: Vor dem Login gibt es keine Cookies, keinen lokalen Speicher und keine fremden Hosts, nach dem Login nur das Supabase-Login-Cookie (technisch nötig). Kein Banner nötig, keine AGB (kein Verkauf). Keine Rechtsberatung.
- 2026-10-19: Rechtstexte: Die Person hat entschieden, keine anzulegen (kein Impressum, kein Datenschutz-Hinweis). Hinweis auf die Informationspflicht nach Art. 13 DSGVO wurde gegeben, ein Nachrüsten ist jederzeit möglich.
- 2026-10-19: Live: Vercel-Projekt „bahnbrecher“ über GitHub importiert, 5 Umgebungsvariablen von der Person eingetragen. Live geprüft: HTTPS, Umleitung auf /anmelden, robots und noindex, /api/wach liefert 401 ohne Schlüssel, Login mit Testzugang, alle Seiten, Abmelden, keine fremden Hosts. Der Testzugang ist gelöscht. Die Frist der Startpasswörter (7 Mitglieder) wurde neu gestartet und läuft bis 2026-10-26.
- 2026-10-19: Phase 8 angepasst: Search Console, Bing, Profile und SEO-Nachmessung entfallen (geschlossene App). Stattdessen gibt es Betrieb, Einladung der Mitglieder und eine Nutzungsprüfung nach den ersten Kegelabenden. Supabase-Hinweis „Leaked Password Protection“ bleibt bewusst aus: nur im Pro-Tarif verfügbar und durch den internen Passwort-Zusatz ohnehin wirkungslos.
- 2026-10-19: Umbau auf Wunsch: Spieltage stehen im Mittelpunkt. Der nächste Kegelabend wird als Spieltag geplant (neue Spalten uhrzeit, ort, notiz, Migration 0003) und steht immer im Plakat der Startseite, am Abend mit „Spieltag erfassen“. Termine gibt es nur noch für Ausflüge und Sonstiges, auf der Startseite nur sichtbar, wenn einer ansteht. Navigation: Start, Spieltage, Statistik, Spiele, Mehr (Termine unter Mehr). Statistik und Spieltage-Liste zählen nur gespielte Abende. Lokal getestet, Testdaten entfernt. Den echten geplanten Spieltag am 12.11. hat die Person angelegt, er blieb unverändert.
- 2026-10-19: Gossenjunge-Regel: Gossenjunge ist, wer am jüngsten Abend mit gezählten Gossen die meisten hatte, auch wenn der Abend noch offen ist. Abende ohne eine einzige eingetragene Gosse werden übersprungen (Anlass: 15.10. ist offen, 6 dabei, alle Werte 0). Der 27.02. zeigt „Gossen gezählt“ mit Julian 1, abweichend von der Auswertung. Nachgefragt, die Person hat nichts entschieden, deshalb unverändert.
- 2026-10-19: Gossenjunge ist jetzt ein Jahrestitel (die meisten Gossen im laufenden Jahr, Gleichstand teilt), wie der Kegelkönig. Pro Abend heißt es auf den Spieltag-Seiten „Meiste Gossen“. Die Spalte „Gossenjunge (wie oft)“ in der Statistik ist entfallen. Hinweis: § 5 der Satzung beschreibt den Titel noch pro Abend („gilt bis zum nächsten Kegelabend“).
- 2026-10-19: Minispiel „Kegeln“ unter /kegeln: Draufsicht auf die Bahn, Wurf per Wischen (Richtung und Schwung aus der Geste), eigene 2D-Physik (`src/app/(bereich)/kegeln/physik.ts`), Ergebnis „{n} Holz“, „Alle Neune!“, „Kranz!“ oder „Gosse!“. Bestwert nur im Gerät, nichts in der Datenbank. Erreichbar über Mehr, die Seitenleiste und die Kegelspiele-Seite. Der PWA-Plan wurde verworfen.
- 2026-10-18: Handy-Regel: Der Schriftführer darf am Abend aufs Handy schauen.

## Offene Fragen an die Person

- Julian: Bankverbindung unter Verwaltung → Beitrag eintragen.
- Julian: Mitgliedern Link, Benutzernamen und Startpasswort schicken. Die Startpasswörter gelten bis 2026-10-26, danach unter Verwaltung → Mitglied → „Passwort zurücksetzen“ neu starten.
- Julian: Nächsten Kegelabend unter Spieltage planen (12.11. ist schon angelegt, Uhrzeit und Ort fehlen noch).
- Wachhalte-Aufruf: Der erste Lauf ist am 2026-10-20 um 6 Uhr UTC (8 Uhr MESZ). In Vercel unter Settings → Cron Jobs prüfen (noch nicht gesehen).
- Nutzungsprüfung nach den ersten 2 bis 3 Kegelabenden (etwa Mitte Dezember 2026): Haben sich alle angemeldet und ein eigenes Passwort gesetzt? Wird der Spieltag am Abend erfasst? Was fehlt im Alltag?
- Mögliche Ausbaustufen: Kasse nach § 4, Fotogalerie, Zu- und Absagen für Termine, Datenschutz-Hinweis, eigene Domain, App-Symbol für den Startbildschirm (Web-App-Manifest).
- Feste Uhrzeit des Kegelabends? Adresse der Gaststätte Schwenken?
- Auf welcher Bahnart wird in der Gaststätte Schwenken gekegelt (Asphalt, Bohle, Schere)? Das ist wichtig für die Kegelspiele.
- Kegelabende-Daten: Bei anwesenden Spielern wurde eine leere Zelle als 0 übernommen, zum Beispiel Julian am 25.06. bei „alle Neune“. Stimmt das?
- Gemeinsames Startpasswort: Jedes Mitglied kennt es und könnte sich damit in einen Account einloggen, der noch nicht aktiviert ist. Vorschlag: Nicht aktivierte Accounts sperren sich nach ein paar Tagen von selbst. Außerdem prüfen, ob Supabase so kurze Passwörter für das Anlegen erlaubt (Standard sind mindestens 6 Zeichen). Wird in Phase 5 geklärt.
- Datenschutz: Namen, Benutzernamen und Spielergebnisse der Mitglieder werden gespeichert, später eventuell auch Fotos. Kurze Info für die Mitglieder und eine Einwilligung für Fotos werden in Phase 7 geklärt. Das ist keine Rechtsberatung.

## Update-Ablauf nach dem Livegang

1. Änderung im Code und, bei Texten, in `texte.md`
2. Lokal prüfen: `npm run dev`, dann `npx tsc --noEmit` und `npx eslint src`
3. Commit und `git push` auf `main`. Vercel baut und veröffentlicht automatisch.
4. Schemaänderungen als neue Datei in `supabase/migrations/` und über den Supabase-MCP einspielen
5. Live prüfen: https://bahnbrecher.vercel.app
