"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function KopierKnopf({ wert }: { wert: string }) {
  const [kopiert, setKopiert] = useState(false);
  return (
    <button
      type="button"
      className="knopf knopf--klein"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(wert);
          setKopiert(true);
          setTimeout(() => setKopiert(false), 2500);
        } catch {
          setKopiert(false);
        }
      }}
    >
      {kopiert ? <Check size={16} strokeWidth={3} aria-hidden /> : <Copy size={16} strokeWidth={2.6} aria-hidden />}
      <span aria-live="polite">{kopiert ? "IBAN kopiert." : "IBAN kopieren"}</span>
    </button>
  );
}
