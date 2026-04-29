import Link from "next/link";
import Button from "@/components/ui/Button/Button";

export interface HeroCenteredProps {
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  headingLevel?: "h1" | "h2" | null;
}

export default function HeroCentered({
  heading,
  body,
  ctaLabel,
  ctaHref,
  headingLevel = "h1",
}: HeroCenteredProps) {
  const Heading = headingLevel ?? "h1";
  return (
    <section
      className="relative flex flex-col items-center gap-6 py-20 text-center"
    >
      {/* Eyebrow line */}
      <div
        aria-hidden="true"
        style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to bottom, transparent, var(--cyan-3))",
          marginBottom: "-8px",
        }}
      />

      {heading && (
        <Heading
          className="t-display"
          style={{
            fontSize: "clamp(40px, 7vw, 88px)",
            letterSpacing: "0.04em",
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
            maxWidth: "560px",
            fontSize: "var(--t-lg)",
            color: "var(--ink-1)",
            lineHeight: 1.6,
          }}
        >
          {body}
        </p>
      )}

      {ctaLabel && ctaHref && (
        <Button asChild size="lg">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}

      {/* Bottom line */}
      <div
        aria-hidden="true"
        style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to top, transparent, var(--cyan-3))",
          marginTop: "-8px",
        }}
      />
    </section>
  );
}
