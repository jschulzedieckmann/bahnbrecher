"use client";

import { useActionState } from "react";
import { spieltagOeffnen } from "../aktionen";

export function SpieltagStarten({ heute }: { heute: string }) {
  const [status, aktion, laeuft] = useActionState(spieltagOeffnen, undefined);
  return (
    <form action={aktion} className="formular blatt" style={{ padding: 18 }}>
      <div className="feld">
        <label htmlFor="datum">Datum des Kegelabends</label>
        <input id="datum" name="datum" type="date" className="eingabe" defaultValue={heute} required />
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Weiter"}</button>
    </form>
  );
}
