import type { Metadata, Viewport } from "next";
import { Archivo, Shrikhand } from "next/font/google";
import "./globals.css";

// next/font lädt die Schriften beim Bauen herunter und liefert sie selbst aus.
// Im Browser gibt es keine Verbindung zu Google.
const shrikhand = Shrikhand({ weight: "400", subsets: ["latin"], variable: "--font-shrikhand", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

const seitenAdresse = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(seitenAdresse),
  title: { default: "Die Bahnbrecher", template: "%s · Die Bahnbrecher" },
  description: "Kegelclub aus Lüdinghausen. Nur für Mitglieder.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Die Bahnbrecher",
    description: "Kegelclub aus Lüdinghausen. Nur für Mitglieder.",
    images: [{ url: "/logo-640.webp", width: 640, height: 640 }],
    locale: "de_DE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f8ac7",
  // Die Seite zeichnet bis unter die Gestenleiste. Den Bereich färbt die Tab-Leiste selbst
  // (rahmen.module.css), sonst malt Chrome ihn cremefarben und die Leiste wirkt zu hoch.
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${shrikhand.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
