---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: []
---

# Bahnbrecher-App (Mitgliederbereich)

## Scope

Ganze Web-App (Next.js, `src/app`), Modus: Operate. Mitglieder schauen nach Terminen, Titeln und Statistik. Schriftführer und Admin erfassen Spieltage am Handy an der Bahn. Gleichermaßen Handy und PC. Texte: `texte.md`. Inhalte: PRODUCT.md. Referenzen: `referenzen/notizen.md` (OLIPOP für die Grundwelt, Seline für den Aufbau der Statistik).

## Direction contract

THESIS: Die App ist das Vereinsplakat am Tresen. Termine und Titel stehen da, als wären sie gedruckt. Abgelehnt wird das Standard-Dashboard mit grauen Kacheln und einer Akzentfarbe.

OWN-WORLD: Brauerei- und Kneipenplakat der 50er und 60er, abgeleitet aus dem Logo. Grund Creme #FEF7DE. Konturen 3px Fast-Schwarz #000C16. Kopfleiste Logo-Blau #0F8AC7. Hauptfläche für den Termin Gelb #FED51C. Banderolen-Köpfe Rot #EB0620 bzw. Blau mit dunklem Text. Display: fette Schräg-Schrift (Shrikhand) mit roter Versatzkontur wie der Logo-Schriftzug, nur für Datum, Titelträger und Markenmomente. UI und Zahlen: Archivo, schmale Breite für Versal-Köpfe, gleich breite Ziffern. Runde Ecken 14 bis 18px, keine Schatten, keine Verläufe.

STORY: Wer die App öffnet, sieht sofort, wann der nächste Kegelabend ist. Danach sieht man, wer gerade Gossenjunge ist und wer im Rennen um den Kegelkönig führt. Mitglieder schauen nach und schließen die App. Der Schriftführer tippt am Abend Anwesenheit und Zähler, und die Titel folgen daraus.

FIRST VIEWPORT: Startseite am Handy, 390 breit. Oben die blaue Kopfleiste mit Logo, „Die Bahnbrecher“ in Shrikhand und „Moin, {Vorname}!“. Darunter ein gelber Plakatblock „Nächster Kegelabend“ mit dem Datum in 52px Shrikhand mit roter Versatzkontur, dem Ort und einem roten, schräg gestellten Rund-Störer „noch n Tage“. Darunter die Banderole „Amtierende Gossenjungen“ mit rotem Kopf und darunter die Banderole „Rennen um den Kegelkönig {Jahr}“ mit blauem Kopf und drei Ranglisten-Zeilen mit Balken. Unten die Tab-Leiste mit Start, Termine, Spieltage, Statistik und Mehr. Am Kegelabend erscheint für den Schriftführer im Plakatblock der Button „Spieltag erfassen“. Am PC steht die Navigation links als blaue Leiste. Plakatblock und Banderolen stehen zweispaltig.

FORM: Brauerei-Plakat, Platz 4 meiner geordneten Liste (1 Bierdeckel, 2 Panini-Sammelalbum, 3 Sportteil-Tabelle, 4 Brauerei-Plakat, 5 Kreidetafel, 6 Emaille-Gaststättenschild, 7 Vereinswimpel). seed:b91a9e531aede085.
Signature-Move: Titel und Termine als gedruckte Plakatelemente. Das Datum und der Name des Titelträgers stehen in der Logo-Schrift mit roter Versatzkontur, alles andere bleibt ruhige Standard-UI.
Übernommen von den abgelehnten Richtungen:
- Spektrallinien: Zustände zeigen sich in der Form, nicht nur in der Farbe. „Nicht erfasst“ ist ein gestrichelter Rahmen mit „?“, „nicht dabei“ ein durchgestrichener Name.
- Botanische Mappe: Spieltage stehen als Karten in exakt gleichem Maßstab auf derselben Grundlinie, damit sie sich vergleichen lassen.
- Liniennetzplan: Ein gewählter Spieler wird überall hervorgehoben, die anderen bleiben sichtbar.
- Tanznotation: Ranglisten-Balken sind exakt so lang wie der Wert.
- Mixtape-Hülle: Zahlen stehen rechtsbündig in gleich breiten Ziffern.
Grenze: Statistik, Tabellen und Formulare bleiben ruhig. Dort zeigt sich das Plakat nur in der Kopfleiste, den Banderolen-Köpfen und der Kontur.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Offen

- Uhrzeit und Adresse des Kegelabends (siehe texte.md).
- Favicon: eigenes, vereinfachtes Zeichen (Kegel oder „B“ auf Gelb), wird in Phase 5 gebaut.
