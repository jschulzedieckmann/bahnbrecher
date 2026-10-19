# Texte der Bahnbrecher-App

Quelle für alle Texte der App. Änderungen werden hier und in der App gleichzeitig gemacht.

Stand: 2026-10-18, Entwurf 2, abgenommen. Ansprache: „du“. Begriffe einheitlich: Kegelabend (der Termin), Spieltag (die Ergebnisse eines Kegelabends), Gosse, Gossenjunge, alle Neune, Kranz, Pudel, Sieg, Kegelkönig oder Kegelkönigin.

Angepasst an die Mitglieder-App: Es gibt keine Suchmaschinen-Texte, keine Meta-Beschreibung für Google und keine Faktensätze für KI-Suchen. Die App ist gesperrt (noindex).

---

## 1. Meta

- **Seitentitel im Browser-Tab:** „Die Bahnbrecher“, auf Unterseiten „Termine · Die Bahnbrecher“, „Statistik · Die Bahnbrecher“ usw.
- **Vorschau beim Teilen eines Links** (z. B. in WhatsApp): Titel „Die Bahnbrecher“, Text „Kegelclub aus Lüdinghausen. Nur für Mitglieder.“, Bild: das Logo.
- **Robots:** noindex, nofollow.

## 2. Navigation

Hauptmenü, in dieser Reihenfolge:

1. Start
2. Termine
3. Spieltage
4. Statistik
5. Kegelspiele
6. Mitglieder
7. Satzung
8. Beitrag

Am Handy: Start, Termine, Spieltage und Statistik in der unteren Leiste, der Rest unter „Mehr“.

Rechts oben bzw. unter „Mehr“: „Mein Konto“, „Abmelden“. Nur für Admins zusätzlich: „Verwaltung“.

---

## 3. Anmelden

**Überschrift:** Gut Holz!

**Text:** Hier geht's nur für Bahnbrecher weiter. Melde dich mit deinen Zugangsdaten an.

**Felder**
- Benutzername (Hinweis: dein Vorname, so wie der Admin ihn angelegt hat)
- Passwort

**Button:** Anmelden

**Link unter dem Button:** Passwort vergessen?

**Fehler**
- Benutzername oder Passwort stimmt nicht. Versuch es noch mal.
- Bitte gib deinen Benutzernamen ein.
- Bitte gib dein Passwort ein.
- Zu viele Versuche. Warte ein paar Minuten und probier es dann noch mal.
- Keine Verbindung. Prüf dein Internet und versuch es noch mal.

**Fußzeile:** Noch kein Zugang? Sprich den Admin beim nächsten Kegelabend an.

### Passwort vergessen

Kein Zurücksetzen per E-Mail. Der Link unter dem Anmelde-Button öffnet nur diesen Hinweis.

**Überschrift:** Passwort vergessen?

**Text:** Kein Problem. Frag den Admin beim Kegelabend oder per WhatsApp. Er setzt dein Passwort auf das Startpasswort zurück. Beim nächsten Anmelden vergibst du dann ein neues.

**Link:** Zurück zur Anmeldung

### Erstes Anmelden: Passwort ändern

**Überschrift:** Willkommen bei den Bahnbrechern

**Text:** Du bist zum ersten Mal hier. Bevor es losgeht, ersetzt du das Startpasswort durch dein eigenes.

**Felder**
- Neues Passwort (Hinweis: mindestens 8 Zeichen)
- Neues Passwort wiederholen

**Button:** Passwort speichern

**Fehler**
- Das Passwort ist zu kurz. Nimm mindestens 8 Zeichen.
- Die beiden Passwörter sind nicht gleich.
- Das ist noch das Startpasswort. Nimm bitte ein eigenes.

**Bestätigung:** Passt. Ab jetzt meldest du dich mit deinem neuen Passwort an.

---

## 4. Start

**Begrüßung:** Moin, {Vorname}!

### Block „Nächster Kegelabend“

**Kleine Überschrift:** Nächster Kegelabend

**Inhalt:** {Wochentag}, {Datum}
{Uhrzeit} Uhr · {Ort}
noch {n} Tage (bzw. „heute“ / „morgen“)

**Button:** Zu den Terminen

**Wenn kein Termin feststeht:**
Überschrift: Noch kein Termin
Text: Der nächste Kegelabend steht noch nicht fest. Laut Satzung legen wir ihn gemeinsam fest.

**Am Kegelabend selbst** (nur für Schriftführer und Admins):
Button: Spieltag erfassen

### Block „Gossenjunge“

**Kleine Überschrift:** Amtierender Gossenjunge

**Inhalt:** {Name}
{n} Gossen am {Datum}. Der Titel gilt bis zum nächsten Kegelabend.

**Bei Gleichstand:** {Name} und {Name} teilen sich den Titel. Je {n} Gossen am {Datum}.

