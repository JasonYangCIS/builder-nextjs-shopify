"use client";
import { useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";

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
    (handle: string) => {
      const next = handles.includes(handle)
        ? handles.filter((h) => h !== handle)
        : [...handles, handle];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      mutate(next);
    },
    [handles, mutate],
  );

  const isSaved = useCallback((handle: string) => handles.includes(handle), [handles]);

  return { handles, isSaved, toggle, isLoading };
}
