import Link from "next/link";
import { Button } from "@jasonyangcis/core-ui";
import styles from "./HeroCentered.module.scss";

export interface HeroCenteredProps {
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  headingLevel?: "h1" | "h2" | null;
  eyebrow?: string | null;
}

function splitHeading(heading: string): { lead: string; accent: string } {
  const trimmed = heading.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) return { lead: "", accent: trimmed };
  return {
    lead: trimmed.slice(0, lastSpace),
    accent: trimmed.slice(lastSpace + 1),
  };
}

export default function HeroCentered({
  heading,
  body,
  ctaLabel,
  ctaHref,
  headingLevel = "h1",
  eyebrow = "XENOSPHERE / TRANSMISSION / VOL. 01",
}: HeroCenteredProps) {
  const Heading = headingLevel ?? "h1";
  const parts = heading ? splitHeading(heading) : null;

  return (
    <section className="relative flex flex-col items-center gap-6 py-20 text-center">
      {eyebrow && (
        <div className={`t-eyebrow flex items-center justify-center gap-3 ${styles.eyebrow}`}>
          <span aria-hidden="true" className={styles.eyebrowRule} />
          {eyebrow}
          <span aria-hidden="true" className={styles.eyebrowRule} />
        </div>
      )}

      {parts && (
        <Heading className={`t-display ${styles.heading}`}>
          {parts.lead && (
            <>
              {parts.lead}
              <br />
            </>
          )}
          <span className={styles.headingAccent}>{parts.accent}</span>
        </Heading>
      )}

      {body && <p className={styles.body}>{body}</p>}

      {ctaLabel && ctaHref && (
        <Button asChild size="lg">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </section>
  );
}
