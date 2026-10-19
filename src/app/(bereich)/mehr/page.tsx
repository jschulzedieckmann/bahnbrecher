import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarDays, ChevronRight, CircleDot, LogOut, Settings, UserRound, Users, Wallet } from "lucide-react";
import { mitgliedPflicht } from "@/lib/auth";
import { abmelden } from "@/app/(zugang)/aktionen";
import styles from "./mehr.module.css";

export const metadata: Metadata = { title: "Mehr" };

export default async function Mehr() {
  const profil = await mitgliedPflicht();
  const seiten = [
    { href: "/kegeln", name: "Selbst kegeln", icon: CircleDot },
    { href: "/termine", name: "Termine", icon: CalendarDays },
    { href: "/mitglieder", name: "Mitglieder", icon: Users },
    { href: "/satzung", name: "Satzung", icon: BookOpen },
    { href: "/beitrag", name: "Beitrag", icon: Wallet },
    { href: "/konto", name: "Mein Konto", icon: UserRound },
    ...(profil.rolle === "admin" ? [{ href: "/verwaltung", name: "Verwaltung", icon: Settings }] : []),
  ];
  return (
    <>
      <h1 className="seitentitel">Mehr</h1>
      <ul className={`blatt ${styles.liste}`}>
        {seiten.map(({ href, name, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className={styles.eintrag}>
              <Icon size={22} strokeWidth={2.4} aria-hidden /> {name}
              <ChevronRight size={20} strokeWidth={2.6} aria-hidden className={styles.pfeil} />
            </Link>
          </li>
        ))}
      </ul>
      <form action={abmelden}>
        <button type="submit" className="knopf knopf--hell"><LogOut size={18} strokeWidth={2.6} aria-hidden /> Abmelden</button>
      </form>
    </>
  );
}
