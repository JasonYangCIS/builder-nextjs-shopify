"use client";

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled,
  ariaLabel = "Quantity",
}: QuantityStepperProps) {
  return (
    <div
      className="inline-flex items-center"
      role="group"
      aria-label={ariaLabel}
      style={{ border: "1px solid var(--border)", clipPath: "var(--chamfer-sm)" }}
    >
      <StepperBtn
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        –
      </StepperBtn>
      <span
        className="t-mono"
        aria-live="polite"
        style={{
          minWidth: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "var(--t-sm)",
          color: "var(--ink-0)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          letterSpacing: "0.1em",
        }}
      >
        {value}
      </span>
      <StepperBtn
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </StepperBtn>
    </div>
  );
}

function StepperBtn({
  children,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: disabled ? "var(--ink-3)" : "var(--ink-1)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "16px",
        fontFamily: "var(--font-mono)",
        transition: "color 0.16s, background 0.16s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.color = "var(--cyan-3)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.color = "var(--ink-1)";
      }}
    >
      {children}
    </button>
  );
}
