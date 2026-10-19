"use client";

import { useState } from "react";

/** Gefährliche Aktion mit Rückfrage direkt an Ort und Stelle, ohne Dialogfenster. */
export function LoeschenKnopf({
  aktion, id, knopf, frage, ja, nein,
}: {
  aktion: (form: FormData) => Promise<void>;
  id: string;
  knopf: string;
  frage: string;
  ja: string;
  nein: string;
}) {
  const [offen, setOffen] = useState(false);
  if (!offen) {
    return (
      <div>
        <button type="button" className="knopf knopf--hell" onClick={() => setOffen(true)}>{knopf}</button>
      </div>
    );
  }
  return (
    <form action={aktion} className="blatt" style={{ padding: 16, display: "grid", gap: 12, borderColor: "var(--rot)" }} role="alertdialog" aria-label={knopf}>
      <input type="hidden" name="id" value={id} />
      <p style={{ fontWeight: 700 }}>{frage}</p>
      <div className="knopfreihe">
        <button type="submit" className="knopf knopf--gefahr">{ja}</button>
        <button type="button" className="knopf knopf--hell" onClick={() => setOffen(false)} autoFocus>{nein}</button>
      </div>
    </form>
  );
}
