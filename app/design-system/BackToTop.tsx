"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const SHOW_THRESHOLD = 480;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`t-mono ${styles.backToTop}`}
      aria-label="Back to top"
    >
      <span aria-hidden="true">↑</span> Top
    </button>
  );
}
