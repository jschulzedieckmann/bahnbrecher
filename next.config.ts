import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
