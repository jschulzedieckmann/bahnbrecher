import Image from "next/image";
import Link from "next/link";
import { mitgliedPflicht } from "@/lib/auth";
import { Seitenleiste, TabLeiste } from "@/components/navigation";
import styles from "@/components/rahmen.module.css";

export default async function BereichLayout({ children }: { children: React.ReactNode }) {
  const profil = await mitgliedPflicht();
  return (
    <div className={styles.app}>
      <header className={styles.kopf}>
        <Link href="/" className={styles.marke}>
          <Image src="/logo-160.webp" alt="" width={48} height={48} className={styles.logo} priority />
          <span className={`plakatschrift ${styles.name}`}>Die Bahnbrecher</span>
        </Link>
        <span className={styles.gruss}>Moin, {profil.vorname}!</span>
      </header>
      <div className={styles.koerper}>
        <Seitenleiste istAdmin={profil.rolle === "admin"} />
        <main className={styles.inhalt} id="inhalt">{children}</main>
      </div>
      <TabLeiste />
    </div>
  );
}
