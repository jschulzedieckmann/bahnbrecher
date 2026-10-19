"use client";

import { useRouter } from "next/navigation";

export function JahrWahl({ jahre, jahr, pfad }: { jahre: number[]; jahr: number; pfad: string }) {
  const router = useRouter();
  return (
    <label className="knopfreihe" style={{ gap: 8, fontWeight: 700 }}>
      Jahr
      <select
        className="eingabe"
        style={{ width: "auto", minHeight: 44 }}
        value={jahr}
        onChange={(e) => router.push(`${pfad}?jahr=${e.target.value}`)}
      >
        {jahre.map((j) => <option key={j} value={j}>{j}</option>)}
      </select>
    </label>
  );
}
