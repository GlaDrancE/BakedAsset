"use client";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import styles from "./page.module.css";

export function ClerkAuthButtons() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className={styles.ctas} style={{ justifyContent: "center" }}>
        <SignInButton mode="modal">
          <button type="button" className={styles.secondary}>
            Sign in
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button type="button" className={styles.secondary}>
            Create account
          </button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
      }}
    >
      <UserButton />
      <SignOutButton>
        <button type="button" className={styles.secondary}>
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}

