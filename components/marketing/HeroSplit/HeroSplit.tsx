import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/utils/cn";
import styles from "./HeroSplit.module.scss";
import type { HeroSplitProps } from "./HeroSplit.types";

export type { HeroSplitProps } from "./HeroSplit.types";

function renderHeadingContent(
  heading: string,
  accent?: string | null,
): React.ReactNode {
  if (!accent) return heading;
  const idx = heading.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return heading;
  const before = heading.slice(0, idx);
  const match = heading.slice(idx, idx + accent.length);
  const after = heading.slice(idx + accent.length);
  return (
    <>
      {before}
      <span className={styles.headingAccent}>{match}</span>
      {after}
    </>
  );
}

export default function HeroSplit({
  eyebrow,
  heading,
  headingAccent,
  body,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  imageUrl,
  imageAlt,
  headingLevel = "h1",
  imagePosition = "right",
  frameLabel,
  frameFootLeft,
  frameFootRight,
}: HeroSplitProps) {
  const Heading = headingLevel ?? "h1";
  const hasFrameChrome = Boolean(frameLabel || frameFootLeft || frameFootRight);
  const imageOnLeft = imagePosition === "left";

  const imageBlock = imageUrl ? (
    <div
      className={cn(
        "relative overflow-hidden x-frame",
        styles.imageFrame,
        hasFrameChrome && styles.fieldReportFrame,
      )}
    >
      <span className="corner-tl" aria-hidden="true" />
      <span className="corner-br" aria-hidden="true" />

      {frameLabel && (
        <span className={cn("t-eyebrow", styles.frameLabel)}>{frameLabel}</span>
      )}

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
        className={cn("absolute inset-0 pointer-events-none", styles.scanlines)}
      />

      {(frameFootLeft || frameFootRight) && (
        <div className={styles.frameFoot}>
          {frameFootLeft && <span className="t-eyebrow">{frameFootLeft}</span>}
          {frameFootRight && (
            <span className={cn("t-eyebrow", styles.frameFootRight)}>
              {frameFootRight}
            </span>
          )}
        </div>
      )}
    </div>
  ) : null;

  const textBlock = (
    <div className="flex flex-col justify-center gap-5">
      {eyebrow && (
        <div className="t-eyebrow flex items-center gap-3">
          <span aria-hidden="true" className={styles.eyebrowRule} />
          {eyebrow}
        </div>
      )}

      {heading && (
        <Heading className={cn("t-display", styles.heading)}>
          {renderHeadingContent(heading, headingAccent)}
        </Heading>
      )}

      {body && <p className={styles.body}>{body}</p>}

      {((ctaLabel && ctaHref) ||
        (secondaryCtaLabel && secondaryCtaHref)) && (
        <div className={styles.ctaRow}>
          {ctaLabel && ctaHref && (
            <Button asChild size="lg">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          )}
          {secondaryCtaLabel && secondaryCtaHref && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="grid items-stretch gap-12 py-16 md:grid-cols-2">
      {imageOnLeft ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
