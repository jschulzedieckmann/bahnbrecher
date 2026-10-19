"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, CalendarDays, ChartColumnBig, Dices, Ellipsis, House, ListOrdered,
  Settings, UserRound, Users, Wallet,
} from "lucide-react";
import styles from "./rahmen.module.css";

const HAUPT = [
  { href: "/", name: "Start", icon: House },
  { href: "/termine", name: "Termine", icon: CalendarDays },
  { href: "/spieltage", name: "Spieltage", icon: ListOrdered },
  { href: "/statistik", name: "Statistik", icon: ChartColumnBig },
];

const WEITERE = [
  { href: "/kegelspiele", name: "Kegelspiele", icon: Dices },
  { href: "/mitglieder", name: "Mitglieder", icon: Users },
  { href: "/satzung", name: "Satzung", icon: BookOpen },
  { href: "/beitrag", name: "Beitrag", icon: Wallet },
];

function aktiv(pfad: string, href: string) {
  return href === "/" ? pfad === "/" : pfad === href || pfad.startsWith(`${href}/`);
}

export function Seitenleiste({ istAdmin }: { istAdmin: boolean }) {
  const pfad = usePathname();
  const unten = [
    { href: "/konto", name: "Mein Konto", icon: UserRound },
    ...(istAdmin ? [{ href: "/verwaltung", name: "Verwaltung", icon: Settings }] : []),
  ];
  return (
    <nav className={styles.rail} aria-label="Hauptmenü">
      <ul>
        {[...HAUPT, ...WEITERE].map(({ href, name, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className={styles.railLink} aria-current={aktiv(pfad, href) ? "page" : undefined}>
              <Icon size={20} strokeWidth={2.4} aria-hidden /> {name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.railUnten}>
        {unten.map(({ href, name, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className={styles.railLink} aria-current={aktiv(pfad, href) ? "page" : undefined}>
              <Icon size={20} strokeWidth={2.4} aria-hidden /> {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function TabLeiste() {
  const pfad = usePathname();
  const mehrAktiv = !HAUPT.some((h) => aktiv(pfad, h.href));
  return (
    <nav className={styles.tabs} aria-label="Hauptmenü">
      {HAUPT.map(({ href, name, icon: Icon }) => (
        <Link key={href} href={href} className={styles.tab} aria-current={aktiv(pfad, href) ? "page" : undefined}>
          <span className={styles.tabIcon}><Icon size={22} strokeWidth={2.4} aria-hidden /></span>
          {name}
        </Link>
      ))}
      <Link href="/mehr" className={styles.tab} aria-current={mehrAktiv ? "page" : undefined}>
        <span className={styles.tabIcon}><Ellipsis size={22} strokeWidth={2.4} aria-hidden /></span>
        Mehr
      </Link>
    </nav>
  );
}

export const WEITERE_SEITEN = WEITERE;
