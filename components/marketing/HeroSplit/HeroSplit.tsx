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
    <section className="grid items-center gap-8 py-12 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {eyebrow && <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
        {heading && <Heading className="text-4xl font-semibold tracking-tight md:text-5xl">{heading}</Heading>}
        {body && <p className="text-lg text-muted-foreground">{body}</p>}
        {ctaLabel && ctaHref && (
          <Button asChild className="w-fit">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <Image
            src={imageUrl}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}
    </section>
  );
}
