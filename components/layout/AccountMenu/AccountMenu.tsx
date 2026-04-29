"use client";
import useSWR from "swr";
import Link from "next/link";
import styles from "./AccountMenu.module.scss";

interface MeResponse {
  authenticated: boolean;
  customer?: { firstName?: string; emailAddress?: { emailAddress?: string } };
}

const fetcher = async (url: string): Promise<MeResponse> => {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) return { authenticated: false };
  return (await res.json()) as MeResponse;
};

export default function AccountMenu() {
  const { data } = useSWR<MeResponse>("/api/customer", fetcher, { revalidateOnFocus: false });

  if (!data?.authenticated) {
    return (
      <Link href="/api/auth/login" className={styles.iconBtn} aria-label="Log in">
        <UserIcon />
      </Link>
    );
  }

  const name =
    data.customer?.firstName ??
    data.customer?.emailAddress?.emailAddress ??
    "Account";

  return (
    <div className="flex items-center gap-2">
      <Link href="/account" className={styles.nameLink}>
        {name}
      </Link>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className={styles.exitBtn}>
          [ Exit ]
        </button>
      </form>
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
