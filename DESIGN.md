---
name: Die Bahnbrecher
description: Mitglieder-App des Kegelclubs aus Lüdinghausen, gestaltet als Brauerei-Plakat am Tresen.
colors:
  blau: "#0f8ac7"
  blau-tief: "#075a85"
  gelb: "#fed51c"
  gelb-tief: "#3d3200"
  rot: "#eb0620"
  rot-tief: "#b0001a"
  gruen: "#25904c"
  gruen-blass: "#d9f0df"
  creme: "#fef7de"
  creme-tief: "#f6ebc4"
  weiss: "#fffdf6"
  reinweiss: "#ffffff"
  ink: "#000c16"
  ink-weich: "#3a3f45"
typography:
  display:
    fontFamily: "Shrikhand, cursive"
    fontSize: "clamp(50px, 13.3vw, 80px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Shrikhand, cursive"
    fontSize: "clamp(30px, 6vw, 42px)"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Shrikhand, cursive"
    fontSize: "27px"
    fontWeight: 400
    lineHeight: 1.05
  plakat-pudel:
    fontFamily: "Shrikhand, cursive"
    fontSize: "clamp(64px, 18vw, 120px)"
    fontWeight: 400
    lineHeight: 1.02
  plakat-koenig:
    fontFamily: "Shrikhand, cursive"
    fontSize: "clamp(36px, 9vw, 52px)"
    fontWeight: 400
    lineHeight: 1.02
  plakat-anmeldung:
    fontFamily: "Shrikhand, cursive"
    fontSize: "46px"
    fontWeight: 400
    lineHeight: 1.02
  stoerer-zahl:
    fontFamily: "Shrikhand, cursive"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1
  wortmarke:
    fontFamily: "Shrikhand, cursive"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.02
  betrag:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(56px, 16vw, 88px)"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "tnum"
  titel-ui:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.15
    fontFeature: "tnum"
  karte:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
    fontFeature: "tnum"
  zeile:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  body-stark:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.3
    fontFeature: "tnum"
  meta:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 78"
  tabellenkopf:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 80"
  klein:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    letterSpacing: "0.05em"
  stoerer-klein:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 80"
rounded:
  zeichen-fuss: "2px"
  zeichen-kopf: "3px"
  marke: "6px"
  balken: "8px"
  klein: "9px"
  standard: "14px"
  gross: "18px"
  pille: "999px"
spacing:
  block: "14px"
  seite: "16px"
  inhalt: "18px"
  pc-inhalt: "32px"
components:
  knopf:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.creme}"
    rounded: "{rounded.pille}"
    padding: "10px 18px"
    height: "48px"
  knopf-hover:
    backgroundColor: "{colors.blau-tief}"
  knopf-hell:
    backgroundColor: "{colors.weiss}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pille}"
    padding: "10px 18px"
    height: "48px"
  knopf-hell-hover:
    backgroundColor: "{colors.gelb}"
  knopf-gefahr:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.reinweiss}"
    rounded: "{rounded.pille}"
    padding: "10px 18px"
    height: "48px"
  knopf-gefahr-hover:
    backgroundColor: "{colors.rot-tief}"
  knopf-klein:
    rounded: "{rounded.pille}"
    padding: "6px 14px"
    height: "40px"
  eingabe:
    backgroundColor: "{colors.weiss}"
    textColor: "{colors.ink}"
    rounded: "{rounded.klein}"
    padding: "10px 14px"
    height: "48px"
  blatt:
    backgroundColor: "{colors.weiss}"
    textColor: "{colors.ink}"
    rounded: "{rounded.standard}"
    padding: "14px 16px"
  banderole-kopf-rot:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.reinweiss}"
    typography: "{typography.label}"
    padding: "8px 16px"
  banderole-kopf-blau:
    backgroundColor: "{colors.blau}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 16px"
  plakat:
    backgroundColor: "{colors.gelb}"
    textColor: "{colors.ink}"
    rounded: "{rounded.gross}"
    padding: "18px 18px 20px"
  kopfleiste:
    backgroundColor: "{colors.blau}"
    textColor: "{colors.ink}"
    height: "72px"
  tab-aktiv:
    backgroundColor: "{colors.gelb}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pille}"
    size: "44px x 30px"
  rail-link-aktiv:
    backgroundColor: "{colors.gelb}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pille}"
    padding: "8px 14px"
    height: "44px"
  rail-link-hover:
    backgroundColor: "{colors.blau-tief}"
    textColor: "{colors.reinweiss}"
  stoerer:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.gelb}"
    typography: "{typography.stoerer-zahl}"
    size: "86px"
  ranglisten-balken:
    backgroundColor: "{colors.gelb}"
    rounded: "{rounded.balken}"
    height: "16px"
  grad-leicht:
    backgroundColor: "{colors.gruen-blass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pille}"
    padding: "3px 10px 3px 6px"
  grad-mittel:
    backgroundColor: "{colors.gelb}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pille}"
    padding: "3px 10px 3px 6px"
  grad-schwer:
    backgroundColor: "{colors.rot}"
    textColor: "{colors.reinweiss}"
    rounded: "{rounded.pille}"
    padding: "3px 10px 3px 6px"
