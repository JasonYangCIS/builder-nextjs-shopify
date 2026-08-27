"use client";
import { Heart } from "lucide-react";
import { Button } from "@jasonyangcis/core-ui";
import { useWishlist } from "@/lib/wishlist/useWishlist";
import type { WishlistButtonProps } from "./WishlistButton.types";

export default function WishlistButton({ handle, className }: WishlistButtonProps) {
  const { isSaved, toggle, atCapacity } = useWishlist();
  const saved = isSaved(handle);
  const disabled = !saved && atCapacity;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    toggle(handle);
  }

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      size="icon"
      disabled={disabled}
      aria-pressed={saved}
      aria-label={
        disabled
          ? "Wishlist is full — remove an item to add more"
          : saved
            ? "Remove from wishlist"
            : "Add to wishlist"
      }
      title={disabled ? "Wishlist is full — remove an item to add more" : undefined}
      onClick={handleClick}
      className={className}
    >
      <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
    </Button>
  );
}

export type { WishlistButtonProps } from "./WishlistButton.types";
