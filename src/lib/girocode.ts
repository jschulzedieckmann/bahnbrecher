import QRCode from "qrcode";

/**
 * Text für einen GiroCode (EPC-QR, Version 002). Banking-Apps füllen damit
 * Empfänger, IBAN, Betrag und Verwendungszweck automatisch aus.
 */
export function girocodeText({ name, iban, betrag, zweck }: { name: string; iban: string; betrag: number; zweck: string }) {
  return [
    "BCD",
    "002",
    "1",
    "SCT",
    "",
    name.trim().slice(0, 70),
    iban.replace(/\s+/g, "").toUpperCase(),
    betrag > 0 ? `EUR${betrag.toFixed(2)}` : "",
    "",
    "",
    zweck.trim().slice(0, 140),
  ].join("\n");
}

/** Der GiroCode als SVG-Text, auf dem Server erzeugt. */
export function girocodeSvg(daten: Parameters<typeof girocodeText>[0]) {
  return QRCode.toString(girocodeText(daten), { type: "svg", errorCorrectionLevel: "M", margin: 0 });
}
