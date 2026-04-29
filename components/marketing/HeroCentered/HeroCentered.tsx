import Link from "next/link";
import Button from "@/components/ui/Button/Button";

export interface HeroCenteredProps {
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  headingLevel?: "h1" | "h2" | null;
  eyebrow?: string | null;
}

/**
 * Splits the heading so the final word can be styled with the cyan accent,
 * matching the Design Codex hero treatment.
 */
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
      {/* Eyebrow row — matches Design Codex hero */}
      {eyebrow && (
        <div
          className="t-eyebrow flex items-center justify-center gap-3"
          style={{ color: "var(--ink-1)" }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "28px",
              height: "1px",
              background: "var(--cyan-3)",
              boxShadow: "var(--glow-cyan-sm)",
              display: "inline-block",
            }}
          />
          {eyebrow}
          <span
            aria-hidden="true"
            style={{
              width: "28px",
              height: "1px",
              background: "var(--cyan-3)",
              boxShadow: "var(--glow-cyan-sm)",
              display: "inline-block",
            }}
          />
        </div>
      )}

      {parts && (
        <Heading
          className="t-display"
          style={{
            fontSize: "clamp(40px, 7vw, 88px)",
            letterSpacing: "0.04em",
            lineHeight: 0.95,
            color: "var(--ink-0)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {parts.lead && (
            <>
              {parts.lead}
              <br />
            </>
          )}
          <span
            style={{
              color: "var(--cyan-3)",
              textShadow: "var(--glow-cyan-md)",
            }}
          >
            {parts.accent}
          </span>
        </Heading>
      )}

      {body && (
        <p
          style={{
            maxWidth: "560px",
            marginTop: "8px",
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
    </section>
  );
}
