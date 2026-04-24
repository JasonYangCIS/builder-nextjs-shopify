"use client";
import useSWR from "swr";
import { formatDate, formatMoney } from "@/utils/date";

interface OrderRow {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "same-origin" });
  if (res.status === 401) return { orders: [] as OrderRow[], unauthenticated: true };
  if (!res.ok) throw new Error("Failed to load orders");
  return (await res.json()) as { orders: OrderRow[]; unauthenticated?: boolean };
};

export default function OrderHistoryList() {
  const { data, isLoading } = useSWR("/api/customer?orders=1", fetcher);
  if (isLoading) return <p className="text-muted-foreground">Loading orders…</p>;
  if (data?.unauthenticated) return <p className="text-muted-foreground">Please log in to view your orders.</p>;
  if (!data?.orders.length) return <p className="text-muted-foreground">No orders yet.</p>;
  return (
    <ul className="flex flex-col gap-4">
      {data.orders.map((o) => (
        <li key={o.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{o.name}</span>
            <span className="text-sm text-muted-foreground">{formatDate(o.processedAt)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>
              {o.financialStatus ?? "—"} · {o.fulfillmentStatus ?? "Unfulfilled"}
            </span>
            <span className="font-medium">
              {formatMoney(o.totalPrice.amount, o.totalPrice.currencyCode)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
