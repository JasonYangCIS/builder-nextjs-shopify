"use client";
import { Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button/Button";

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
    <div className="inline-flex items-center gap-2" role="group" aria-label={ariaLabel}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[2ch] text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
