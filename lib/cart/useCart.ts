"use client";
import useSWR from "swr";
import type { Cart } from "@/lib/shopify/types";

const fetcher = async (url: string): Promise<Cart | null> => {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error("Failed to load cart");
  const json = (await res.json()) as { cart: Cart | null };
  return json.cart;
};

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<Cart | null>("/api/cart", fetcher, {
    revalidateOnFocus: false,
  });
  return { cart: data ?? null, error, isLoading, mutate };
}
