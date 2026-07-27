"use client";

import { useSyncExternalStore } from "react";
import { isPreviewing } from "@builder.io/sdk-react";

const subscribeNoop = () => () => {};
const getServerSnapshot = () => false;

/**
 * isPreviewing() reads window.location.search, so it always returns false on
 * the server and can disagree with the client's first render. useSyncExternalStore
 * pins the hydration pass to the server snapshot (false), then reveals the real
 * value without a setState-in-effect render.
 */
export function useIsPreviewing(): boolean {
  return useSyncExternalStore(subscribeNoop, isPreviewing, getServerSnapshot);
}
