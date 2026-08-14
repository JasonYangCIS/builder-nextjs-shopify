"use client";
import useSWR, { mutate } from "swr";

const CART_DRAWER_KEY = "cart-drawer-open";

export function useCartDrawer() {
  const { data } = useSWR<boolean>(CART_DRAWER_KEY, null, { fallbackData: false });

  const setOpen = (open: boolean) => {
    void mutate(CART_DRAWER_KEY, open, { revalidate: false });
  };

  return { open: data ?? false, setOpen };
}
