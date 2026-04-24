"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button/Button";
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
    <li className="flex gap-4 border-b py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {merch.image && (
          <Image
            src={merch.image.url}
            alt={merch.image.altText ?? merch.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/products/${merch.product.handle}`} className="font-medium hover:underline">
          {merch.product.title}
        </Link>
        <p className="text-sm text-muted-foreground">{merch.title}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper value={line.quantity} max={max} onChange={update} />
          <span className="font-medium">
            {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={remove} aria-label="Remove item">
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
