import Link from "next/link";
import CartDrawer from "@/components/shopify/CartDrawer/CartDrawer";
import AccountMenu from "@/components/layout/AccountMenu/AccountMenu";
import MobileMenu from "@/components/layout/MobileMenu/MobileMenu";
import styles from "./Header.module.scss";

const NAV_LINKS = [
  { href: "/collections/all", label: "Catalogue",    num: "01" },
  { href: "/design-system",   label: "Design Codex", num: "02" },
  { href: "/account",         label: "Account",       num: "03" },
];

export default function Header() {
  return (
    <header className={`sticky top-0 z-40 w-full ${styles.header}`}>
      {/* Nav bar */}
      <div className={`mx-auto grid max-w-7xl items-center px-4 md:px-14 ${styles.navGrid}`}>
        {/* Brand */}
        <Link href="/" className={`flex items-center gap-3 no-underline ${styles.brandLink}`}>
          <CrystalIcon />
          <div className="flex flex-col">
            <span className={`t-display ${styles.brandTitle}`}>BUILDER SHOP</span>
            <span className={`t-mono hidden sm:block ${styles.brandSub}`}>
              ∇ POWERED BY XENOSPHERE
            </span>
          </div>
        </Link>

        {/* Desktop primary nav */}
        <nav aria-label="Primary" className="hidden justify-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              <span className={styles.navLinkNum}>{link.num}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 justify-self-end">
          <AccountMenu />
          <CartDrawer />
          <MobileMenu />
        </div>
      </div>

      {/* Ticker — desktop only */}
      <div className={`hidden overflow-hidden md:flex ${styles.ticker}`}>
        <span className={styles.tickerAccent}>⌁ LIVE</span>
        <span>Free interstellar shipping on orders over $150</span>
        <span className={styles.tickerAccent}>◈</span>
        <span>All boards rated for zero-gravity terrain</span>
        <span className={styles.tickerAccent}>◈</span>
        <span>New drop: Void Serpent series available now</span>
        <span className={styles.tickerAccent}>◈</span>
        <span>Secure Shopify checkout</span>
      </div>
    </header>
  );
}

function CrystalIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="20"
      height="20"
      fill="none"
      stroke="var(--cyan-3)"
      strokeWidth="1.4"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M16 2 L26 11 L22 28 L10 28 L6 11 Z" />
      <path d="M16 2 L16 28 M6 11 L26 11 M10 28 L22 11 M22 28 L10 11" />
    </svg>
  );
}
