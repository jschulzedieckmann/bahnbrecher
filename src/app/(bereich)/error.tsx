"use client";

export default function Fehler({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="blatt blatt-inhalt" role="alert" style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <h1 className="seitentitel">Da ist was schiefgelaufen.</h1>
      <p>Lade die Seite neu. Wenn es dann immer noch nicht geht, sag dem Admin Bescheid.</p>
      <button type="button" className="knopf" onClick={reset}>Neu laden</button>
    </div>
  );
}
