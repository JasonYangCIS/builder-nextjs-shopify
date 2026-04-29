"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog/Dialog";
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
        <button
          aria-label={`Open cart, ${count} items`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: count > 0 ? "auto" : "38px",
            height: "38px",
            padding: count > 0 ? "0 10px" : "0",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--ink-1)",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.16s, border-color 0.16s, background 0.16s, box-shadow 0.16s",
            clipPath: "var(--chamfer-sm)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "var(--cyan-3)";
            el.style.borderColor = "var(--cyan-line)";
            el.style.background = "rgba(61, 217, 214, 0.06)";
            el.style.boxShadow = "var(--glow-cyan-sm)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "var(--ink-1)";
            el.style.borderColor = "var(--border)";
            el.style.background = "transparent";
            el.style.boxShadow = "none";
          }}
        >
          <CartIcon />
          {count > 0 && (
            <span
              className="t-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: "var(--cyan-3)",
                paddingLeft: "2px",
              }}
            >
              {count}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent>
        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "16px" }}>
          <div className="t-eyebrow flex items-center gap-2" style={{ marginBottom: "6px" }}>
            <CartIcon />
            CART MANIFEST
          </div>
          <DialogTitle
            className="t-display"
            style={{ fontSize: "var(--t-xl)", letterSpacing: "0.06em", color: "var(--ink-0)" }}
          >
            Your artifacts
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review the items in your cart before checking out.
          </DialogDescription>
        </div>

        {/* Empty state */}
        {!cart || cart.lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12" style={{ color: "var(--ink-2)" }}>
            <span style={{ fontSize: "40px", opacity: 0.3 }}>◈</span>
            <p className="t-mono" style={{ fontSize: "var(--t-xs)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              No artifacts acquired
            </p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ height: "calc(100% - 120px)" }}>
            <ul className="flex-1 overflow-y-auto" aria-live="polite" style={{ marginBottom: "16px" }}>
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </ul>
            <div className="flex flex-col gap-4" style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <DiscountCodeInput />
              <div
                className="flex justify-between items-baseline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="t-eyebrow">Subtotal</span>
                <span
                  className="t-display"
                  style={{ fontSize: "var(--t-lg)", color: "var(--cyan-3)" }}
                >
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
