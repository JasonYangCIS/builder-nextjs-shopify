"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/collections/all", label: "Catalogue",     num: "01" },
  { href: "/design-system",   label: "Design Codex",  num: "02" },
  { href: "/account",         label: "Account",        num: "03" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when route changes
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger trigger — visible only on mobile */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-center justify-center md:hidden"
        style={{
          gap: "5px",
          width: "38px",
          height: "38px",
          background: "transparent",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: open ? "var(--cyan-line)" : "var(--border)",
          cursor: "pointer",
          clipPath: "var(--chamfer-sm)",
          transition: "border-color 0.16s, box-shadow 0.16s",
          boxShadow: open ? "var(--glow-cyan-sm)" : "none",
        }}
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            background: "rgba(6, 9, 15, 0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Slide-in panel */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "min(320px, 90vw)",
          background: "rgba(6, 9, 15, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderLeft: "1px solid var(--cyan-line)",
          boxShadow:
            "-2px 0 0 0 rgba(61,217,214,0.25), -24px 0 80px rgba(0,0,0,0.8)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "24px" }}
        >
          <span
            className="t-eyebrow"
            style={{ fontSize: "9px" }}
          >
            ⌁ Navigation
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--ink-1)",
              cursor: "pointer",
              clipPath: "var(--chamfer-sm)",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Links */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isActive ? "var(--cyan-3)" : "var(--ink-0)",
                    border: "1px solid",
                    borderColor: isActive ? "var(--cyan-line)" : "transparent",
                    background: isActive ? "rgba(61,217,214,0.10)" : "transparent",
                    boxShadow: isActive ? "var(--glow-cyan-sm)" : "none",
                    clipPath: "var(--chamfer-sm)",
                    transition: "all 0.16s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "9px",
                      color: isActive ? "var(--cyan-3)" : "var(--ink-2)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {link.num}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom decoration */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            color: "var(--ink-2)",
            textTransform: "uppercase",
          }}
        >
          ⌁ XENOSPHERE DESIGN SYSTEM<br />
          <span style={{ color: "var(--ink-2)", opacity: 0.6 }}>VOL. 01</span>
        </div>
      </nav>
    </>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 18 14"
      width="16"
      height="12"
      fill="none"
      stroke="var(--ink-1)"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ transition: "transform 0.2s" }}
    >
      {open ? (
        <>
          <line x1="1" y1="1" x2="17" y2="13" />
          <line x1="17" y1="1" x2="1" y2="13" />
        </>
      ) : (
        <>
          <line x1="0" y1="1" x2="18" y2="1" />
          <line x1="0" y1="7" x2="18" y2="7" />
          <line x1="0" y1="13" x2="18" y2="13" />
        </>
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}
