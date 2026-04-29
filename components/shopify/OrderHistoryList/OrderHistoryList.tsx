"use client";
import useSWR from "swr";
import { formatDate, formatMoney } from "@/utils/date";
import styles from "./OrderHistoryList.module.scss";

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
    return <p className={`t-mono ${styles.scanText}`}>Loading transmissions...</p>;
  }
  if (data?.unauthenticated) {
    return <p className={`t-mono ${styles.authText}`}>Authentication required.</p>;
  }
  if (!data?.orders.length) {
    return <p className={`t-mono ${styles.scanText}`}>// No transmissions logged</p>;
  }

  return (
    <ul className={`flex flex-col gap-0 ${styles.list}`}>
      {data.orders.map((o) => (
        <li key={o.id} className={`p-4 ${styles.row}`}>
          <div className="flex items-center justify-between gap-4">
            <span className={`t-display ${styles.orderName}`}>{o.name}</span>
            <span className={`t-mono ${styles.orderDate}`}>{formatDate(o.processedAt)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className={`t-mono ${styles.orderStatus}`}>
              {o.financialStatus ?? "—"} · {o.fulfillmentStatus ?? "Pending"}
            </span>
            <span className={`t-display ${styles.orderAmount}`}>
              {formatMoney(o.totalPrice.amount, o.totalPrice.currencyCode)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
