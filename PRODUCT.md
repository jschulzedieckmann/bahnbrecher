# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (React), gewählt von der Person. Backend: Supabase (Login, Postgres-Datenbank, Speicher für Fotos, EU-Region). Hosting: Vercel. Ein regelmäßiger Keep-alive-Ping verhindert, dass der Gratis-Tarif von Supabase nach 7 Tagen ohne Nutzung pausiert. Bei einem Treffen alle 4 Wochen wäre das sonst die Regel.

## Users

Die Mitglieder von **Die Bahnbrecher**: ein neu gegründeter Kegelclub aus Lüdinghausen, bis etwa 12 Leute. Junge Väter und Menschen, die gern Zeit miteinander verbringen. Laut Satzung trifft sich der Club alle 4 Wochen, den Termin legt die Gruppe gemeinsam fest. Gekegelt wird auf der Bahn der Gaststätte Schwenken.

Rollen:
- **Mitglied:** schaut nach dem nächsten Termin, den Statistiken und der Mitgliederliste.
- **Schriftführer:** Mitglied, dem der Admin das Eintragen von Spieltagen erlaubt hat.
- **Admin:** legt Mitglieder, Termine und Spieltage an und vergibt die Schriftführer-Rolle.

Genutzt wird die App gleichermaßen am Handy und am PC: am Kegelabend an der Bahn, später zu Hause zum Nachtragen und Anschauen.

## Product Purpose

Ein geschlossener Treffpunkt im Netz für den Club. Er beantwortet die Frage, die sonst in der Gruppe hin und her geht („Wann ist der nächste Kegeltermin?“), und hält fest, was an den Abenden passiert. Erfolgreich ist die App, wenn niemand mehr nach dem Termin fragen muss und die Statistiken am Jahresende ohne Zettelwirtschaft feststehen.

## Positioning

Kein allgemeines Vereinsverwaltungs-Tool, sondern die eigene Seite der Bahnbrecher: mit ihrem Logo, ihrer Bahn und ihren eigenen Zahlen. Sie spricht die Sprache des Kegelabends und der eigenen Satzung (Gosse, Gossenjunge, alle Neune, Kranz, Pudel, Kegelkönig, „Gut Holz!“) statt der Sprache der Vereinsverwaltung.

## Operating Context

- Kegelabend auf der Bahn der Gaststätte Schwenken, Lüdinghausen. Ergebnisse werden pro Spieltag erfasst, entweder live am Handy oder später am PC.
- Weitere Termine neben dem Kegeln, zum Beispiel Ausflüge, legt der Admin an.
- Kleine, vertraute Runde: Alle kennen sich, die Ansprache ist „du“.
- Die Satzung (`inhalte/satzung.md`) prägt den Ton: „Spaß vor Regeln, Zusammenhalt vor Ehrgeiz“, „Die Leistung ist nebensächlich“. Statistiken sind ein Spaß für den Abend und kein Leistungsdruck.
- Laut Satzung bleiben Handys am Kegelabend in der Tasche. Ausnahme: Der Schriftführer, der an dem Abend einträgt, darf aufs Handy schauen. Alle anderen schauen später nach.

## Capabilities and Constraints

Bestätigt:
- **Nur mit Login.** Ohne Anmeldung ist nichts zu sehen. Die Seite wird für Suchmaschinen gesperrt (noindex). Es gibt keine öffentliche Werbeseite.
- **Accounts:** Der Admin legt die Mitglieder an und sagt ihnen Bescheid. Es gibt ein gemeinsames Startpasswort, das beim ersten Login geändert werden muss. Das Passwort selbst steht nicht in Projektdateien. Vergessene Passwörter setzt nur der Admin zurück, nach persönlicher Nachfrage oder per WhatsApp. Er setzt sie auf das Startpasswort zurück. Es gibt kein Zurücksetzen per E-Mail und keinen E-Mail-Versand.
- **Spieltage im Mittelpunkt:** Der nächste Kegelabend wird als Spieltag geplant (Datum, Uhrzeit, Ort, Notiz) und steht immer im Plakat der Startseite. Am Abend selbst werden dort die Ergebnisse erfasst. Planen dürfen Admin und Schriftführer.
- **Anmeldungen:** Zu- und Absagen zum nächsten Spieltag sammelt der Admin per WhatsApp und trägt sie ein (Admin und Schriftführer dürfen das). Plakat der Startseite und Spieltage-Seite zeigen „Dabei“, „Abgesagt“ und „Noch offen“. In der Erfassung am Abend sind die Zugesagten vorausgewählt.
- **Termine** sind zweitrangig und nur für alles neben dem Kegeln da (Ausflüge, Sonstiges). Sie erscheinen auf der Startseite nur, wenn einer ansteht. Angelegt werden sie vom Admin.
- **Spieltage und Statistik:** pro Spieltag und Mitglied werden Gossen, alle Neune, Kranzwürfe, Pudel und Siege festgehalten. Einheitlicher Begriff ist „Gosse“, nicht „Gasse“.
- **Titel:** Gossenjunge ist, wer im laufenden Jahr die meisten Gossen geworfen hat (geändert am 2026-10-19, vorher pro Abend). **Kegelkönig oder Kegelkönigin des Jahres** ist, wer im Jahr die meisten Siege hat. Auswertung pro Spieltag und pro Jahr. Eintragen dürfen Admin und Schriftführer.
- **Mitgliederübersicht.**
- **Satzung:** im Mitgliederbereich lesbar (`inhalte/satzung.md`).
- **Beitrag:** Seite mit Monatsbeitrag (8 € laut § 4) und Bankverbindung für die Überweisung. Empfänger, IBAN und Verwendungszweck pflegt der Admin in der App. Sie stehen nicht im Code und nicht in Projektdateien, weil die Bankdaten nur im geschützten Mitgliederbereich erscheinen sollen. Die eigentliche Kassenführung kommt später.
- **Vereinskasse auf der Startseite:** Kachel mit Kontostand, Datum und optionalem Sparziel mit Füllbalken. Den Stand trägt der Admin in der Verwaltung ein (keine Buchungen, nur der aktuelle Wert).
- **Kegelspiele:** eine Sammlung von Kegelspielen mit Schwierigkeitsgrad.
- **Anmeldung** mit Benutzername und Passwort. Es werden keine E-Mail-Adressen gespeichert.
- **Namen** erscheinen als Vorname plus Kürzel des Nachnamens.
- **Gleichstand** bei Gossenjunge und Kegelkönig: Der Titel wird geteilt.
- **Fotogalerie:** später, nicht im ersten Umfang.
- **Keine Zu- und Absagen** für Termine im ersten Umfang.

