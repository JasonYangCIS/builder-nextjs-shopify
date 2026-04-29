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

  if (isLoading) {
    return (
      <p className="t-mono" style={{ color: "var(--ink-2)", fontSize: "var(--t-xs)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Loading transmissions...
      </p>
    );
  }
  if (data?.unauthenticated) {
    return (
      <p className="t-mono" style={{ color: "var(--ink-2)", fontSize: "var(--t-sm)" }}>
        Authentication required.
      </p>
    );
  }
  if (!data?.orders.length) {
    return (
      <p className="t-mono" style={{ color: "var(--ink-2)", fontSize: "var(--t-xs)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        // No transmissions logged
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-0" style={{ border: "1px solid var(--border)" }}>
      {data.orders.map((o, i) => (
        <li
          key={o.id}
          className="p-4"
          style={{ borderBottom: i < data.orders.length - 1 ? "1px solid var(--border)" : "none" }}
        >
          <div className="flex items-center justify-between gap-4">
            <span
              className="t-display"
              style={{ fontSize: "var(--t-sm)", letterSpacing: "0.08em", color: "var(--ink-0)" }}
            >
              {o.name}
            </span>
            <span
              className="t-mono"
              style={{ fontSize: "var(--t-xs)", color: "var(--ink-2)", letterSpacing: "0.1em" }}
            >
              {formatDate(o.processedAt)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span
              className="t-mono"
              style={{ fontSize: "var(--t-xs)", color: "var(--ink-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              {o.financialStatus ?? "—"} · {o.fulfillmentStatus ?? "Pending"}
            </span>
            <span
              className="t-display"
              style={{ fontSize: "var(--t-sm)", color: "var(--cyan-3)", letterSpacing: "0.06em" }}
            >
              {formatMoney(o.totalPrice.amount, o.totalPrice.currencyCode)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
