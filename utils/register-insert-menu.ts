import type { RegisteredComponent } from "@builder.io/sdk-react";

/** Group registered components in the Builder editor insert menu. */
export function groupComponents(
  groupName: string,
  components: RegisteredComponent[],
): RegisteredComponent[] {
  return components.map((c) => ({
    ...c,
    models: c.models,
    // Builder uses `friendlyName` for display, and we set a canonical `inputs` order.
    // The "category" hint lives in `models` / custom fields; SDKs vary, so we attach
    // a `tags` array many editors recognise.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...({ category: groupName } as any),
  }));
}