**Wenn noch keine Gossen erfasst sind:** Noch kein Gossenjunge. Der Titel wird nach dem ersten Spieltag mit Gossen vergeben.

### Block „Kegelkönig {Jahr}“

**Kleine Überschrift:** Rennen um den Kegelkönig {Jahr}

**Inhalt:** Rangliste der ersten drei nach Siegen, z. B.
1. {Name} · {n} Siege
2. {Name} · {n} Siege
3. {Name} · {n} Siege

**Link:** Ganze Statistik ansehen

**Wenn noch keine Siege erfasst sind:** Noch keine Siege in {Jahr}. Der Erste kann noch jeder werden.

### Block „Weitere Termine“

**Kleine Überschrift:** Danach

Die nächsten zwei Termine nach dem Kegelabend, z. B. Ausflüge.

**Wenn keine weiteren Termine:** Sonst steht gerade nichts an.

### Block „Letzter Spieltag“

**Kleine Überschrift:** Letzter Spieltag

**Inhalt:** {Datum} · {n} dabei
Meiste Siege: {Name} ({n}) · Meiste Gossen: {Name} ({n})

**Link:** Zum Spieltag

---

## 5. Termine

**Überschrift:** Termine

**Text:** Kegelabende, Ausflüge und alles, was sonst ansteht.

**Reiter:** Kommende · Vergangene

**Terminkarte:** {Art} · {Wochentag}, {Datum}, {Uhrzeit} Uhr
{Titel, falls vorhanden}
{Ort}
{Notiz, falls vorhanden}

**Arten:** Kegelabend · Ausflug · Sonstiges

**Leer (kommende):** Gerade steht nichts im Kalender. Sobald der Admin einen Termin anlegt, taucht er hier auf.

**Leer (vergangene):** Noch keine vergangenen Termine.

### Termin anlegen (nur Admin)

**Button auf der Terminseite:** Termin anlegen

**Überschrift:** Neuer Termin

**Felder**
- Art (Kegelabend, Ausflug, Sonstiges)
- Titel (Hinweis: optional, z. B. „Kohlfahrt“. Bei Kegelabenden nicht nötig.)
- Datum
- Uhrzeit
- Ort (Vorschlag bei Kegelabenden: Gaststätte Schwenken)
- Notiz (Hinweis: optional, z. B. Treffpunkt oder was mitzubringen ist)

**Buttons:** Termin speichern · Abbrechen

**Bearbeiten:** Termin ändern · Termin löschen

**Löschen bestätigen:** Termin am {Datum} wirklich löschen? Das lässt sich nicht rückgängig machen.
Buttons: Löschen · Behalten

**Fehler**
- Bitte wähl ein Datum.
- Das Datum liegt in der Vergangenheit. Trotzdem speichern?

**Bestätigung:** Termin gespeichert.

---

## 6. Spieltage

**Überschrift:** Spieltage

**Text:** Alle Kegelabende mit Ergebnissen, der neueste oben.

**Filter:** Jahr

**Listenzeile:** {Datum} · {n} dabei · Gossenjunge: {Name}

**Wenn an einem Spieltag keine Gossen erfasst wurden:** Gossen nicht erfasst

**Leer:** Noch keine Spieltage. Der erste wird am nächsten Kegelabend erfasst.

### Spieltag im Detail

**Überschrift:** Spieltag vom {Datum}

**Zeile darunter:** {n} Bahnbrecher dabei · Gossenjunge: {Name}

**Tabelle:** Name · Siege · alle Neune · Kranz · Gossen · Pudel

**Nicht dabei:** {Namen}

**Wert nicht erfasst:** „nicht erfasst“ (kurz in der Tabelle: „?“, mit Erklärung unter der Tabelle: „? heißt: an diesem Abend nicht gezählt.“)

**Für Schriftführer und Admins:** Spieltag bearbeiten

### Spieltag erfassen (Schriftführer und Admins)

**Überschrift:** Spieltag erfassen

**Hinweis oben, einmal pro Abend:** Handy raus ist heute erlaubt. Du bist Schriftführer. § 3 gilt für dich nicht.

**Schritt 1, Überschrift:** Wer ist dabei?
Text: Tipp alle an, die heute kegeln.
Button: Weiter

**Schritt 2, Überschrift:** Ergebnisse
Pro Person eine Zeile mit Plus- und Minus-Knöpfen für: Siege, alle Neune, Kranz, Gossen, Pudel.
Hinweis: Du kannst jederzeit speichern und später weitermachen.

**Buttons:** Zwischenspeichern · Spieltag abschließen

**Abschließen bestätigen:** Spieltag abschließen? Danach steht der Gossenjunge fest. Ändern kannst du die Zahlen trotzdem noch.
Buttons: Abschließen · Weiter erfassen