---

# Design System: Die Bahnbrecher

## Overview

**Creative North Star: "Das Brauerei-Plakat am Tresen"**

Die App sieht aus wie das Vereinsplakat einer Kneipe der 50er und 60er Jahre, abgeleitet aus dem Logo des Clubs: Cremegrund, fast schwarze Konturen von 3px, Logo-Blau, Gelb und Rot als satte Druckfarben. Termine und Titel stehen da, als wären sie gedruckt: das Datum des nächsten Kegelabends und die Namen der Titelträger tragen die Logo-Schrift Shrikhand mit roter Versatzkontur, alles andere ist ruhige, gut lesbare Standard-UI in Archivo.

Das Plakat ist auf wenige Stellen konzentriert: Kopfleiste, PC-Leiste, Banderolen-Köpfe, der gelbe Plakatblock mit Störer und die Kontur um jede Fläche. Statistik, Tabellen, Formulare und die Spieltag-Erfassung bleiben ruhig und dicht. Die Dichte ist mittel; Handy und PC sind gleichwertig.

Abgelehnt ist das Standard-Dashboard mit grauen Kacheln und einer einzigen Akzentfarbe.

**Key Characteristics:**
- Creme-Grund, jede Fläche mit 3px Fast-Schwarz umrandet, runde Ecken von 14 bis 18px.
- Shrikhand mit Versatzkontur nur für Markenmomente; alles Übrige in Archivo.
- Banderolen: weiße Blätter mit rotem oder blauem Kopf in schmalen Versalien.
- Keine Box-Schatten, keine weichen Verläufe; Tiefe entsteht aus Kontur und Farbfläche.
- Zustände zeigen sich in der Form, nicht nur in der Farbe.

## Colors

Drei satte Druckfarben aus dem Logo auf warmem Creme, gehalten von einer fast schwarzen Kontur.

### Primary
- **Logo-Blau** (blau): Kopfleiste, die volle Höhe laufende PC-Leiste, blaue Banderolen-Köpfe (mit dunklem Text), der Zufallsspiel-Block, Fokusring und `theme-color` des Browsers.
- **Tiefes Blau** (blau-tief): Hover-Fläche des dunklen Knopfs und der PC-Leisten-Links.

### Secondary
- **Plakatgelb** (gelb): Hauptfläche für den nächsten Termin (Plakatblock), Kennzahlen-Block der Statistik, Beitrags-Plakat, aktive Navigation, Ranglisten-Balken, Hervorhebung des eigenen Namens, Füllung der Plakatschrift, Textauswahl.
- **Bierbraun auf Gelb** (gelb-tief): gedämpfter Fließtext auf gelben Flächen.

### Tertiary
- **Signalrot** (rot): rote Banderolen-Köpfe (mit weißem Text), Störer, Versatzkontur der Plakatschrift, hervorgehobener Ranglisten-Balken, Titel-Abzeichen in der Erfassung, Gefahr-Knopf.
- **Tiefes Rot** (rot-tief): Fehlertext und Hover des Gefahr-Knopfs.
- **Vereinsgrün** (gruen): nur Erfolgsmeldungen.
- **Blassgrün** (gruen-blass): einzig die Fläche der Schwierigkeits-Pille „leicht“ in den Kegelspielen, neben Gelb für „mittel“ und Rot für „schwer“.

