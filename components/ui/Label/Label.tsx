"use client";
import { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/utils/cn";
import type { LabelProps } from "./Label.types";

const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn("t-eyebrow", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";
export default Label;
export type { LabelProps } from "./Label.types";
