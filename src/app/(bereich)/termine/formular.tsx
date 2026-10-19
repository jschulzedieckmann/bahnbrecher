"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Termin } from "@/lib/daten";
import { terminSpeichern } from "./aktionen";

export function TerminFormular({ termin, heute }: { termin?: Termin; heute: string }) {
  const [status, aktion, laeuft] = useActionState(terminSpeichern, undefined);
  const [art, setArt] = useState(termin?.art === "kegelabend" ? "ausflug" : (termin?.art ?? "ausflug"));
  const [datum, setDatum] = useState(termin?.datum ?? "");

  return (
    <form action={aktion} className="formular blatt" style={{ padding: 18 }}>
      {termin && <input type="hidden" name="id" value={termin.id} />}
      <fieldset className="feld" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="feld-name">Art</legend>
        <div className="knopfreihe">
          {(["ausflug", "sonstiges"] as const).map((a) => (
            <label key={a} className={`knopf knopf--klein ${art === a ? "" : "knopf--hell"}`}>
              <input type="radio" name="art" value={a} checked={art === a} onChange={() => setArt(a)} className="nur-bildschirmleser" />
              {a === "ausflug" ? "Ausflug" : "Sonstiges"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="feld">
        <label htmlFor="titel">Titel</label>
        <input id="titel" name="titel" className="eingabe" defaultValue={termin?.titel ?? ""} aria-describedby="titel-hinweis" />
        <span id="titel-hinweis" className="hinweis">Z. B. „Kohlfahrt“ oder „Kegeltour nach Münster“. Kegelabende planst du unter Spieltage.</span>
      </div>
      <div className="feld">
        <label htmlFor="datum">Datum</label>
        <input id="datum" name="datum" type="date" className="eingabe" value={datum} onChange={(e) => setDatum(e.target.value)} required />
        {datum && datum < heute && <span className="hinweis">Das Datum liegt in der Vergangenheit. Speichern geht trotzdem.</span>}
      </div>
      <div className="feld">
        <label htmlFor="uhrzeit">Uhrzeit</label>
        <input id="uhrzeit" name="uhrzeit" type="time" className="eingabe" defaultValue={termin?.uhrzeit?.slice(0, 5) ?? ""} />
      </div>
      <div className="feld">
        <label htmlFor="ort">Ort</label>
        <input id="ort" name="ort" className="eingabe" defaultValue={termin?.ort ?? ""} />
      </div>
      <div className="feld">
        <label htmlFor="notiz">Notiz</label>
        <textarea id="notiz" name="notiz" className="eingabe" defaultValue={termin?.notiz ?? ""} aria-describedby="notiz-hinweis" />
        <span id="notiz-hinweis" className="hinweis">Optional, z. B. Treffpunkt oder was mitzubringen ist.</span>
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <div className="knopfreihe">
        <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Termin speichern"}</button>
        <Link href="/termine" className="knopf knopf--hell">Abbrechen</Link>
      </div>
    </form>
  );
}