**Bestätigung:** Spieltag gespeichert. Gossenjunge ist {Name}.

**Fehler**
- Wähl mindestens eine Person aus.
- Speichern hat nicht geklappt. Deine Eingaben sind noch da. Versuch es noch mal.
- Keine Verbindung. Wir speichern, sobald du wieder online bist.

---

## 7. Statistik

**Überschrift:** Statistik

**Filter:** Jahr (Standard: das aktuelle Jahr) · Spieltag (alle oder einer)

### Kennzahlen oben

- **Kegelkönig {Jahr}:** {Name}, {n} Siege
  Bei Gleichstand: {Name} und {Name}, je {n} Siege
- **Meiste alle Neune:** {Name}, {n}
- **Meiste Gossen:** {Name}, {n}
- **Spieltage:** {n}

**Hinweis bei laufendem Jahr:** Stand nach {n} Spieltagen. Entschieden wird am Jahresende.

### Ranglisten

Je eine Rangliste für: Siege, alle Neune, Kranz, Gossen, Pudel.

**Überschriften:** Siege · alle Neune · Kranz · Gossen · Pudel

**Unter der Gossen-Rangliste:** Am {Datum} wurden keine Gossen gezählt.

**Unter der Pudel-Rangliste, solange keine erfasst sind:** Pudel werden noch nicht gezählt.

### Tabelle

**Überschrift:** Alle Zahlen

**Spalten:** Name · dabei · Siege · alle Neune · Kranz · Gossen · Pudel · Gossenjunge (wie oft)

**Leer:** Für {Jahr} gibt es noch keine Ergebnisse.

**Satz am Seitenende:** Die Leistung ist nebensächlich. Steht so in § 1.

---

## 8. Kegelspiele

**Überschrift:** Kegelspiele

**Text:** Spiele für den Kegelabend. Die Regeln sind Grundformen. Was bei uns anders läuft, steht unter „Bei uns“.

**Filter:** Schwierigkeit (leicht, mittel, schwer) · Form (jeder für sich, jeder gegen jeden, Mannschaften, einer gegen alle)

**Button:** Zufallsspiel

**Ergebnis Zufallsspiel:** Heute spielen wir: {Spiel}. Button: Noch mal würfeln

**Karte:** {Name} · {Schwierigkeit} · {Form}
{Kurzregel}

**Erklärung der Schwierigkeit**
- leicht: in einem Satz erklärt, Glück spielt mit
- mittel: braucht die Tafel oder etwas Taktik
- schwer: gezielte Würfe oder viele Sonderregeln

### Spiel im Detail

**Abschnitte:** So geht's · Bei uns · Schwierigkeit

**Leer bei „Bei uns“:** Noch keine Hausregeln eingetragen.

### Spiel anlegen oder ändern (nur Admin)

**Felder:** Name · Schwierigkeit · Form · So geht's · Bei uns (optional)

**Buttons:** Spiel speichern · Abbrechen · Spiel löschen

**Bestätigung:** Spiel gespeichert.

**Leer (ganze Seite):** Noch keine Kegelspiele eingetragen.

Die Startsammlung (18 Spiele) steht in `recherche/kegelspiele.md` und wird beim Aufbau übernommen.

---

## 9. Mitglieder

**Überschrift:** Mitglieder

**Text:** Wer bei den Bahnbrechern dabei ist.

**Karte:** {Vorname} {Nachname-Kürzel, z. B. „L.“} · {Rolle, falls Admin oder Schriftführer} · dabei seit {Monat Jahr}
{Siege} Siege · {alle Neune} alle Neune in {Jahr}

**Abzeichen:** Gossenjunge (solange der Titel gilt) · Kegelkönig {Jahr} (nach Jahresende)

**Leer:** Noch keine Mitglieder angelegt.

---

## 10. Satzung

**Überschrift:** Satzung der „Bahnbrecher“

Text wörtlich aus `inhalte/satzung.md`.

**Unter der Satzung:** Änderungen beschließen wir mit einfacher Mehrheit. Wer eine neue Regel vorschlägt, spendiert eine Runde (§ 7).

---

## 10a. Beitrag

**Überschrift:** Monatsbeitrag

**Text:** 8 € im Monat, auch wenn du mal fehlst (§ 4). Das Geld kommt in die gemeinsame Kasse.

**Überweisung**
- Empfänger: {Empfänger}
- IBAN: {IBAN}, mit Button „IBAN kopieren“
- Verwendungszweck: {Verwendungszweck}

**Nach dem Kopieren:** IBAN kopiert.

**Wenn der Admin noch keine Bankdaten eingetragen hat:** Die Bankverbindung fehlt noch. Frag den Admin.

Die Werte in geschweiften Klammern pflegt der Admin unter Verwaltung → Beitrag. Sie stehen bewusst nicht in dieser Datei und nicht im Code.

