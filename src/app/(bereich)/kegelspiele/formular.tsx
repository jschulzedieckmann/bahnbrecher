"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Kegelspiel } from "@/lib/daten";
import { spielSpeichern } from "./aktionen";

export function SpielFormular({ spiel }: { spiel?: Kegelspiel }) {
  const [status, aktion, laeuft] = useActionState(spielSpeichern, undefined);
  return (
    <form action={aktion} className="formular blatt" style={{ padding: 18 }}>
      {spiel && <input type="hidden" name="id" value={spiel.id} />}
      <div className="feld">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" className="eingabe" defaultValue={spiel?.name} required />
      </div>
      <div className="feld">
        <label htmlFor="schwierigkeit">Schwierigkeit</label>
        <select id="schwierigkeit" name="schwierigkeit" className="eingabe" defaultValue={spiel?.schwierigkeit ?? "leicht"}>
          <option value="leicht">leicht</option>
          <option value="mittel">mittel</option>
          <option value="schwer">schwer</option>
        </select>
      </div>
      <div className="feld">
        <label htmlFor="form">Form</label>
        <select id="form" name="form" className="eingabe" defaultValue={spiel?.form ?? "jeder_fuer_sich"}>
          <option value="jeder_fuer_sich">jeder für sich</option>
          <option value="jeder_gegen_jeden">jeder gegen jeden</option>
          <option value="mannschaften">Mannschaften</option>
          <option value="einer_gegen_alle">einer gegen alle</option>
          <option value="saisonspiel">Saisonspiel</option>
        </select>
      </div>
      <div className="feld">
        <label htmlFor="regel">So geht&rsquo;s</label>
        <textarea id="regel" name="regel" className="eingabe" defaultValue={spiel?.regel} required />
      </div>
      <div className="feld">
        <label htmlFor="bei_uns">Bei uns</label>
        <textarea id="bei_uns" name="bei_uns" className="eingabe" defaultValue={spiel?.bei_uns ?? ""} aria-describedby="bei-uns-hinweis" />
        <span id="bei-uns-hinweis" className="hinweis">Optional: eure Hausregeln für dieses Spiel.</span>
      </div>
      {status?.fehler && <p className="fehler" role="alert">{status.fehler}</p>}
      <div className="knopfreihe">
        <button className="knopf" type="submit" disabled={laeuft}>{laeuft ? "Kugel rollt …" : "Spiel speichern"}</button>
        <Link href="/kegelspiele" className="knopf knopf--hell">Abbrechen</Link>
      </div>
    </form>
  );
}
