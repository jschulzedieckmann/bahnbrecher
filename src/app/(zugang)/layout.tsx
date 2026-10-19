import Image from "next/image";
import styles from "./zugang.module.css";

export default function ZugangLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.buehne}>
      <div className={styles.karte}>
        <Image
          src="/logo-320.webp"
          alt="Logo der Bahnbrecher: Bierkrug, Kegel und Burg Lüdinghausen"
          width={160}
          height={160}
          priority
          className={styles.logo}
        />
        {children}
      </div>
    </div>
  );
}
