"use client";
import type { MouseEvent } from "react";
import styles from "./page.module.scss";

interface TableOfContentsProps {
  sections: readonly { id: string; num: string; title: string }[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
  }

  return (
    <nav aria-label="Table of contents" className={styles.toc}>
      <p className="t-eyebrow mb-4">On this page</p>
      <ol className={`grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3 ${styles.tocList}`}>
        {sections.map(({ id, num, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`t-mono ${styles.tocLink}`}
              onClick={(event) => handleClick(event, id)}
            >
              <span className={styles.tocNum}>§ {num}</span>
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
