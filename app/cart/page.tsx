"use client";
import CartLineItem from "@/components/shopify/CartLineItem/CartLineItem";
import DiscountCodeInput from "@/components/shopify/DiscountCodeInput/DiscountCodeInput";
import CheckoutButton from "@/components/shopify/CheckoutButton/CheckoutButton";
import { useCart } from "@/lib/cart/useCart";
import { formatMoney } from "@/utils/date";

export default function CartPage() {
  const { cart, isLoading } = useCart();
  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!cart || cart.lines.length === 0) {
    return (
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
        <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
      </section>
    );
  }
  return (
    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
        <ul className="mt-6">
          {cart.lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </ul>
      </div>
      <aside className="flex flex-col gap-4 rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <DiscountCodeInput />
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>
            {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
          </span>
        </div>
        <CheckoutButton />
      </aside>
    </section>
  );
}
