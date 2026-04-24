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
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      {heading && <Heading className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">{heading}</Heading>}
      {body && <p className="max-w-xl text-lg text-muted-foreground">{body}</p>}
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </section>
  );
}
