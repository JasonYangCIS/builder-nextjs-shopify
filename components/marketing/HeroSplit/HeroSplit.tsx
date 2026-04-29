import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import styles from "./HeroSplit.module.scss";

export interface HeroSplitProps {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  headingLevel?: "h1" | "h2" | null;
}

export default function HeroSplit({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  imageUrl,
  imageAlt,
  headingLevel = "h1",
}: HeroSplitProps) {
  const Heading = headingLevel ?? "h1";
  return (
    <section className="grid items-stretch gap-12 py-16 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-5">
        {eyebrow && (
          <div className="t-eyebrow flex items-center gap-3">
            <span aria-hidden="true" className={styles.eyebrowRule} />
            {eyebrow}
          </div>
        )}

        {heading && (
          <Heading className={`t-display ${styles.heading}`}>{heading}</Heading>
        )}

        {body && <p className={styles.body}>{body}</p>}

        {ctaLabel && ctaHref && (
          <div className={styles.ctaWrap}>
            <Button asChild size="lg">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className={`relative overflow-hidden x-frame ${styles.imageFrame}`}>
          <span className="corner-tl" aria-hidden="true" />
          <span className="corner-br" aria-hidden="true" />
          <Image
            src={imageUrl}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none ${styles.scanlines}`}
          />
        </div>
      )}
    </section>
  );
}
