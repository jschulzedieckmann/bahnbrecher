import type { Metadata } from "next";
import { adminPflicht } from "@/lib/auth";
import { Seitenkopf } from "@/components/bausteine";
import { SpielFormular } from "../formular";

export const metadata: Metadata = { title: "Spiel anlegen" };

export default async function SpielNeu() {
  await adminPflicht();
  return (
    <>
      <Seitenkopf titel="Spiel anlegen" />
      <SpielFormular />
    </>
  );
}
