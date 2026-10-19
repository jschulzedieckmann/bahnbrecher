import Link from "next/link";

export default function NichtGefunden() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ display: "grid", gap: 16, justifyItems: "center", textAlign: "center" }}>
        <p className="plakatschrift" style={{ fontSize: "clamp(64px, 18vw, 120px)" }}>Pudel!</p>
        <h1 style={{ fontSize: 19 }}>Diese Seite gibt es nicht.</h1>
        <Link href="/" className="knopf">Zur Startseite</Link>
      </div>
    </main>
  );
}
