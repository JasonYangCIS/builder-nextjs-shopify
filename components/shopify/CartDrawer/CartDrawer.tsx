"use client";
import { ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog/Dialog";
import Button from "@/components/ui/Button/Button";
import CartLineItem from "@/components/shopify/CartLineItem/CartLineItem";
import DiscountCodeInput from "@/components/shopify/DiscountCodeInput/DiscountCodeInput";
import CheckoutButton from "@/components/shopify/CheckoutButton/CheckoutButton";
import { useCart } from "@/lib/cart/useCart";
import { formatMoney } from "@/utils/date";

export default function CartDrawer() {
  const { cart } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Open cart, ${count} items`}>
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">Your cart</DialogTitle>
        <DialogDescription className="sr-only">
          Review the items in your cart before checking out.
        </DialogDescription>
        {!cart || cart.lines.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="mt-4 flex h-[calc(100%-3rem)] flex-col">
            <ul className="flex-1 overflow-y-auto" aria-live="polite">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-4 border-t pt-4">
              <DiscountCodeInput />
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>
                  {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
                </span>
              </div>
              <CheckoutButton />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
