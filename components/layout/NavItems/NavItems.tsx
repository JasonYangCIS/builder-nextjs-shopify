import Link from "next/link";
import styles from "./NavItems.module.scss";

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
              <Link href={item.href} className={`t-mono ${styles.link}`}>
                {item.label}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </nav>
  );
}
