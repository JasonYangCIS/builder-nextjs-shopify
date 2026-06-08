import Image from "next/image";
import Link from "next/link";
import { HeroSplit as CoreHeroSplit, Button } from "@jasonyangcis/core-ui";
import type { HeroSplitProps } from "@jasonyangcis/core-ui";

export type { HeroSplitProps };

export default function HeroSplit({
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  ...rest
}: HeroSplitProps) {
  const imageSlot = imageUrl ? (
    <Image
      src={imageUrl}
      alt={imageAlt ?? ""}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover"
      priority
    />
  ) : undefined;

  const ctaSlot =
    ctaLabel && ctaHref ? (
      <Button asChild size="lg">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    ) : undefined;

  const secondaryCtaSlot =
    secondaryCtaLabel && secondaryCtaHref ? (
      <Button asChild size="lg" variant="outline">
        <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
      </Button>
    ) : undefined;

  return (
    <CoreHeroSplit
      {...rest}
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      secondaryCtaLabel={secondaryCtaLabel}
      secondaryCtaHref={secondaryCtaHref}
      imageSlot={imageSlot}
      ctaSlot={ctaSlot}
      secondaryCtaSlot={secondaryCtaSlot}
    />
  );
}