### Neutral
- **Creme** (creme): Seitengrund, Tab-Leiste, Hover-Zeile in Tabellen, Minus-Knopf im Zähler.
- **Tiefes Creme** (creme-tief): feine 1px-Trennlinien in Listen und Tabellen.
- **Papierweiß** (weiss): Blätter, Eingabefelder, helle Knöpfe.
- **Reinweiß** (reinweiss): nur Text auf Rot und Tiefem Blau: rote Banderolen-Köpfe, Störer-Kleinzeilen, Gefahr-Knopf, Abzeichen und Spitzenwerte auf Rot, „schwer“-Pille, Hover der PC-Leisten-Links. Nie als Fläche.
- **Fast-Schwarz** (ink): Text, alle Konturen, dunkler Standardknopf, Tabellenkopf.
- **Weiches Grau** (ink-weich): Nebentext, Hinweise, Rangplätze, Zustände „nicht erfasst“ und „nicht dabei“.

### Named Rules
**The Zwei-Köpfe Rule.** Banderolen-Köpfe sind rot (weißer Text) oder blau (dunkler Text). Gelbe oder schwarze Köpfe gibt es nicht; Gelb gehört dem Plakatblock und dem aktiven Zustand.

**The Gelb-heißt-hier Rule.** Gelb markiert, was jetzt zählt: der nächste Termin, die aktive Seite, der eigene Name, der gewählte Spieler. Es wird nicht als Dekorfläche verteilt.

## Typography

**Display Font:** Shrikhand (über next/font, Fallback cursive)
**Body Font:** Archivo mit Breitenachse (über next/font, Fallback system-ui, sans-serif)

**Character:** Eine fette, schräge Plakatschrift wie der Logo-Schriftzug trifft eine sachliche Grotesk, die mit schmaler Breite die Versal-Köpfe trägt und mit gleich breiten Ziffern die Zahlen.

### Hierarchy
- **Display** (Shrikhand 400, clamp(50px, 13.3vw, 80px), 1.02): das Datum im Plakatblock; ebenso „Pudel!“ auf der 404-Seite (clamp bis 120px). Gelbe Füllung, Fast-Schwarz-Umriss, roter Versatz.
- **Headline** (Shrikhand 400, clamp(30px, 6vw, 42px), 1.05): Seitentitel in Fast-Schwarz ohne Versatz; „Gut Holz!“ auf der Anmeldung (46px) mit voller Plakatschrift.
- **Title** (Shrikhand 400, 27px, 1.05): Namen der Titelträger. Gossenjunge: Fast-Schwarz mit rotem Versatz. Kegelkönig: gelbe Füllung, Umriss, roter Versatz (36 bis 52px in der Statistik).
- **Body** (Archivo 400, 16px, 1.45, tabular-nums): alles Lesbare; Einleitungen höchstens 62ch, Text auf Plakaten 44ch. Hervorgehobene Zeilen (Ort, Namen in Ranglisten, Erfassung) in 700 bis 800, 17 bis 19px.
- **Label** (Archivo 800, 15px, Breite 78 %, Versalien, 0.06em): Banderolen-Köpfe und Abschnittsüberschriften im Plakat. Tabellenköpfe und Zählernamen 13px, Breite 80 %, 0.05em.

### Größenleiter
Die Schriftgrößen stehen auf einer festen Leiter; neue Größen kommen nicht dazu.
- **Archivo:** 11px (Kleinzeilen im Störer, Versalien, Untergrenze), 12px (Tab-Beschriftung, kleine Abzeichen, Tabellenköpfe am Handy), 13px (Tabellenköpfe, Zählernamen, Datenbezeichner), 14px (Hinweise, Metazeilen, Bildunterschriften, kleine Knöpfe), 15px (Banderolen-Köpfe, Tabellen), 16px (Text), 17px (Ort, Ranglisten-Werte, Termin-Daten), 19px (hervorgehobene Zeilen, Kartentitel, Listeneinträge), 22px (Kartentitel der Termine, Zählerwert), 24px (Spielname im Zufallsblock, Spieltage-Datum, Monogramm, 800 bis 900), clamp(56px, 16vw, 88px) (Beitragssumme, 900).
- **Shrikhand:** Wortmarke 20px am Handy unter 430px, 24px dazwischen, 28px am PC; 27px Gossenjunge; 32px Störer-Zahl; clamp(30px, 6vw, 42px) Seitentitel; clamp(36px, 9vw, 52px) Kegelkönig in der Statistik; 46px „Gut Holz!“; clamp(50px, 13.3vw, 80px) Plakatdatum; clamp(64px, 18vw, 120px) „Pudel!“.

### Named Rules
**The Markenmoment Rule.** Shrikhand steht nur an Markenmomenten: Wortmarke, Plakatdatum, Störer-Zahl, Titelträger, Seitentitel, „Pudel!“ und „Gut Holz!“. Kartentitel, Zahlen, Tabellen und Formulare sind Archivo.

