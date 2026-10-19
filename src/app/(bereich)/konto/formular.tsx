"use client";

import { useActionState, useEffect, useRef } from "react";
import { passwortAendern } from "./aktionen";

export function PasswortAendern() {
  const [status, aktion, laeuft] = useActionState(passwortAendern, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (status?.ok) form.current?.reset();
  }, [status]);
  return (
    <form ref={form} action={aktion} className="formular">
      <div className="feld">
        <label htmlFor="aktuell">Aktuelles Passwort</label>
        <input id="aktuell" name="aktuell" type="password" className="eingabe" autoComplete="current-password" required />
      </div>
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
      {status?.ok && <p className="erfolg" role="status">{status.ok}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Passwort ändern"}</button>
    </form>
  );
}
