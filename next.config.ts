import type { NextConfig } from "next";

// Stand der App: wird beim Bauen festgeschrieben, also bei jedem Push neu.
const baustand = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date());

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    APP_VERSION: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "lokal",
    APP_STAND: baustand,
  },
  // Die Satzung wird zur Laufzeit aus inhalte/ gelesen und muss mit ausgeliefert werden.
  outputFileTracingIncludes: {
    "/satzung": ["./inhalte/satzung.md"],
  },
  // Alles hinter dem Login ist pro Anfrage dynamisch. Ohne Cache Components
  // bleibt das Rendering einfach und vorhersehbar.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
