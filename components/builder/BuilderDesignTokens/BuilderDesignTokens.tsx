/**
 * Side-effect import that registers shadcn/Tailwind design tokens with the
 * Builder.io editor's "Style" tab so editors can pick semantic tokens.
 *
 * Imported once from `builder-registry.ts`.
 */
import { register } from "@builder.io/sdk-react";

register("editor.settings", {
  designTokensOptional: false,
  designTokens: {
    colors: [
      { name: "Background", value: "var(--background)" },
      { name: "Foreground", value: "var(--foreground)" },
      { name: "Primary", value: "var(--primary)" },
      { name: "Primary Foreground", value: "var(--primary-foreground)" },
      { name: "Muted", value: "var(--muted)" },
      { name: "Muted Foreground", value: "var(--muted-foreground)" },
      { name: "Accent", value: "var(--accent)" },
      { name: "Border", value: "var(--border)" },
      { name: "Destructive", value: "var(--destructive)" },
    ],
    spacing: [
      { name: "XS", value: "0.25rem" },
      { name: "SM", value: "0.5rem" },
      { name: "MD", value: "1rem" },
      { name: "LG", value: "2rem" },
      { name: "XL", value: "4rem" },
    ],
    fontFamily: [
      { name: "Sans", value: "var(--font-sans)" },
      { name: "Mono", value: "var(--font-mono)" },
    ],
  },
});

export default function BuilderDesignTokens() {
  return null;
}
