import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative z-10 mt-20 w-full"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Top divider glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--cyan-line), transparent)",
        }}
      />

      <div
        className="mx-auto max-w-7xl px-4 py-10 md:px-14"
        style={{ background: "rgba(6, 9, 15, 0.6)" }}
      >
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span
              className="t-display"
              style={{ fontSize: "12px", letterSpacing: "0.22em", color: "var(--ink-0)" }}
            >
              BUILDER SHOP
            </span>
            <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-2)", lineHeight: 1.6 }}>
              Headless storefront powered by<br />
              <span style={{ color: "var(--cyan-3)" }}>Builder.io</span> +{" "}
              <span style={{ color: "var(--cyan-3)" }}>Shopify</span>
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2">
            <span className="t-eyebrow" style={{ marginBottom: "4px" }}>Navigate</span>
            {[
              { href: "/collections/all", label: "Catalogue" },
              { href: "/account",         label: "Account" },
              { href: "/cart",            label: "Cart" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="footer-link"
                style={{
                  color: "var(--ink-2)",
                  fontSize: "var(--t-sm)",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  transition: "color 0.16s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* System status */}
          <div className="flex flex-col gap-3">
            <span className="t-eyebrow">System status</span>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--xenosphere-success)",
                  boxShadow: "0 0 8px var(--xenosphere-success)",
                }}
              />
              <span style={{ fontSize: "var(--t-xs)", color: "var(--ink-2)", letterSpacing: "0.12em" }}>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-col items-start justify-between gap-2 pt-6 md:flex-row md:items-center"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="t-mono"
            style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)", letterSpacing: "0.16em" }}
          >
            © {new Date().getFullYear()} BUILDER SHOP — XENOSPHERE DESIGN SYSTEM
          </p>
          <p
            className="t-mono"
            style={{ fontSize: "var(--t-xs)", color: "var(--ink-3)", letterSpacing: "0.12em" }}
          >
            ⌁ VOL. 01
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--cyan-3) !important; }
      `}</style>
    </footer>
  );
}
