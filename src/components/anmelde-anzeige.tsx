import { anzeigename } from "@/lib/auth";
import type { MitgliedKurz } from "@/lib/daten";
import styles from "./anmelde-anzeige.module.css";

type Liste = { dabei: MitgliedKurz[]; abgesagt: MitgliedKurz[]; offen: MitgliedKurz[] };

function Namen({ leute, ichId }: { leute: MitgliedKurz[]; ichId: string }) {
  return (
    <>
      {leute.map((m, i) => (
        <span key={m.id}>
          <span className={m.id === ichId ? styles.ich : undefined}>{anzeigename(m)}</span>
          {i < leute.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

/** Zu- und Absagen zum nächsten Spieltag, eingetragen von Admin oder Schriftführer. */
export function AnmeldeAnzeige({ liste, ichId, ton = "plakat" }: { liste: Liste; ichId: string; ton?: "plakat" | "blatt" }) {
  const niemand = liste.dabei.length === 0 && liste.abgesagt.length === 0;
  return (
    <div className={`${styles.anzeige} ${ton === "plakat" ? styles.plakat : styles.blatt}`}>
      {niemand ? (
        <p className={styles.klein}>Noch keine Anmeldungen.</p>
      ) : (
        <>
          <p className={styles.dabei}>
            <span className={styles.etikett}>Dabei ({liste.dabei.length}):</span>{" "}
            {liste.dabei.length ? <Namen leute={liste.dabei} ichId={ichId} /> : "noch niemand"}
          </p>
          {liste.abgesagt.length > 0 && (
            <p className={styles.klein}>
              <span className={styles.etikett}>Abgesagt:</span> <Namen leute={liste.abgesagt} ichId={ichId} />
            </p>
          )}
          {liste.offen.length > 0 && (
            <p className={styles.klein}>
              <span className={styles.etikett}>Noch offen:</span> <Namen leute={liste.offen} ichId={ichId} />
            </p>
          )}
        </>
      )}
    </div>
  );
}