**The Gleiche-Ziffern Rule.** Zahlen stehen in gleich breiten Ziffern (tabular-nums ist am body gesetzt) und in Tabellen und Ranglisten rechtsbündig.

## Layout

Eine Spalte am Handy, eine feste Leiste plus Inhalt am PC; Umbruch bei 900px.

- **Handy:** blaue Kopfleiste (72px, sticky) mit Logo-Rund, Wortmarke und Gruß. Inhalt mit 16px Seitenrand, 18px Abstand zwischen Blöcken auf Seitenebene, 14px innerhalb des Startrasters. Unten eine feste Tab-Leiste mit fünf Einträgen auf Creme, oben 3px Kontur, Safe-Area beachtet. Unter 430px schrumpfen Logo (42px) und Wortmarke (20px).
- **PC (ab 900px):** links eine blaue Leiste von 232px, die über die volle Seitenhöhe läuft und mit 3px Kontur abschließt; die Links sitzen sticky darin. Inhalt höchstens 1080px breit, 28px oben, 32px seitlich. Die Startseite steht zweispaltig (1.15fr / 1fr) als zwei unabhängige Stapel.
- **Raster:** Listen von Karten nutzen `auto-fill` mit Mindestbreiten (Spiele 280px, Personen 150px, Zähler 140px). Formulare höchstens 560px breit, 18px Abstand.
- **Tabellen** scrollen seitlich; die erste Spalte bleibt stehen, unter 700px erscheint ein Wisch-Hinweis.

## Elevation & Depth

Das System ist flach. Es gibt keine Box-Schatten für Erhebung und keine weichen Verläufe; Ebenen trennen sich durch die 3px-Kontur und durch Farbflächen. Der einzige Versatz ist typografisch und kommt aus dem Logo: Shrikhand trägt einen harten roten Versatz von 0.06em (Plakatschrift) oder einen 2px-Fast-Schwarz-Versatz (Störer-Zahl, Monogramme). Die harte Farbkante der PC-Leiste und der Anmeldebühne ist technisch ein Verlauf, sichtbar aber eine Fläche.

### Named Rules
**The Kontur-statt-Schatten Rule.** Tiefe kommt von der 3px-Kontur in Fast-Schwarz. Versatz gehört der Plakatschrift, nicht Flächen oder Knöpfen.

## Shapes

Runde, gedruckte Formen mit dicker Kontur. Große Flächen (Plakatblock, Kennzahlen, Anmeldekarte) 18px, Blätter und Banderolen 14px, Eingaben und Datumskästchen 9px, kleine Marken (Haken, Spitzenwert, „?“-Kästchen) 6px, Ranglisten- und Spieltage-Balken sowie die hervorgehobene Ranglisten-Zeile 8px. Das kleine gezeichnete Kegel-Zeichen in der Schwierigkeits-Pille ist oben 3px und unten 2px gerundet. Knöpfe, Navigation, Schritte, Zähler und die schwebende Aktionsleiste sind Pillen. Logo, Monogramme und Störer sind Kreise. Konturen: 3px für Flächen, 2px für Felder, Knöpfe im Inneren und Balken, 1px Creme-Tief nur als Trennlinie.

## Components

### Buttons
- **Shape:** Pille (999px), 3px Kontur, mindestens 48px hoch, Archivo 800 16px.
- **Standard:** Fast-Schwarz mit Creme-Text; Hover Tiefes Blau.
- **Hell:** Papierweiß mit dunklem Text; Hover Gelb. Zweitaktion und Abbrechen.
- **Gefahr:** Rot mit weißem Text; Hover Tiefes Rot. Löschen fragt an Ort und Stelle in einem rot umrandeten Blatt nach, ohne Dialogfenster.
- **Klein:** 40px hoch, 14px Schrift.
- **Druck / Fokus:** `scale(0.97)` beim Drücken (120ms, ease-out-expo); 3px blauer Fokusring mit 2px Abstand. Deaktiviert 45 % Deckkraft.

### Cards / Containers
- **Blatt:** Papierweiß, 3px Kontur, 14px Ecken, Innenabstand 14px 16px.
- **Banderole:** ein Blatt mit Kopfzeile in schmalen Versalien, rot oder blau, 3px Kontur darunter; rechts optional ein Archivo-Link ohne Versalien.
- **Leerzustand:** ruhiger Satz in Weichem Grau, 18px 16px Abstand.
- **Karten-Hover** (Spieleliste): Creme-Fläche und 2px Anheben.