---

## 11. Mein Konto

**Überschrift:** Mein Konto

**Angaben:** Name · Benutzername · Rolle

**Abschnitt:** Passwort ändern
Felder: Aktuelles Passwort · Neues Passwort · Neues Passwort wiederholen
Button: Passwort ändern
Bestätigung: Dein Passwort ist geändert.

**Button:** Abmelden

**Nach dem Abmelden:** Du bist abgemeldet. Gut Holz bis zum nächsten Mal!

---

## 12. Verwaltung (nur Admin)

**Überschrift:** Verwaltung

### Mitglied anlegen

**Felder**
- Vorname
- Nachname (wird nur als Kürzel angezeigt, z. B. „L.“)
- Benutzername (Vorschlag: Vorname klein geschrieben, bei Doppelungen mit Kürzel, z. B. „christianl“)
- Dabei seit
- Rolle (Mitglied, Schriftführer, Admin)

**Hinweis:** Das neue Mitglied meldet sich mit dem Startpasswort an und muss es beim ersten Mal ändern. Gib ihm oder ihr Bescheid.

**Buttons:** Mitglied anlegen · Abbrechen

**Bestätigung:** {Vorname} ist angelegt und kann sich jetzt anmelden.

**Fehler**
- Dieser Benutzername ist schon vergeben.
- Bitte gib einen Vornamen ein.

### Mitglied bearbeiten

**Buttons:** Änderungen speichern · Rolle ändern · Passwort zurücksetzen · Mitglied austragen

**Passwort zurücksetzen bestätigen:** Passwort von {Vorname} auf das Startpasswort zurücksetzen? Beim nächsten Anmelden muss {Vorname} ein neues vergeben.
Buttons: Zurücksetzen · Abbrechen

**Bestätigung:** Passwort zurückgesetzt. Gib {Vorname} Bescheid, dass das Startpasswort wieder gilt.

**Austragen bestätigen:** {Vorname} austragen? Der Zugang wird gesperrt. Die Ergebnisse bleiben in der Statistik.
Buttons: Austragen · Behalten

**Ausgetragene Mitglieder** erscheinen in der Statistik weiter mit Namen, in der Mitgliederliste nicht mehr.

---

### Beitrag

**Felder:** Empfänger · IBAN · Verwendungszweck (Vorschlag: „Monatsbeitrag“) · Monatsbeitrag in € (Vorschlag: 8, laut § 4)

**Button:** Speichern

**Fehler:** Diese IBAN sieht nicht richtig aus. Prüf sie bitte noch mal.

**Bestätigung:** Bankverbindung gespeichert.

---

## 13. Systemtexte

- **Seite nicht gefunden:** Pudel! Diese Seite gibt es nicht. Button: Zur Startseite
- **Kein Zugriff:** Das darf nur der Admin. Button: Zurück
- **Allgemeiner Fehler:** Da ist was schiefgelaufen. Lade die Seite neu. Wenn es dann immer noch nicht geht, sag dem Admin Bescheid.
- **Offline:** Du bist offline. Was du siehst, ist der letzte Stand.
- **Laden:** Kugel rollt …
- **Gespeichert (kurze Einblendung):** Gespeichert.
- **Abgemeldet wegen Zeitablauf:** Du warst eine Weile weg. Melde dich bitte neu an.

---

## 14. Fotogalerie (später, nicht im ersten Umfang)

Vorgemerkt für eine spätere Ausbaustufe, zusammen mit der Kasse.

**Überschrift:** Fotos

**Text:** Bilder von Kegelabenden und Ausflügen. Nur für Mitglieder sichtbar.

**Button:** Fotos hochladen

**Hinweis beim Hochladen:** Lade nur Fotos hoch, mit denen alle Abgebildeten einverstanden sind.

**Leer:** Noch keine Fotos. Das erste Bild vom Kegelabend fehlt noch.

---

## 15. Entscheidungen und offene Fragen

Entschieden am 2026-10-18 (Empfehlungen übernommen):
- Anmelden mit Benutzername statt E-Mail-Adresse. Es werden keine E-Mail-Adressen gespeichert.
- Passwort vergessen: Mitglieder fragen den Admin persönlich oder per WhatsApp.
- Namen: Vorname plus Kürzel des Nachnamens, z. B. „Christian L.“
- Gleichstand beim Gossenjungen und beim Kegelkönig: Der Titel wird geteilt.
- Begrüßung: „Moin, {Vorname}!“
- Keine Zu- und Absagen für Termine im ersten Umfang.
- Fotogalerie und Kasse kommen später.

Noch offen (bleiben leer, bis die Person sie nennt):
1. Feste Uhrzeit des Kegelabends als Vorschlag beim Anlegen.
2. Adresse der Gaststätte Schwenken, eventuell mit Link zur Karte.
