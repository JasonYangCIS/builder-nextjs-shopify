import Link from "next/link";

export interface NavItem {
  label: string | null;
  href: string | null;
}

export default function NavItems({ items }: { items?: NavItem[] | null }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Secondary">
      <ul className="flex flex-wrap gap-4 text-sm">
        {items.map((item) =>
          item.label && item.href ? (
            <li key={`${item.label}-${item.href}`}>
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </nav>
  );
}
