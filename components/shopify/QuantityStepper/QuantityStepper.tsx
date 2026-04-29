"use client";
import styles from "./QuantityStepper.module.scss";

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
    <div className={`inline-flex items-center ${styles.group}`} role="group" aria-label={ariaLabel}>
      <StepperBtn
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        –
      </StepperBtn>
      <span className={`t-mono ${styles.value}`} aria-live="polite">
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
      className={styles.btn}
    >
      {children}
    </button>
  );
}
