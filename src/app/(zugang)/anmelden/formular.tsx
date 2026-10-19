"use client";

import Link from "next/link";
import { useActionState } from "react";
import { anmelden } from "../aktionen";

export function AnmeldeFormular() {
  const [status, aktion, laeuft] = useActionState(anmelden, undefined);
  return (
    <form action={aktion} className="formular" noValidate>
      <div className="feld">
        <label htmlFor="benutzername">Benutzername</label>
        <input
          id="benutzername"
          name="benutzername"
          className="eingabe"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby="benutzername-hinweis"
          required
        />
        <span id="benutzername-hinweis" className="hinweis">Dein Vorname, so wie der Admin ihn angelegt hat.</span>
      </div>
      <div className="feld">
        <label htmlFor="passwort">Passwort</label>
        <input id="passwort" name="passwort" type="password" className="eingabe" autoComplete="current-password" required />
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>
        {laeuft ? "Kugel rollt …" : "Anmelden"}
      </button>
      <Link href="/passwort-vergessen" style={{ justifySelf: "center", fontWeight: 700 }}>
        Passwort vergessen?
      </Link>
    </form>
  );
}
