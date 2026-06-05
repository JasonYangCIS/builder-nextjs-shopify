"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@jasonyangcis/core-ui";
import CartLineItem from "@/components/shopify/CartLineItem/CartLineItem";
import DiscountCodeInput from "@/components/shopify/DiscountCodeInput/DiscountCodeInput";
import CheckoutButton from "@/components/shopify/CheckoutButton/CheckoutButton";
import { useCart } from "@/lib/cart/useCart";
import { formatMoney } from "@/utils/date";
import styles from "./CartDrawer.module.scss";

export default function CartDrawer() {
  const { cart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`Open cart, ${count} items`}
          data-has-items={count > 0 ? "true" : "false"}
          className={styles.trigger}
        >
          <CartIcon />
          {count > 0 && <span className={`t-mono ${styles.count}`}>{count}</span>}
        </button>
      </DialogTrigger>

      <DialogContent>
        <div className={styles.header}>
          <div className={`t-eyebrow flex items-center gap-2 ${styles.headerEyebrow}`}>
            <CartIcon />
            CART MANIFEST
          </div>
          <DialogTitle className={`t-display ${styles.title}`}>Your artifacts</DialogTitle>
          <DialogDescription className="sr-only">
            Review the items in your cart before checking out.
          </DialogDescription>
        </div>

        {!cart || cart.lines.length === 0 ? (
          <div className={`flex flex-col items-center gap-4 py-12 ${styles.empty}`}>
            <span className={styles.emptyGlyph}>◈</span>
            <p className={`t-mono ${styles.emptyText}`}>No artifacts acquired</p>
          </div>
        ) : (
          <div className={`flex flex-col ${styles.body}`}>
            <ul className={`flex-1 overflow-y-auto ${styles.list}`} aria-live="polite">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
            <div className={`flex flex-col gap-4 ${styles.footer}`}>
              <DiscountCodeInput />
              <div className={`flex justify-between items-baseline ${styles.subtotalRow}`}>
                <span className="t-eyebrow">Subtotal</span>
                <span className={`t-display ${styles.subtotalAmount}`}>
                  {formatMoney(
                    cart.cost.subtotalAmount.amount,
                    cart.cost.subtotalAmount.currencyCode,
                  )}
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

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 4h2l2.5 12h11l2-8H7" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