### Inputs / Fields
- **Style:** Papierweiß, 2px Fast-Schwarz-Kontur, 9px Ecken, 48px hoch, Archivo 500 16px, roter Cursor. Label 700 darüber, Hinweis 14px Weiches Grau.
- **Fokus:** blauer 3px-Ring ohne Abstand.
- **Fehler / Erfolg:** Tiefes Rot bzw. Vereinsgrün, 700.

### Navigation
- **Handy:** Tab-Leiste mit fünf Einträgen (Start, Termine, Spieltage, Statistik, Mehr), Linien-Icon 22px über 12px-Label. Aktiv: gelbe Pille (44 × 30px) mit 2px Kontur um das Icon.
- **PC:** blaue Leiste über die volle Höhe, Links als Pillen mit Icon 20px und 700-Label. Hover Tiefes Blau mit weißem Text, aktiv gelbe Pille mit Kontur.

### Plakatblock
Gelbe Fläche, 3px Kontur, 18px Ecken, Innenabstand 18px (PC 26px 28px). Überschrift in Versal-Label, darunter das Datum in voller Plakatschrift, Ort in 800 17px, Text in Bierbraun. Am Kegelabend steht hier der Erfassen-Knopf.

### Störer
Roter Kreis (86px), 3px Kontur, um 9° gedreht, ragt über die rechte obere Ecke des Plakatblocks. Kleine Versalzeile in Archivo, Zahl in Shrikhand 32px Gelb mit 2px Fast-Schwarz-Versatz. Erscheint mit einer Stempel-Animation (600ms).

### Rangliste
Platz, Name, Balken, Wert in festen Spalten. Der Balken ist exakt `Wert / Höchstwert` lang (Gelb, 2px Kontur, 8px Ecken, mindestens 6px), wächst beim Laden von links (520ms). Der Wert steht rechtsbündig in gleich breiten Ziffern. Der gewählte Spieler bekommt gelben Grund, Kontur-Rahmen und einen roten Balken; die anderen bleiben sichtbar.

### Zustandszeichen
- **Nicht erfasst:** gestricheltes Kästchen mit „?“ (2px gestrichelt, Weiches Grau, 6px Ecken).
- **Nicht dabei:** durchgestrichener Name (2px Linie, Weiches Grau).
- **Spitzenwert in Tabellen:** rotes Kästchen mit weißer Zahl und Kontur.

### Erfassung
Ruhiger Ablauf: Schritte als Pillen (aktiv Fast-Schwarz), Personen als 52px hohe Umschaltflächen (gewählt Gelb, mit Haken-Kästchen), Zähler als Pille mit Minus auf Creme und Plus auf Gelb, Wert 22px 800 in der Mitte. Die Aktionen schweben als creme Pille mit Kontur über der Tab-Leiste.

## Do's and Don'ts

### Do:
- **Do** jede Fläche mit 3px Fast-Schwarz umranden und 14 bis 18px runden.
- **Do** Banderolen-Köpfe rot mit weißem Text oder blau mit dunklem Text setzen.
- **Do** Shrikhand nur für Wortmarke, Plakatdatum, Störer-Zahl, Titelträger, Seitentitel, „Pudel!“ und „Gut Holz!“ verwenden.
- **Do** Zustände über die Form zeigen: gestricheltes „?“-Kästchen für nicht erfasst, Durchstreichung für nicht dabei.
- **Do** Ranglisten-Balken exakt proportional zum Wert zeichnen und Zahlen rechtsbündig in gleich breiten Ziffern setzen.
- **Do** am PC die blaue Leiste über die volle Höhe laufen lassen, am Handy die Tab-Leiste mit gelber Aktiv-Pille zeigen.

### Don't:
- **Don't** gelbe oder schwarze Banderolen-Köpfe bauen.
- **Don't** Kartentitel, Zahlen, Tabellen oder Formulare in Shrikhand setzen.
- **Don't** Plakateffekte (Versatzschrift, Störer, Drehung) in Statistik, Tabellen, Formulare oder die Erfassung tragen; dort zeigt sich das Plakat nur in Kopfleiste, Banderolen-Köpfen und Kontur.
- **Don't** Kicker- oder Eyebrow-Zeilen über Überschriften setzen.
- **Don't** Box-Schatten oder weiche Verläufe für Tiefe einsetzen.
- **Don't** einen Zustand allein über Farbe ausdrücken.
