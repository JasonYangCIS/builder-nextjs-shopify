"use client";
import { useState, useTransition } from "react";
import { Button } from "@jasonyangcis/core-ui";
import { useCart } from "@/lib/cart/useCart";
import type { AddToCartButtonProps } from "./AddToCartButton.types";

export default function AddToCartButton({
  variantId,
  availableForSale,
  quantity = 1,
  label,
  className,
}: AddToCartButtonProps) {
  const { mutate } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const disabled = !availableForSale || pending || !variantId;

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", variantId, quantity }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        setError("Could not add to cart");
        return;
      }
      const json = (await res.json()) as { userErrors?: { message: string }[] };
      if (json.userErrors?.length) {
        setError(json.userErrors[0].message);
        return;
      }
      await mutate();
    });
  }

  return (
    <div className={className}>
      <Button onClick={handleClick} disabled={disabled} aria-busy={pending} size="lg" className="w-full">
        {!availableForSale
          ? "Artifact depleted"
          : pending
            ? "Acquiring..."
            : (label ?? "Acquire artifact")}
      </Button>
      {error && (
        <p
          role="alert"
          className="t-mono"
          style={{ marginTop: "8px", fontSize: "var(--t-xs)", color: "var(--xenosphere-danger)", letterSpacing: "0.1em" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export type { AddToCartButtonProps } from "./AddToCartButton.types";
