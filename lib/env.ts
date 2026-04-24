import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  SHOPIFY_STORE_DOMAIN: z.string().min(1),
  SHOPIFY_STOREFRONT_API_TOKEN: z.string().min(1),
  SHOPIFY_STOREFRONT_API_VERSION: z.string().default("2024-10"),
  SHOPIFY_CUSTOMER_ACCOUNT_API_URL: z.string().url().optional(),
  SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID: z.string().min(1),
  SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI: z.string().url(),
  SHOPIFY_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_BUILDER_API_KEY: z.string().min(1),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be 32+ chars"),
  APP_ORIGIN: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof EnvSchema>;

function parseEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    const msg = Object.entries(formatted)
      .map(([k, v]) => `  ${k}: ${(v ?? []).join(", ")}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${msg}`);
  }
  return parsed.data;
}

export const env = parseEnv();