Offen:
- Ob ein Sieg ein gewonnenes Einzelspiel ist (mehrere pro Abend möglich) oder der Tagessieg, und ob ein Spieltag an bestimmte Kegelspiele gebunden ist.
- **Kasse** (§ 4: 8 € Monatsbeitrag, offene Ein- und Ausgaben, Kassensturz mit anteiliger Auszahlung): gewünscht für eine spätere Ausbaustufe, nicht im ersten Umfang.
- Welche Statistikarten der Admin später selbst ergänzen kann.
- Wie nicht aktivierte Accounts geschützt werden, da alle das gemeinsame Startpasswort kennen.
- Datenschutz-Hinweis für die Mitglieder und Einwilligung für Fotos.

## Brand Commitments

- Name: **Die Bahnbrecher**, Lüdinghausen.
- Logo: `logo.png`, rundes Emblem im Retro-Plakatstil, bleibt so bestehen. Dazu kommt ein eigenes, vereinfachtes Favicon, weil das Emblem klein nicht lesbar ist.
- Farben aus dem Logo gemessen, siehe `WEBSITE-STATUS.md` (Gelb #FED51C, Rot #EB0620, Blau #0F8AC7, Creme #FEF7DE, Fast-Schwarz #000C16).
- Ansprache: „du“.

## Evidence on Hand

- `inhalte/satzung.md`: die Satzung des Clubs, von der Person geliefert. Einzige Anpassung: „Gasse“ heißt jetzt einheitlich „Gosse“ bzw. „Gossenjunge“.
- `inhalte/kegelabende.json`: echte Ergebnisse von drei Kegelabenden (27.02., 28.05. und 25.06.2026) mit 8 Spielern (Julian, Christopher, Christian L., Nico, Alex, Sven, Hendrik, Marcus). Erfasst sind Teilnahme, alle Neune, Siege, Gossen und Kranz. Quelle ist `inhalte/kegelabende-quelle.md`, abgeschrieben vom Foto einer Tabelle. Diese Daten werden beim Aufbau der Datenbank als Startbestand übernommen. Am 27.02. wurden keine Gossen erfasst, an keinem Abend Pudel. Diese Lücken bleiben unbekannt und werden nicht mit 0 gefüllt.
- `logo.png` (1254 × 1254 px, PNG mit Creme-Hintergrund, ohne Transparenz).
- Noch keine Fotos, keine vollständige Mitgliederliste (nur die Vornamen aus der Statistik) und keine Spielesammlung. Diese Inhalte nicht erfinden. Leere Zustände (Fotos, Spiele, Termine) müssen ohne Beispieldaten gut aussehen. Die Statistik muss mit Lücken umgehen können: „nicht erfasst“ ist etwas anderes als 0.

## Product Principles

1. **Der nächste Spieltag zuerst.** Die häufigste Frage wird beim Öffnen sofort beantwortet.
2. **Eintragen geht schnell, auch mit Bier in der Hand.** Die Erfassung am Kegelabend braucht wenige, große Bedienelemente und verzeiht Fehler, weil sie sich korrigieren lassen.
3. **Die Zahlen gehören dem Club.** Statistiken sind nachvollziehbar pro Spieltag und Jahr. Nichts wird geschätzt oder erfunden.
4. **Geschlossen und privat.** Nur Mitglieder sehen etwas. Es werden so wenige persönliche Daten wie möglich gespeichert.
5. **Vereinsgefühl statt Verwaltung.** Die App fühlt sich nach den Bahnbrechern an, nicht nach einem Formularsystem.
