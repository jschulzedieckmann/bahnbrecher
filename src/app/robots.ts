import type { MetadataRoute } from "next";

// Geschlossener Mitgliederbereich: keine Suchmaschine, kein KI-Crawler.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
