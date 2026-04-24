import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { "jsx-a11y": jsxA11y, import: importPlugin },
    rules: {
      "no-console": ["error", { allow: ["error", "warn"] }],
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./components",
              from: "./app",
              message: "components/ must not import from app/",
            },
            {
              target: "./lib",
              from: "./components",
              message: "lib/ must not import from components/",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env'][property.name=/^SHOPIFY_/]",
          message:
            "Read SHOPIFY_* env vars only via lib/env.ts to keep secrets server-only.",
        },
      ],
    },
  },
  {
    files: ["lib/env.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
