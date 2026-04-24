"use client";
import { useCart } from "@/lib/cart/useCart";
import { formatMoney } from "@/utils/date";

export default function MiniCart() {
  const { cart } = useCart();
  if (!cart || cart.totalQuantity === 0) {
    return <p className="text-sm text-muted-foreground">Cart empty</p>;
  }
  return (
    <p className="text-sm">
      {cart.totalQuantity} item{cart.totalQuantity === 1 ? "" : "s"} ·{" "}
      {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
    </p>
  );
}
