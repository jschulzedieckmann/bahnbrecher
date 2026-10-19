"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Spieltag } from "@/lib/daten";
import { spieltagPlanen } from "./aktionen";

export function PlanFormular({ spieltag, vorschlag, heute }: { spieltag?: Spieltag; vorschlag?: string; heute: string }) {
  const [status, aktion, laeuft] = useActionState(spieltagPlanen, undefined);
  const [datum, setDatum] = useState(spieltag?.datum ?? vorschlag ?? "");

  return (
    <form action={aktion} className="formular blatt" style={{ padding: 18 }}>
      {spieltag && <input type="hidden" name="id" value={spieltag.id} />}
      <div className="feld">
        <label htmlFor="datum">Datum</label>
        <input id="datum" name="datum" type="date" className="eingabe" value={datum} onChange={(e) => setDatum(e.target.value)} required aria-describedby="datum-hinweis" />
        <span id="datum-hinweis" className="hinweis">
          {!spieltag && vorschlag ? "Vorschlag: 4 Wochen nach dem letzten Spieltag, wie in § 3. " : ""}
          {datum && datum < heute ? "Das Datum liegt in der Vergangenheit. Speichern geht trotzdem." : ""}
        </span>
      </div>
      <div className="feld">
        <label htmlFor="uhrzeit">Uhrzeit</label>
        <input id="uhrzeit" name="uhrzeit" type="time" className="eingabe" defaultValue={spieltag?.uhrzeit?.slice(0, 5) ?? ""} />
      </div>
      <div className="feld">
        <label htmlFor="ort">Ort</label>
        <input id="ort" name="ort" className="eingabe" defaultValue={spieltag?.ort ?? "Gaststätte Schwenken"} />
      </div>
      <div className="feld">
        <label htmlFor="notiz">Notiz</label>
        <textarea id="notiz" name="notiz" className="eingabe" defaultValue={spieltag?.notiz ?? ""} aria-describedby="notiz-hinweis" />
        <span id="notiz-hinweis" className="hinweis">Optional, z. B. „Wir starten eine halbe Stunde früher“.</span>
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <div className="knopfreihe">
        <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Spieltag speichern"}</button>
        <Link href="/spieltage" className="knopf knopf--hell">Abbrechen</Link>
      </div>
    </form>
  );
}
