"use client";
import { useState, useTransition } from "react";
import { Button } from "@jasonyangcis/core-ui";
import { useCart } from "@/lib/cart/useCart";
import type { Cart, UserError } from "@/lib/shopify/types";
import type { ExpressCheckoutButtonProps } from "./ExpressCheckoutButton.types";

export default function ExpressCheckoutButton({
  variantId,
  availableForSale,
  quantity = 1,
  label,
  className,
}: ExpressCheckoutButtonProps) {
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
      const json = (await res.json()) as { cart: Cart | null; userErrors?: UserError[] };
      if (json.userErrors?.length) {
        setError(json.userErrors[0].message);
        return;
      }
      if (!json.cart?.checkoutUrl) {
        setError("Could not start checkout");
        return;
      }
      void mutate();
      window.location.href = json.cart.checkoutUrl;
    });
  }

  return (
    <div className={className}>
      <Button
        onClick={handleClick}
        disabled={disabled}
        aria-busy={pending}
        data-variant="outline"
        size="lg"
        className="w-full"
      >
        {!availableForSale
          ? "Artifact depleted"
          : pending
            ? "Processing..."
            : (label ?? "Buy now")}
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

export type { ExpressCheckoutButtonProps } from "./ExpressCheckoutButton.types";
