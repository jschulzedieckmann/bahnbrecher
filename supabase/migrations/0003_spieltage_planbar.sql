-- Spieltage sind jetzt auch die geplanten Kegelabende: Uhrzeit, Ort und Notiz.
-- Ein Spieltag in der Zukunft ohne Ergebnisse ist der nächste geplante Kegelabend.
-- Termine (Tabelle termine) bleiben für alles andere, zum Beispiel Ausflüge.

alter table public.spieltage
  add column if not exists uhrzeit time,
  add column if not exists ort text,
  add column if not exists notiz text;
