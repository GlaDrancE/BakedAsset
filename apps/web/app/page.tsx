import styles from "./page.module.css";
import { ClerkAuthButtons } from "./clerk-auth-buttons";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 28,
            margin: 0,
          }}
        >
          Clerk authentication
        </h1>

        <ClerkAuthButtons />
      </main>
    </div>
  );
}
