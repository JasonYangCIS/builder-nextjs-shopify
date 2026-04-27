import "server-only";
import { fetchOneEntry, fetchEntries } from "@builder.io/sdk-react";
import { config, type BuilderModelName } from "@/config";

export async function getBuilderPage(urlPath: string) {
  return fetchOneEntry({
    model: config.models.page,
    apiKey: config.apiKey,
    userAttributes: { urlPath },
  });
}

export async function getBuilderEntry(model: BuilderModelName, query?: Record<string, unknown>) {
  return fetchOneEntry({
    model,
    apiKey: config.apiKey,
    query,
  });
}

export async function getBuilderProduct(handle: string) {
  return fetchOneEntry({
    model: config.models.product,
    apiKey: config.apiKey,
    userAttributes: { urlPath: `/products/${handle}`, handle },
    query: { "data.handle": handle },
  });
}

export async function listBuilderEntries(model: BuilderModelName, limit = 100) {
  return fetchEntries({
    model,
    apiKey: config.apiKey,
    limit,
  });
}
