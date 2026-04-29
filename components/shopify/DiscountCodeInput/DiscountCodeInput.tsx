"use client";
import { useState, useTransition } from "react";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Label from "@/components/ui/Label/Label";
import { useCart } from "@/lib/cart/useCart";

export default function DiscountCodeInput() {
  const { cart, mutate } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const codes = cart?.discountCodes ?? [];

  function apply(newCodes: string[]) {
    setError(null);
    start(async () => {
      const res = await fetch("/api/cart/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountCodes: newCodes }),
        credentials: "same-origin",
      });
      const json = (await res.json()) as { userErrors?: { message: string }[] };
      if (json.userErrors?.length) {
        setError(json.userErrors[0].message);
      } else {
        setCode("");
      }
      await mutate();
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        apply([...codes.map((c) => c.code), code.trim()]);
      }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="discount-code">Discount code</Label>
      <div className="flex gap-2">
        <Input
          id="discount-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER CODE"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "discount-error" : undefined}
        />
        <Button type="submit" size="sm" disabled={pending || !code.trim()}>
          Apply
        </Button>
      </div>
      {error && (
        <p
          id="discount-error"
          role="alert"
          className="t-mono"
          style={{ fontSize: "var(--t-xs)", color: "var(--xenosphere-danger)", letterSpacing: "0.1em" }}
        >
          {error}
        </p>
      )}
      {codes.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Applied codes">
          {codes.map((c) => (
            <li
              key={c.code}
              className="inline-flex items-center gap-2 t-mono"
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                padding: "3px 8px",
                border: "1px solid var(--cyan-line)",
                background: "var(--cyan-soft)",
                color: "var(--cyan-3)",
                clipPath: "var(--chamfer-sm)",
              }}
            >
              <span>{c.code}</span>
              <button
                type="button"
                onClick={() => apply(codes.filter((x) => x.code !== c.code).map((x) => x.code))}
                aria-label={`Remove ${c.code}`}
                style={{ background: "none", border: "none", color: "var(--cyan-2)", cursor: "pointer", padding: "0", lineHeight: 1 }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
