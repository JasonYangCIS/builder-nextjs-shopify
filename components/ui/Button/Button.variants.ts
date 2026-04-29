import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-150",
    "focus-visible:outline-hidden focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40",
    "chamfer",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground border border-transparent",
          "hover:brightness-110",
          "[box-shadow:var(--glow-cyan-sm)]",
          "hover:[box-shadow:var(--glow-cyan-md)]",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground border border-transparent",
          "hover:brightness-110",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-secondary-foreground",
          "hover:border-[var(--cyan-line)] hover:bg-[rgba(61,217,214,0.06)] hover:text-foreground",
          "hover:[box-shadow:var(--glow-cyan-sm)]",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground border border-border",
          "hover:border-[var(--cyan-line)] hover:bg-[rgba(61,217,214,0.06)]",
        ].join(" "),
        ghost: [
          "border border-transparent text-secondary-foreground bg-transparent",
          "hover:border-border hover:bg-secondary/40 hover:text-foreground",
        ].join(" "),
        link: [
          "text-primary underline-offset-4 hover:underline border-transparent bg-transparent",
          "chamfer-sm",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2 text-xs tracking-[0.15em] uppercase",
        sm: "h-8 px-3 text-[10px] tracking-[0.15em] uppercase",
        lg: "h-12 px-8 text-xs tracking-[0.18em] uppercase",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
