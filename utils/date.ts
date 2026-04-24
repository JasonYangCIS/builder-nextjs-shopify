export function formatDate(input: string | Date, locale = "en-US"): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

export function formatMoney(amount: string | number, currencyCode = "USD", locale = "en-US"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(n);
}
