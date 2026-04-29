"use client";

/**
 * React 19 logs a dev-only warning when a `<script>` tag is encountered while
 * rendering a React component. In our app this warning is benign — our only
 * `<script>` markup is JSON-LD emitted via `dangerouslySetInnerHTML` (so React
 * never sees it as a React element), and the rest of the noise comes from the
 * Builder.io editor preview iframe injecting its own scripts.
 *
 * The patch must be installed at module-load time, not inside `useEffect`,
 * because the warning fires during render — before any effect runs.
 */
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV !== "production" &&
  !(window as unknown as { __scriptWarningSilenced?: boolean }).__scriptWarningSilenced
) {
  (window as unknown as { __scriptWarningSilenced?: boolean }).__scriptWarningSilenced = true;

  const SCRIPT_WARNING = "Encountered a script tag while rendering React component";
  const original = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === "string" && first.includes(SCRIPT_WARNING)) return;
    original.apply(console, args as Parameters<typeof console.error>);
  };
}

export default function SilenceScriptTagWarning() {
  return null;
}
