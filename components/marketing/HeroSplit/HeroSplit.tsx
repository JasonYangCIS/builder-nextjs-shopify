import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";

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
    <section
      className="grid items-stretch gap-12 py-16 md:grid-cols-2"
    >
      {/* Copy */}
      <div className="flex flex-col justify-center gap-5">
        {eyebrow && (
          <div
            className="t-eyebrow flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              style={{ width: "28px", height: "1px", background: "var(--cyan-3)", boxShadow: "var(--glow-cyan-sm)", display: "inline-block" }}
            />
            {eyebrow}
          </div>
        )}

        {heading && (
          <Heading
            className="t-display"
            style={{
              fontSize: "clamp(40px, 6.4vw, 88px)",
              letterSpacing: "0.03em",
              lineHeight: 0.95,
              color: "var(--ink-0)",
              textTransform: "uppercase",
            }}
          >
            {heading}
          </Heading>
        )}

        {body && (
          <p
            style={{
              maxWidth: "480px",
              fontSize: "var(--t-lg)",
              color: "var(--ink-1)",
              lineHeight: 1.6,
            }}
          >
            {body}
          </p>
        )}

        {ctaLabel && ctaHref && (
          <div style={{ marginTop: "8px" }}>
            <Button asChild size="lg">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div
          className="relative overflow-hidden x-frame"
          style={{ aspectRatio: "4/5" }}
        >
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
          {/* Scan-line overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)",
              mixBlendMode: "overlay",
            }}
          />
        </div>
      )}
    </section>
  );
}
