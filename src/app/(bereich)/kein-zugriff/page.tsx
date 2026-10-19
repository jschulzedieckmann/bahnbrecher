import Link from "next/link";

export default function KeinZugriff() {
  return (
    <div style={{ display: "grid", gap: 14, justifyItems: "start" }}>
      <h1 className="seitentitel">Das darf nur der Admin.</h1>
      <Link href="/" className="knopf knopf--hell">Zurück</Link>
    </div>
  );
}
