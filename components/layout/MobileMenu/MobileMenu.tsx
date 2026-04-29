"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileMenu.module.scss";

const NAV_LINKS = [
  { href: "/collections/all", label: "Catalogue",     num: "01" },
  { href: "/design-system",   label: "Design Codex",  num: "02" },
  { href: "/account",         label: "Account",        num: "03" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        data-open={open ? "true" : "false"}
        className={`flex flex-col items-center justify-center md:hidden ${styles.trigger}`}
      >
        <HamburgerIcon open={open} />
      </button>

      {/* Backdrop + drawer rendered in a portal to escape any ancestor that
          creates a containing block for `position: fixed` (transform / filter /
          backdrop-filter / will-change / contain). */}
      {mounted && createPortal(
        <>
          {open && (
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className={styles.backdrop}
            />
          )}

          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            data-open={open ? "true" : "false"}
            className={styles.panel}
          >
            <div className={`flex items-center justify-between ${styles.panelHeader}`}>
              <span className={`t-eyebrow ${styles.panelEyebrow}`}>⌁ Navigation</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={styles.closeBtn}
              >
                <CloseIcon />
              </button>
            </div>

            <ul className={styles.list}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-active={isActive ? "true" : "false"}
                      className={styles.link}
                    >
                      <span className={styles.linkNum}>{link.num}</span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className={styles.bottom}>
              ⌁ XENOSPHERE DESIGN SYSTEM<br />
              <span className={styles.bottomMuted}>VOL. 01</span>
            </div>
          </nav>
        </>,
        document.body,
      )}
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
