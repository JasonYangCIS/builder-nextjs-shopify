import Link from "next/link";
import { HeroCentered as CoreHeroCentered, Button } from "@jasonyangcis/core-ui";
import type { HeroCenteredProps } from "@jasonyangcis/core-ui";

export type { HeroCenteredProps };

export default function HeroCentered({ ctaLabel, ctaHref, ...rest }: HeroCenteredProps) {
  const ctaSlot =
    ctaLabel && ctaHref ? (
      <Button asChild size="lg">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    ) : undefined;

  return <CoreHeroCentered {...rest} ctaLabel={ctaLabel} ctaHref={ctaHref} ctaSlot={ctaSlot} />;
}
