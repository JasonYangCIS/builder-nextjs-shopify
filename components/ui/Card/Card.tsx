import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import styles from "./Card.module.scss";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative border bg-card text-card-foreground", styles.card, className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";
export default Card;
