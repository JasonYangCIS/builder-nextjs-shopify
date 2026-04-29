"use client";
import useSWR from "swr";
import Link from "next/link";

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
      <Link href="/api/auth/login" className="xeno-icon-btn" aria-label="Log in">
        <UserIcon />
        <style>{`
          .xeno-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--ink-1);
            cursor: pointer;
            transition: color 0.16s, border-color 0.16s, background 0.16s, box-shadow 0.16s;
            clip-path: var(--chamfer-sm);
            text-decoration: none;
          }
          .xeno-icon-btn:hover {
            color: var(--cyan-3);
            border-color: var(--cyan-line);
            background: rgba(61, 217, 214, 0.06);
            box-shadow: var(--glow-cyan-sm);
          }
        `}</style>
      </Link>
    );
  }

  const name =
    data.customer?.firstName ??
    data.customer?.emailAddress?.emailAddress ??
    "Account";

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        style={{
          fontSize: "var(--t-xs)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.12em",
          color: "var(--ink-1)",
          textDecoration: "none",
          textTransform: "uppercase",
        }}
      >
        {name}
      </Link>
      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            fontSize: "var(--t-xs)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.1em",
            color: "var(--ink-2)",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "color 0.16s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cyan-3)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
        >
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
