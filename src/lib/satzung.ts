import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

type Paragraph = { titel: string; absaetze: string[]; punkte: string[] };

/** Liest inhalte/satzung.md wörtlich ein und zerlegt sie in Paragraphen. */
export function satzung(): { titel: string; paragraphen: Paragraph[] } {
  const roh = readFileSync(path.join(process.cwd(), "inhalte", "satzung.md"), "utf8");
  let titel = "Satzung";
  const paragraphen: Paragraph[] = [];
  for (const zeile of roh.split(/\r?\n/)) {
    const z = zeile.trim();
    if (!z) continue;
    if (z.startsWith("# ")) titel = z.slice(2);
    else if (z.startsWith("## ")) paragraphen.push({ titel: z.slice(3), absaetze: [], punkte: [] });
    else if (z.startsWith("- ")) paragraphen.at(-1)?.punkte.push(z.slice(2));
    else paragraphen.at(-1)?.absaetze.push(z);
  }
  return { titel, paragraphen };
}
