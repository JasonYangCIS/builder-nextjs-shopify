"use client";
import Image from "next/image";
import Link from "next/link";
import QuantityStepper from "@/components/shopify/QuantityStepper/QuantityStepper";
import { formatMoney } from "@/utils/date";
import { useCart } from "@/lib/cart/useCart";
import type { CartLine } from "@/lib/shopify/types";

export interface CartLineItemProps {
  line: CartLine;
}

export default function CartLineItem({ line }: CartLineItemProps) {
  const { mutate } = useCart();
  const merch = line.merchandise;
  const max = merch.quantityAvailable ?? 99;

  async function update(quantity: number) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", lineId: line.id, quantity }),
      credentials: "same-origin",
    });
    await mutate();
  }

  async function remove() {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", lineId: line.id }),
      credentials: "same-origin",
    });
    await mutate();
  }

  return (
    <li
      className="flex gap-3 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Image */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: "64px", height: "64px", background: "var(--void-3)", border: "1px solid var(--border)" }}
      >
        {merch.image && (
          <Image
            src={merch.image.url}
            alt={merch.image.altText ?? merch.product.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/products/${merch.product.handle}`}
          className="t-display"
          style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--ink-0)", textDecoration: "none" }}
        >
          {merch.product.title}
        </Link>
        {merch.title !== "Default Title" && (
          <p
            className="t-mono"
            style={{ fontSize: "var(--t-xs)", color: "var(--ink-2)", letterSpacing: "0.1em" }}
          >
            {merch.title}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 mt-2">
          <QuantityStepper value={line.quantity} max={max} onChange={update} />
          <span
            className="t-display"
            style={{ fontSize: "var(--t-sm)", color: "var(--cyan-3)" }}
          >
            {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={remove}
        aria-label="Remove item"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--ink-2)",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "flex-start",
          transition: "color 0.16s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--xenosphere-danger)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"; }}
      >
        <TrashIcon />
      </button>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}
