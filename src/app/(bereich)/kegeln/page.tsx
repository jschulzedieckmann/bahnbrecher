import type { Metadata } from "next";
import { mitgliedPflicht } from "@/lib/auth";
import { Seitenkopf } from "@/components/bausteine";
import { Kegelbahn } from "./bahn";

export const metadata: Metadata = { title: "Kegeln" };

export default async function Kegeln() {
  await mitgliedPflicht();
  return (
    <>
      <Seitenkopf titel="Kegeln" text="Zum Üben zwischendurch. Zählt nicht in die Statistik, die Leistung ist ja nebensächlich (§ 1)." />
      <Kegelbahn />
    </>
  );
}
