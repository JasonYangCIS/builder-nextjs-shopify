import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import type { InputProps } from "./Input.types";
import styles from "./Input.module.scss";

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full px-3 py-2 text-sm",
      "bg-input text-foreground",
      "border border-border",
      "placeholder:text-muted-foreground",
      "transition-all duration-150",
      "focus-visible:outline-hidden focus-visible:border-[var(--cyan-line)] focus-visible:[box-shadow:var(--glow-cyan-sm)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "font-mono tracking-wide",
      styles.input,
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
export default Input;
export type { InputProps } from "./Input.types";
