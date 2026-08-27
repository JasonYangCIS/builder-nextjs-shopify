"use client";
import { useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";
import { SELECTED_PRODUCTS_MAX_HANDLES } from "@/lib/shopify/types";

const STORAGE_KEY = "wishlist:handles";
const SWR_KEY = "wishlist";

function readHandles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((h): h is string => typeof h === "string") : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const { data, isLoading, mutate } = useSWR<string[]>(SWR_KEY, readHandles, {
    revalidateOnFocus: false,
    fallbackData: [],
  });

  const handles = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) mutate();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [mutate]);

  const toggle = useCallback(
    (handle: string): boolean => {
      // Read fresh from localStorage rather than the hook's `handles` snapshot so a
      // concurrent write from another tab isn't clobbered by a stale in-memory value.
      const current = readHandles();
      let next: string[];
      if (current.includes(handle)) {
        next = current.filter((h) => h !== handle);
      } else if (current.length >= SELECTED_PRODUCTS_MAX_HANDLES) {
        return false;
      } else {
        next = [...current, handle];
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage disabled (e.g. Safari private browsing) or quota exceeded — leave
        // the in-memory list untouched rather than mutating state we can't persist.
        return false;
      }
      mutate(next);
      return true;
    },
    [mutate],
  );

  const isSaved = useCallback((handle: string) => handles.includes(handle), [handles]);
  const atCapacity = handles.length >= SELECTED_PRODUCTS_MAX_HANDLES;

  return { handles, isSaved, toggle, isLoading, atCapacity };
}
