import Link from "next/link";

export interface NavItem {
  label: string | null;
  href: string | null;
}

export default function NavItems({ items }: { items?: NavItem[] | null }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Secondary">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) =>
          item.label && item.href ? (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                className="t-mono"
                style={{
                  fontSize: "var(--t-xs)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  transition: "color 0.14s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--cyan-3)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
              >
                {item.label}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </nav>
  );
}
