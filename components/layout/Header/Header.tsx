import Link from "next/link";
import CartDrawer from "@/components/shopify/CartDrawer/CartDrawer";
import AccountMenu from "@/components/layout/AccountMenu/AccountMenu";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "rgba(6, 9, 15, 0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Nav bar */}
      <div
        className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-14"
        style={{ gridTemplateColumns: "auto 1fr auto", height: "60px" }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 no-underline" style={{ color: "var(--ink-0)" }}>
          <CrystalIcon />
          <div className="flex flex-col">
            <span
              className="t-display"
              style={{ fontSize: "13px", letterSpacing: "0.22em", color: "var(--ink-0)" }}
            >
              BUILDER SHOP
            </span>
            <span
              className="t-mono"
              style={{ fontSize: "8px", letterSpacing: "0.2em", color: "var(--cyan-3)", marginTop: "1px" }}
            >
              ∇ POWERED BY XENOSPHERE
            </span>
          </div>
        </Link>

        {/* Primary nav */}
        <nav aria-label="Primary" className="hidden justify-center gap-1 md:flex">
          {[
            { href: "/collections/all", label: "Catalogue", num: "01" },
            { href: "/account",         label: "Account",   num: "02" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              <span className="nav-link__num">{link.num}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <AccountMenu />
          <CartDrawer />
        </div>
      </div>

      {/* Ticker */}
      <div
        className="hidden overflow-hidden md:flex"
        style={{
          borderTop: "1px solid var(--border)",
          background: "rgba(6, 9, 15, 0.5)",
          padding: "5px 56px",
          gap: "24px",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-2)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "var(--cyan-3)" }}>⌁ LIVE</span>
        <span>Free interstellar shipping on orders over $150</span>
        <span style={{ color: "var(--cyan-3)" }}>◈</span>
        <span>All boards rated for zero-gravity terrain</span>
        <span style={{ color: "var(--cyan-3)" }}>◈</span>
        <span>New drop: Void Serpent series available now</span>
        <span style={{ color: "var(--cyan-3)" }}>◈</span>
        <span>Secure Shopify checkout</span>
      </div>

      <style>{`
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-family: var(--font-orbitron), var(--font-sans);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-1);
          text-decoration: none;
          border: 1px solid transparent;
          transition: color 0.16s, border-color 0.16s, background 0.16s, box-shadow 0.16s;
          clip-path: var(--chamfer-sm);
        }
        .nav-link:hover {
          color: var(--ink-0);
          border-color: var(--cyan-line);
          background: rgba(61, 217, 214, 0.06);
        }
        .nav-link__num {
          font-family: var(--font-jetbrains), monospace;
          font-size: 8px;
          color: var(--ink-2);
          letter-spacing: 0.1em;
        }
      `}</style>
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
