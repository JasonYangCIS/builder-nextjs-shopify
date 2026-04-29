"use client";
import Image from "next/image";
import Link from "next/link";
import QuantityStepper from "@/components/shopify/QuantityStepper/QuantityStepper";
import { formatMoney } from "@/utils/date";
import { useCart } from "@/lib/cart/useCart";
import type { CartLine } from "@/lib/shopify/types";
import styles from "./CartLineItem.module.scss";

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
    <li className={`flex gap-3 py-4 ${styles.row}`}>
      <div className={`relative shrink-0 overflow-hidden ${styles.thumb}`}>
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

      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/products/${merch.product.handle}`} className={`t-display ${styles.title}`}>
          {merch.product.title}
        </Link>
        {merch.title !== "Default Title" && (
          <p className={`t-mono ${styles.variant}`}>{merch.title}</p>
        )}
        <div className="flex items-center justify-between gap-2 mt-2">
          <QuantityStepper value={line.quantity} max={max} onChange={update} />
          <span className={`t-display ${styles.amount}`}>
            {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
          </span>
        </div>
      </div>

      <button onClick={remove} aria-label="Remove item" className={styles.removeBtn}>
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
