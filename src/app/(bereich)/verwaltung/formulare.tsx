"use client";

import { useActionState, useState } from "react";
import type { FormStatus } from "@/app/(zugang)/aktionen";
import type { Einstellungen, MitgliedKurz } from "@/lib/daten";
import { beitragSpeichern, mitgliedAnlegen, mitgliedSpeichern } from "./aktionen";

function RollenWahl({ wert }: { wert?: string }) {
  return (
    <div className="feld">
      <label htmlFor="rolle">Rolle</label>
      <select id="rolle" name="rolle" className="eingabe" defaultValue={wert ?? "mitglied"}>
        <option value="mitglied">Mitglied</option>
        <option value="schriftfuehrer">Schriftführer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}

export function NeuesMitglied() {
  const [status, aktion, laeuft] = useActionState(mitgliedAnlegen, undefined);
  // Nach erfolgreichem Anlegen startet das Formular über den key frisch.
  return <NeuesMitgliedFelder key={status?.ok ?? "neu"} status={status} aktion={aktion} laeuft={laeuft} />;
}

function NeuesMitgliedFelder({ status, aktion, laeuft }: { status: FormStatus; aktion: (f: FormData) => void; laeuft: boolean }) {
  const [vorname, setVorname] = useState("");
  const [benutzername, setBenutzername] = useState("");
  const [vonHand, setVonHand] = useState(false);

  const vorschlag = vorname.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "");

  return (
    <form action={aktion} className="formular">
      <div className="feld">
        <label htmlFor="vorname">Vorname</label>
        <input id="vorname" name="vorname" className="eingabe" value={vorname} onChange={(e) => setVorname(e.target.value)} required />
      </div>
      <div className="feld">
        <label htmlFor="nachname">Nachname</label>
        <input id="nachname" name="nachname" className="eingabe" aria-describedby="nachname-hinweis" />
        <span id="nachname-hinweis" className="hinweis">Wird nur als Kürzel angezeigt, z. B. „L.“.</span>
      </div>
      <div className="feld">
        <label htmlFor="benutzername">Benutzername</label>
        <input
          id="benutzername"
          name="benutzername"
          className="eingabe"
          autoCapitalize="none"
          spellCheck={false}
          value={vonHand ? benutzername : vorschlag}
          onChange={(e) => { setVonHand(true); setBenutzername(e.target.value); }}
          required
          aria-describedby="bn-hinweis"
        />
        <span id="bn-hinweis" className="hinweis">Vorschlag: Vorname klein geschrieben. Bei Doppelungen mit Kürzel, z. B. „christianl“.</span>
      </div>
      <div className="feld">
        <label htmlFor="dabei_seit">Dabei seit</label>
        <input id="dabei_seit" name="dabei_seit" type="date" className="eingabe" />
      </div>
      <RollenWahl />
      <p className="hinweis">Das neue Mitglied meldet sich mit dem Startpasswort an und muss es beim ersten Mal ändern. Gib ihm oder ihr Bescheid.</p>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      {status?.ok && <p className="erfolg" role="status">{status.ok}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Mitglied anlegen"}</button>
    </form>
  );
}

export function MitgliedBearbeiten({ mitglied, benutzername }: { mitglied: MitgliedKurz; benutzername: string }) {
  const [status, aktion, laeuft] = useActionState(mitgliedSpeichern, undefined);
  return (
    <form action={aktion} className="formular">
      <input type="hidden" name="id" value={mitglied.id} />
      <p><strong>Benutzername:</strong> {benutzername}</p>
      <div className="feld">
        <label htmlFor="vorname">Vorname</label>
        <input id="vorname" name="vorname" className="eingabe" defaultValue={mitglied.vorname} required />
      </div>
      <div className="feld">
        <label htmlFor="nachname_kuerzel">Kürzel des Nachnamens</label>
        <input id="nachname_kuerzel" name="nachname_kuerzel" className="eingabe" defaultValue={mitglied.nachname_kuerzel ?? ""} placeholder="z. B. L." />
      </div>
      <div className="feld">
        <label htmlFor="dabei_seit">Dabei seit</label>
        <input id="dabei_seit" name="dabei_seit" type="date" className="eingabe" defaultValue={mitglied.dabei_seit ?? ""} />
      </div>
      <RollenWahl wert={mitglied.rolle} />
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      {status?.ok && <p className="erfolg" role="status">{status.ok}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Änderungen speichern"}</button>
    </form>
  );
}

export function BeitragFormular({ werte }: { werte: Einstellungen | null }) {
  const [status, aktion, laeuft] = useActionState(beitragSpeichern, undefined);
  return (
    <form action={aktion} className="formular">
      <div className="feld">
        <label htmlFor="empfaenger">Empfänger</label>
        <input id="empfaenger" name="empfaenger" className="eingabe" defaultValue={werte?.beitrag_empfaenger ?? ""} autoComplete="off" />
      </div>
      <div className="feld">
        <label htmlFor="iban">IBAN</label>
        <input id="iban" name="iban" className="eingabe" defaultValue={werte?.beitrag_iban ?? ""} autoComplete="off" spellCheck={false} />
      </div>
      <div className="feld">
        <label htmlFor="zweck">Verwendungszweck</label>
        <input id="zweck" name="zweck" className="eingabe" defaultValue={werte?.beitrag_verwendungszweck ?? "Monatsbeitrag"} />
      </div>
      <div className="feld">
        <label htmlFor="betrag">Monatsbeitrag in €</label>
        <input id="betrag" name="betrag" className="eingabe" inputMode="decimal" defaultValue={String(werte?.beitrag_betrag ?? 8).replace(".", ",")} aria-describedby="betrag-hinweis" />
        <span id="betrag-hinweis" className="hinweis">Laut § 4 sind es 8 €.</span>
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      {status?.ok && <p className="erfolg" role="status">{status.ok}</p>}
      <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Speichern"}</button>
    </form>
  );
}
