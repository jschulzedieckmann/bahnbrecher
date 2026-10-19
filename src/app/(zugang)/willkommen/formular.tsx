"use client";

import { useActionState } from "react";
import { startpasswortErsetzen } from "../aktionen";

export function WillkommenFormular() {
  const [status, aktion, laeuft] = useActionState(startpasswortErsetzen, undefined);
  return (
    <form action={aktion} className="formular">
      <div className="feld">
        <label htmlFor="neu">Neues Passwort</label>
        <input id="neu" name="neu" type="password" className="eingabe" autoComplete="new-password" minLength={8} required aria-describedby="neu-hinweis" />
        <span id="neu-hinweis" className="hinweis">Mindestens 8 Zeichen.</span>
      </div>
      <div className="feld">
        <label htmlFor="wiederholt">Neues Passwort wiederholen</label>
        <input id="wiederholt" name="wiederholt" type="password" className="eingabe" autoComplete="new-password" required />
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>
        {laeuft ? "Kugel rollt …" : "Passwort speichern"}
      </button>
    </form>
  );
}
