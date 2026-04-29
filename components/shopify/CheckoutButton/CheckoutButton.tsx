"use client";
import Button from "@/components/ui/Button/Button";
import { useCart } from "@/lib/cart/useCart";

export default function CheckoutButton({ label = "Proceed to checkout" }: { label?: string | null }) {
  const { cart } = useCart();
  const disabled = !cart || !cart.checkoutUrl || cart.totalQuantity === 0;
  return (
    <Button
      disabled={disabled}
      onClick={() => {
        if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
      }}
      className="w-full"
      size="lg"
    >
      {label ?? "Proceed to checkout"}
    </Button>
  );
}
