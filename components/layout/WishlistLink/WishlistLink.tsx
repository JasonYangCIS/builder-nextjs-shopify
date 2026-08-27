"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist/useWishlist";
import styles from "./WishlistLink.module.scss";

export default function WishlistLink() {
  const { handles } = useWishlist();
  const count = handles.length;

  return (
    <Link
      href="/wishlist"
      aria-label={`Open wishlist, ${count} saved items`}
      data-has-items={count > 0 ? "true" : "false"}
      className={styles.trigger}
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
      {count > 0 && <span className={`t-mono ${styles.count}`}>{count}</span>}
    </Link>
  );
}
