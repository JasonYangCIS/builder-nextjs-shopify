import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={`relative z-10 mt-20 w-full ${styles.footer}`}>
      <div aria-hidden="true" className={styles.dividerGlow} />

      <div className={`mx-auto max-w-7xl px-4 py-10 md:px-14 ${styles.shell}`}>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className={`t-display ${styles.brandTitle}`}>BUILDER SHOP</span>
            <p className={styles.brandText}>
              Headless storefront powered by<br />
              <span className={styles.brandAccent}>Builder.io</span> +{" "}
              <span className={styles.brandAccent}>Shopify</span>
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2">
            <span className={`t-eyebrow ${styles.eyebrow}`}>Navigate</span>
            {[
              { href: "/collections/all", label: "Catalogue" },
              { href: "/account",         label: "Account" },
              { href: "/cart",            label: "Cart" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* System status */}
          <div className="flex flex-col gap-3">
            <span className="t-eyebrow">System status</span>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className={styles.statusDot} />
              <span className={styles.statusLabel}>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-8 flex flex-col items-start justify-between gap-2 pt-6 md:flex-row md:items-center ${styles.bottomBar}`}>
          <p className={`t-mono ${styles.bottomText}`}>
            © {new Date().getFullYear()} BUILDER SHOP — XENOSPHERE DESIGN SYSTEM
          </p>
          <p className={`t-mono ${styles.bottomTextRight}`}>⌁ VOL. 01</p>
        </div>
      </div>
    </footer>
  );
}
